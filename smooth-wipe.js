/** GPU interpolation of signed geometric distance fields, at display refresh. */
class SmoothWipe {
  constructor(canvas){
    this.canvas=canvas;
    this.available=false;
    this.ready=this.initialize().catch(error=>{this.error=error.message;return false;});
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();this.available=false;});
    canvas.addEventListener('webglcontextrestored',()=>{this.ready=this.initialize().catch(()=>false);});
  }

  async initialize(){
    const gl=this.canvas.getContext('webgl',{
      alpha:true,antialias:false,depth:false,stencil:false,
      premultipliedAlpha:true,powerPreference:'high-performance',
    });
    if(!gl||!gl.getExtension('OES_standard_derivatives'))return false;
    this.gl=gl;
    const [metaResponse,fieldResponse]=await Promise.all([
      fetch('/assets/wipe-fields.json'),fetch('/assets/wipe-fields.bin.gz'),
    ]);
    if(!metaResponse.ok||!fieldResponse.ok)throw new Error('Could not load transition geometry.');
    const meta=await metaResponse.json();
    const bytes=new Uint8Array(await new Response(fieldResponse.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer());
    if(bytes.length!==meta.width*meta.height*4)throw new Error('Invalid transition geometry.');
    if(meta.filter==='sub'){
      const stride=meta.width*4;
      for(let row=0;row<bytes.length;row+=stride){
        for(let i=row+4;i<row+stride;i++)bytes[i]+=bytes[i-4];
      }
    }
    this.meta=meta;

    const vertex=`
      attribute vec2 aPosition;
      varying vec2 vUv;
      void main(){vUv=vec2(aPosition.x*.5+.5,.5-aPosition.y*.5);gl_Position=vec4(aPosition,0.,1.);}
    `;
    const fragment=`
      #extension GL_OES_standard_derivatives : enable
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uFields;
      uniform vec2 uAtlasSize;
      uniform vec2 uTileSize;
      uniform vec2 uFieldSize;
      uniform float uColumns;
      uniform vec4 uFrames;
      uniform float uMix;
      uniform float uSolid;
      uniform vec3 uPurple;
      uniform vec3 uGray;
      vec2 sampleField(float frame){
        vec2 origin=vec2(mod(frame,uColumns),floor(frame/uColumns))*uTileSize;
        vec2 uv=(origin+vec2(1.5)+vUv*(uFieldSize-1.))/uAtlasSize;
        vec4 encoded=texture2D(uFields,uv);
        return vec2(dot(encoded.rg,vec2(65280.,255.)),dot(encoded.ba,vec2(65280.,255.)))/65535.*2.-1.;
      }
      void main(){
        if(uSolid>.5){gl_FragColor=vec4(uPurple,1.);return;}
        vec2 a=sampleField(uFrames.x),b=sampleField(uFrames.y);
        vec2 c=sampleField(uFrames.z),d=sampleField(uFrames.w);
        float t=uMix;
        vec2 field=.5*((2.*b)+(-a+c)*t+(2.*a-5.*b+4.*c-d)*t*t+(-a+3.*b-3.*c+d)*t*t*t);
        // Bound interpolation to avoid phantom islands at contour splits.
        field=clamp(field,min(b,c),max(b,c));
        vec2 aa=max(fwidth(field)*.65,vec2(.000015));
        vec2 coverage=smoothstep(-aa,aa,field);
        float purple=coverage.x,gray=coverage.y*(1.-purple);
        gl_FragColor=vec4(uPurple*purple+uGray*gray,purple+gray);
      }
    `;
    const compile=(type,source)=>{
      const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(shader));
      return shader;
    };
    const vs=compile(gl.VERTEX_SHADER,vertex),fs=compile(gl.FRAGMENT_SHADER,fragment);
    const program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
    gl.deleteShader(vs);gl.deleteShader(fs);gl.useProgram(program);
    this.program=program;
    this.uniforms=Object.fromEntries(['uAtlasSize','uTileSize','uFieldSize','uColumns','uFrames','uMix','uSolid','uPurple','uGray'].map(name=>[name,gl.getUniformLocation(program,name)]));
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    const position=gl.getAttribLocation(program,'aPosition');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT,1);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,meta.width,meta.height,0,gl.RGBA,gl.UNSIGNED_BYTE,bytes);
    gl.uniform1i(gl.getUniformLocation(program,'uFields'),0);
    gl.uniform2f(this.uniforms.uAtlasSize,meta.width,meta.height);
    gl.uniform2f(this.uniforms.uTileSize,meta.tileWidth,meta.tileHeight);
    gl.uniform2f(this.uniforms.uFieldSize,meta.fieldWidth,meta.fieldHeight);
    gl.uniform1f(this.uniforms.uColumns,meta.columns);
    this.available=true;
    this.resize();this.updateColors();this.render(0);
    // Warm up the shader before the first click, never inside the motion loop.
    gl.finish();
    return true;
  }

  updateColors(){
    const style=getComputedStyle(document.documentElement);
    const color=(name,fallback)=>{
      let value=style.getPropertyValue(name).trim().replace('#','')||fallback;
      if(value.length===3)value=[...value].map(c=>c+c).join('');
      if(!/^[0-9a-f]{6}$/i.test(value))value=fallback;
      return [0,2,4].map(i=>parseInt(value.slice(i,i+2),16)/255);
    };
    this.gl.uniform3fv(this.uniforms.uPurple,color('--purple','5f28f6'));
    this.gl.uniform3fv(this.uniforms.uGray,color('--gray','d0d2cf'));
  }

  resize(){
    if(!this.available)return;
    const ratio=Math.min(devicePixelRatio||1,2,Math.sqrt(2300000/(innerWidth*innerHeight)));
    const width=Math.round(innerWidth*ratio),height=Math.round(innerHeight*ratio);
    if(this.canvas.width!==width||this.canvas.height!==height){
      this.canvas.width=width;this.canvas.height=height;this.gl.viewport(0,0,width,height);
    }
  }

  render(progress){
    if(!this.available)return false;
    const {gl,meta,uniforms:u}=this;
    const solid=progress>=meta.coverEnd&&progress<=meta.revealStart;
    const uncover=progress>meta.revealStart;
    const count=uncover?meta.revealCount:meta.coverCount;
    const offset=uncover?meta.coverCount:0;
    let time=uncover?(progress-meta.revealStart)/(1-meta.revealStart):progress/meta.coverEnd;
    time=Math.max(0,Math.min(1,time));
    time=time*time*(3-2*time);
    const position=time*(count-1),index=Math.floor(position);
    const at=i=>offset+Math.max(0,Math.min(count-1,i));
    gl.uniform4f(u.uFrames,at(index-1),at(index),at(index+1),at(index+2));
    gl.uniform1f(u.uMix,position-index);gl.uniform1f(u.uSolid,solid?1:0);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    return true;
  }
}
window.SmoothWipe=SmoothWipe;

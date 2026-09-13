/** Elastic ink typography. Sample the spring once; the compositor plays it. */
class KineticHeading {
  constructor(){
    this.motion=matchMedia('(prefers-reduced-motion: reduce)');
    this.pointer=matchMedia('(hover: hover) and (pointer: fine)');
    this.animations=[];
    this.glyphs=[];
    this.generation=0;
    this.entering=false;
    this.onMotion=()=>{if(this.motion.matches)this.settle();};
    this.onVisibility=()=>{if(document.hidden)this.settle();};
    this.onPointer=()=>{if(!this.pointer.matches)this.release();};
    this.motion.addEventListener('change',this.onMotion);
    this.pointer.addEventListener('change',this.onPointer);
    document.addEventListener('visibilitychange',this.onVisibility);
  }

  // Damping .8 and response .4s: momentum with a small, fast overshoot.
  residual(seconds){
    const time=Math.max(0,seconds),omega=2*Math.PI/.4,damping=.8;
    const damped=omega*Math.sqrt(1-damping*damping);
    return Math.exp(-damping*omega*time)*(Math.cos(damped*time)+damping*omega/damped*Math.sin(damped*time));
  }

  frames(position,direction,layer){
    const energy=this.soft ? .36 : 1;
    return Array.from({length:61},(_,index)=>{
      const offset=index/60,time=offset*.8;
      const residue=index===60?0:this.residual(time-layer*.055);
      const x=(position*.30+direction*.08)*residue*energy;
      const y=(.98+Math.abs(position)*.16)*residue*energy;
      const angle=-(position*12+direction*7)*residue*energy;
      const opacity=layer
        ?Math.sin(Math.PI*Math.min(1,Math.max(0,(time-.015)/.54)))*(layer===1?.55:.38)
        :Math.min(1,time/.12);
      return {
        offset,
        opacity:index===60?(layer?0:1):opacity*(layer&&this.soft ? .4 : 1),
        transform:`translate3d(${x.toFixed(4)}em,${y.toFixed(4)}em,0) rotate(${angle.toFixed(3)}deg) scale(${(1-.16*residue*energy).toFixed(4)},${(1+.38*residue*energy).toFixed(4)})`,
      };
    });
  }

  track(element,frames,options){
    const animation=element.animate(frames,options);
    this.animations.push(animation);
    return animation;
  }

  mount(heading,{delay=0,direction=0}={}){
    this.settle();
    this.heading=heading;
    this.soft=heading.classList.contains('kinetic-soft');
    const label=heading.textContent;
    const characters=Array.from(label);
    const word=document.createElement('span');
    word.className='heading-letters';
    word.setAttribute('aria-hidden','true');
    heading.setAttribute('aria-label',label);
    this.glyphs=characters.map(character=>{
      const glyph=document.createElement('span');
      glyph.className='type-glyph';
      for(const name of ['type-echo type-echo--outline','type-echo type-echo--solid','type-ink']){
        const layer=document.createElement('span');
        layer.className=name;
        layer.textContent=character;
        glyph.append(layer);
      }
      word.append(glyph);
      return glyph;
    });
    heading.replaceChildren(word);
    heading.addEventListener('pointermove',event=>this.bend(event),{passive:true});
    heading.addEventListener('pointerleave',()=>this.release(),{passive:true});
    if(this.motion.matches||document.hidden||!heading.animate)return;

    const generation=this.generation;
    const order=this.glyphs.map((_,i)=>i).sort((a,b)=>direction
      ?direction*(a-b)
      :Math.abs(a-(characters.length-1)/2)-Math.abs(b-(characters.length-1)/2));
    this.entering=true;
    this.glyphs.forEach((glyph,index)=>{
      const position=characters.length>1?index/(characters.length-1)*2-1:0;
      const stagger=order.indexOf(index)*Math.min(48,240/Math.max(1,characters.length-1));
      const options={duration:800,delay:delay+stagger,fill:'backwards',easing:'linear'};
      this.track(glyph.querySelector('.type-ink'),this.frames(position,direction,0),options);
      this.track(glyph.querySelector('.type-echo--solid'),this.frames(position,direction,1),options);
      this.track(glyph.querySelector('.type-echo--outline'),this.frames(position,direction,2),options);
    });
    Promise.allSettled(this.animations.map(animation=>animation.finished)).then(()=>{
      if(generation!==this.generation)return;
      this.animations=[];
      this.entering=false;
    });
  }

  exit(direction=1){
    if(!this.heading||this.motion.matches||document.hidden||!this.heading.animate)return;
    // Capture the displayed state so a second navigation never resets a letter.
    const states=this.glyphs.map(glyph=>{
      const ink=glyph.querySelector('.type-ink'),style=getComputedStyle(ink);
      return {ink,transform:style.transform,opacity:style.opacity};
    });
    this.settle();
    this.entering=true;
    states.forEach(({ink,transform,opacity},index)=>{
      this.track(ink,[
        {transform,opacity},
        {transform:`translate3d(${direction*.22}em,-.34em,0) rotate(${-direction*9}deg) scale(.94,1.16)`,opacity:0},
      ],{duration:300,delay:index*16,easing:'cubic-bezier(.23,1,.32,1)',fill:'forwards'});
    });
  }

  bend(event){
    if(this.entering||this.motion.matches||!this.pointer.matches||event.pointerType!=='mouse')return;
    const bounds=this.heading.getBoundingClientRect();
    const point=(event.clientX-bounds.left)/bounds.width;
    this.glyphs.forEach((glyph,index)=>{
      const distance=(index+.5)/this.glyphs.length-point;
      const strength=Math.max(0,1-Math.abs(distance)*4);
      glyph.style.transform=`translate3d(0,${-strength*9}px,0) rotate(${distance*strength*18}deg) scale(1,${1+strength*.07})`;
    });
  }

  release(){this.glyphs.forEach(glyph=>glyph.style.removeProperty('transform'));}

  settle(){
    this.generation++;
    this.animations.forEach(animation=>animation.cancel());
    this.animations=[];
    this.entering=false;
    this.release();
  }

  destroy(){
    this.settle();
    this.motion.removeEventListener('change',this.onMotion);
    this.pointer.removeEventListener('change',this.onPointer);
    document.removeEventListener('visibilitychange',this.onVisibility);
  }
}
window.KineticHeading=KineticHeading;

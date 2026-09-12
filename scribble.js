/** Cover the current page, commit a route/content change, then uncover it. */
class ScribbleTransition {
  constructor({overlay,duration=1867,data=window.SCRIBBLE_WIPE}) {
    this.overlay=overlay;
    this.duration=duration;
    this.data=data;
    this.gray=overlay.querySelector('#gray-stroke');
    this.purple=overlay.querySelector('#purple-stroke');
    this.fallback=overlay.querySelector('#wipe-fallback');
    this.canvas=overlay.querySelector('#smooth-wipe');
    this.renderer=new SmoothWipe(this.canvas);
    this.motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
    this.active=false;
    this.raf=0;
    this.finish=null;
    this.onVisibility=()=>{if(document.hidden)this.finish?.();};
    this.onMotion=()=>{if(this.motionQuery.matches)this.finish?.();};
    document.addEventListener('visibilitychange',this.onVisibility);
    this.motionQuery.addEventListener('change',this.onMotion);
  }

  async run(commit,{onStart}={}) {
    if(this.active)throw new Error('Wait for the active transition before starting another.');
    if(this.motionQuery.matches||document.hidden){commit();return Promise.resolve();}
    await this.renderer.ready;
    if(this.motionQuery.matches||document.hidden){commit();return;}
    const gpu=this.renderer.available;
    this.canvas.hidden=!gpu;
    this.fallback.style.display=gpu?'none':'block';
    if(gpu){this.renderer.resize();this.renderer.updateColors();this.renderer.render(0);}
    this.active=true;
    onStart?.();
    this.overlay.removeAttribute('hidden');
    this.overlay.dataset.phase='covering';
    const started=performance.now();
    const timestamps=[];
    this.overlay.dataset.renderer=gpu?'gpu-interpolated':'svg-fallback';
    let committed=false,previous=-1,finished=false;
    return new Promise((resolve,reject)=>{
      const swap=()=>{
        if(!committed){
          committed=true;
          commit({remainingMs:Math.max(0,started+this.duration-performance.now())});
        }
      };
      const cleanup=()=>{
        cancelAnimationFrame(this.raf);
        this.gray.setAttribute('d','');
        this.purple.setAttribute('d','');
        this.overlay.setAttribute('hidden','');
        this.overlay.dataset.phase='idle';
        this.active=false;
        this.finish=null;
        const intervals=timestamps.slice(1).map((time,i)=>time-timestamps[i]);
        const sorted=[...intervals].sort((a,b)=>a-b);
        this.lastRun={
          renderer:this.overlay.dataset.renderer,
          frames:timestamps.length,
          averageFps:intervals.length?1000/(intervals.reduce((a,b)=>a+b,0)/intervals.length):0,
          p95FrameMs:sorted[Math.floor(sorted.length*.95)]||0,
          longFrames:intervals.filter(ms=>ms>25).length,
          elapsedMs:performance.now()-started,
        };
      };
      const end=()=>{
        if(finished)return;
        finished=true;
        try{swap();cleanup();resolve();}catch(error){cleanup();reject(error);}
      };
      this.finish=end;
      const tick=now=>{
        timestamps.push(now);
        const progress=Math.min(1,(now-started)/this.duration);
        const frame=Math.min(this.data.frames.length-1,Math.floor(progress*this.data.frames.length));
        if(gpu&&this.renderer.available){
          this.renderer.resize();
          this.renderer.render(progress);
        }else if(frame!==previous){
          this.overlay.dataset.renderer='svg-fallback';
          this.canvas.hidden=true;
          this.fallback.style.display='block';
          const paths=this.data.frames[frame];
          this.gray.setAttribute('d',paths.gray);
          this.purple.setAttribute('d',paths.purple);
          this.overlay.dataset.frame=String(frame);
          previous=frame;
        }
        if((gpu?progress>=.5:frame>=this.data.coverFrame)&&!committed){
          this.purple.setAttribute('d','M0 0H1210V680H0Z');
          this.overlay.dataset.phase='revealing';
          try{swap();}catch(error){finished=true;cleanup();reject(error);return;}
        }
        if(progress<1)this.raf=requestAnimationFrame(tick);
        else end();
      };
      this.raf=requestAnimationFrame(tick);
    });
  }

  destroy(){
    this.finish?.();
    document.removeEventListener('visibilitychange',this.onVisibility);
    this.motionQuery.removeEventListener('change',this.onMotion);
  }
}
window.ScribbleTransition=ScribbleTransition;

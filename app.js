(() => {
  const routes={'/':'home','/about':'about','/contact':'contact'};
  const titles={'/':'Lizzie — a little bit of everything','/about':'My world — Lizzie','/contact':'Say hello — Lizzie'};
  const normalize=value=>value==='/'?'/':value.replace(/\/$/,'');
  const outlet=document.getElementById('page-outlet');
  const transition=new ScribbleTransition({overlay:document.getElementById('page-transition')});
  const headingMotion=new KineticHeading();
  const portfolioMotion=new PortfolioMotion(outlet);
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const positions=new Map();
  let currentPath=normalize(location.pathname),queued=null,routing=false,historyEpoch=0;
  let pageAnimations=[],revealObserver=null;
  let entryKey=history.state?.lizzieKey||crypto.randomUUID();
  history.replaceState({...history.state,lizzieKey:entryKey},'');
  history.scrollRestoration='manual';

  function settlePage(){
    pageAnimations.forEach(animation=>animation.cancel());
    pageAnimations=[];
    revealObserver?.disconnect();
  }
  function pauseMedia(){outlet.querySelectorAll('video').forEach(video=>video.pause());}
  function reveal(element,delay=0,index=0){
    if(motion.matches||document.hidden||!element.animate)return;
    const rotation=element.style.getPropertyValue('--rotation')||'0deg';
    const print=element.matches('.photo-print,.pokemon-sheet,.film-print');
    const base=getComputedStyle(element).transform;
    const animation=element.animate([
      {opacity:0,transform:print?`translate3d(0,48px,0) rotate(calc(${rotation} - 7deg)) scale(.96)`:`translate3d(0,${24+index%2*8}px,0)`},
      {opacity:1,transform:base==='none'?'none':base}
    ],{duration:print?640:520,delay,easing:'cubic-bezier(.23,1,.32,1)',fill:'backwards'});
    pageAnimations.push(animation);
    animation.finished.then(()=>{pageAnimations=pageAnimations.filter(item=>item!==animation);}).catch(()=>{});
  }
  function enhancePage(delay){
    portfolioMotion.mount(delay);
    if(!portfolioMotion.available){
      outlet.querySelectorAll('[data-enter]').forEach((element,index)=>reveal(element,delay+100+index*65,index));
      revealObserver=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(!entry.isIntersecting)continue;
        reveal(entry.target,0);
        revealObserver.unobserve(entry.target);
      }
    },{threshold:.08});
      outlet.querySelectorAll('[data-reveal]').forEach(element=>revealObserver.observe(element));
    }
    outlet.querySelectorAll('video').forEach(video=>{
      video.muted=true;
      video.addEventListener('error',()=>{
        const fallback=document.createElement('a');
        fallback.href=video.querySelector('source').src;
        fallback.textContent='Open the cat clip';
        fallback.className='text-link';
        video.after(fallback);
      },{once:true});
    });
    outlet.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{
      img.style.objectFit='contain';
      img.style.minHeight='120px';
    },{once:true}));
  }
  function mount(path,{historyMode='none',focus=false,entryDelay=0,direction=0,restoreKey=null}={}){
    pauseMedia();settlePage();portfolioMotion.clearPage();
    const page=routes[path];
    outlet.replaceChildren(document.getElementById(`page-${page}`).content.cloneNode(true));
    headingMotion.mount(outlet.querySelector('h1'),{delay:entryDelay,direction});
    currentPath=path;
    document.title=titles[path];
    document.querySelectorAll('nav [data-link]').forEach(link=>{
      if(link.getAttribute('href')===path)link.setAttribute('aria-current','page');
      else link.removeAttribute('aria-current');
    });
    if(historyMode==='push'){
      entryKey=crypto.randomUUID();
      history.pushState({lizzieKey:entryKey},'',path);
    }else if(restoreKey)entryKey=restoreKey;
    const y=restoreKey?(positions.get(restoreKey)||0):0;
    portfolioMotion.jumpTo(y);
    if(!restoreKey&&historyMode==='none'&&location.hash){
      const anchor=document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if(anchor)portfolioMotion.toAnchor(anchor,true);
    }
    enhancePage(entryDelay);
    if(focus)outlet.querySelector('h1').focus({preventScroll:true});
    document.getElementById('route-announcement').textContent=focus?titles[path]:'';
  }
  async function navigate(path,historyMode='push',focus=true,restoreKey=null){
    path=normalize(path);
    if(!routes[path])return;
    queued={path,historyMode,focus,restoreKey,historyEpoch};
    if(routing)return;
    routing=true;
    document.body.dataset.navigating='true';
    try{
      while(queued){
        const next=queued;queued=null;
        if(next.path===currentPath){
          if(next.restoreKey){entryKey=next.restoreKey;portfolioMotion.jumpTo(positions.get(entryKey)||0);}
          continue;
        }
        positions.set(entryKey,window.scrollY);
        const paths=Object.keys(routes);
        const direction=Math.sign(paths.indexOf(next.path)-paths.indexOf(currentPath));
        await transition.run(timing=>mount(next.path,{
          ...next,direction,
          entryDelay:Math.max(0,(timing?.remainingMs??0)-280),
          historyMode:next.historyEpoch===historyEpoch?next.historyMode:'none',
        }),{onStart:()=>{headingMotion.exit(direction);pauseMedia();portfolioMotion.beforeNavigate();}});
      }
    }catch(error){
      console.error('Page transition failed',error);
      headingMotion.settle();transition.finish?.();
      if(queued){const next=queued;queued=null;mount(next.path,next);}
    }finally{
      routing=false;document.body.dataset.navigating='false';portfolioMotion.afterNavigate();
    }
  }
  document.addEventListener('click',event=>{
    const link=event.target.closest?.('a');
    if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    if(link.target&&link.target!=='_self')return;
    const url=new URL(link.href);
    if(url.origin!==location.origin||!routes[normalize(url.pathname)])return;
    if(url.hash&&normalize(url.pathname)===currentPath){
      const target=document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if(!target)return;
      event.preventDefault();
      positions.set(entryKey,window.scrollY);
      entryKey=crypto.randomUUID();
      history.pushState({lizzieKey:entryKey},'',url.pathname+url.hash);
      portfolioMotion.toAnchor(target,event.detail===0||link.classList.contains('skip-link'));
      if(link.classList.contains('skip-link'))target.focus({preventScroll:true});
      return;
    }
    if(!link.hasAttribute('data-link'))return;
    event.preventDefault();navigate(url.pathname,'push',true);
  });
  window.addEventListener('popstate',event=>{
    historyEpoch++;
    navigate(location.pathname,'none',true,event.state?.lizzieKey);
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden){pauseMedia();settlePage();}});
  motion.addEventListener('change',()=>{if(motion.matches)settlePage();});
  mount(routes[currentPath]?currentPath:'/');
  window.pageRouter={navigate,get currentPath(){return currentPath;},get active(){return routing;}};
  window.pageTransition=transition;
  window.headingMotion=headingMotion;
  window.portfolioMotion=portfolioMotion;
})();

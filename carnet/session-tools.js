// Optional tools: no notebook storage changes and no imposed time limit.
export class SessionClock {
 constructor(now=()=>Date.now()){this.now=now;this.reset();}
 reset(limit=0){this.limit=limit;this.elapsed=0;this.started=null;this.done=false;}
 start(){if(this.started===null&&!this.done)this.started=this.now();}
 pause(){if(this.started!==null){this.elapsed+=Math.max(0,this.now()-this.started);this.started=null;}}
 value(){const elapsed=this.elapsed+(this.started===null?0:Math.max(0,this.now()-this.started));return this.limit?Math.max(0,this.limit-elapsed):elapsed;}
 tick(){if(this.limit&&this.value()===0&&!this.done){this.pause();this.done=true;return true;}return false;}
}
export class ScreenAwake {
 constructor(api,visible,report){this.api=api;this.visible=visible;this.report=report;this.wanted=false;this.lock=null;this.generation=0;}
 async enable(){this.wanted=true;return this.acquire();}
 async acquire(){if(!this.wanted||!this.visible()||this.lock)return;const generation=++this.generation;
  if(!this.api){this.report('Fonction indisponible dans ce navigateur.');return;}
  try{const lock=await this.api.request('screen');if(generation!==this.generation||!this.wanted||!this.visible()){await lock.release();return;}this.lock=lock;this.report('Écran maintenu allumé.');lock.addEventListener('release',()=>{if(this.lock!==lock)return;this.lock=null;this.report(this.wanted?'Maintien interrompu. Réessayez ou revenez dans cet onglet.':'Maintien désactivé.');});}
  catch{if(generation===this.generation)this.report('Maintien indisponible ou refusé (batterie ou navigateur). Vous pouvez réessayer.');}
 }
 async suspend(){this.generation++;const lock=this.lock;this.lock=null;if(lock)await lock.release().catch(()=>{});}
 async disable(){this.wanted=false;await this.suspend();this.report('Maintien désactivé.');}
}
export function setupSessionTools($){
 const clock=new SessionClock(),awake=new ScreenAwake(navigator.wakeLock,()=>document.visibilityState==='visible',message=>$('wakeStatus').textContent=message);
 let audio=null,validClock=true;
 function draw(){const ms=clock.value(),seconds=clock.limit?Math.ceil(ms/1000):Math.floor(ms/1000);$('clockValue').textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');$('clockStart').textContent=clock.done?'Terminé':clock.started!==null?'En cours':clock.elapsed?'Reprendre':'Démarrer';$('clockStart').disabled=!validClock||clock.started!==null||clock.done;$('clockPause').disabled=clock.started===null;}
 function reset(){const minutes=Number($('timerMinutes').value);if($('clockMode').value==='timer'&&(!Number.isFinite(minutes)||minutes<1||minutes>1440)){validClock=false;clock.pause();draw();$('clockStatus').textContent='Choisissez une durée de 1 à 1 440 minutes.';return false;}validClock=true;clock.reset($('clockMode').value==='timer'?minutes*60000:0);$('clockStatus').textContent='Durée libre, sans limite imposée.';draw();return true;}
 $('wakeToggle').onchange=()=>{$('wakeToggle').checked?awake.enable():awake.disable();};$('wakeRetry').onclick=()=>{if($('wakeToggle').checked)awake.acquire();};
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){awake.acquire();tick();}else awake.suspend();});
 window.addEventListener('pagehide',()=>awake.disable());
 $('clockStart').onclick=()=>{if(!validClock)return;clock.start();if($('clockAlert').checked){try{audio??=new (window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});}catch{}}draw();};
 $('clockPause').onclick=()=>{clock.pause();draw();};$('clockReset').onclick=reset;
 $('clockMode').onchange=()=>{$('timerLabel').hidden=$('clockMode').value!=='timer';reset();};$('timerMinutes').onchange=reset;
 function tick(){if(clock.tick()){$('clockStatus').textContent='Minuteur terminé. Vous pouvez continuer votre séance librement.';if($('clockAlert').checked){try{navigator.vibrate?.([200,100,200]);if(audio?.state==='running'){const o=audio.createOscillator(),g=audio.createGain();g.gain.value=.1;o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.3);}}catch{}}}draw();}
 setInterval(tick,250);reset();if(!navigator.wakeLock)$('wakeStatus').textContent='Fonction indisponible dans ce navigateur.';
 return {leave(){clock.pause();draw();$('wakeToggle').checked=false;awake.disable();},reset(){validClock=true;clock.reset();$('clockMode').value='stopwatch';$('timerLabel').hidden=true;$('clockStatus').textContent='Durée libre, sans limite imposée.';draw();}};
}

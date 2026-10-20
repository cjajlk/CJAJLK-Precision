const button=document.getElementById('fullscreen');
const message=document.getElementById('screenMessage');
let pending=false;
function refresh(){
 const active=!!document.fullscreenElement;
 button.textContent=active?'QUITTER ⛶':'PLEIN ÉCRAN ⛶';
 button.setAttribute('aria-label',active?'Quitter le plein écran':'Passer en plein écran');
 button.setAttribute('aria-pressed',String(active));
}
button.addEventListener('click',async()=>{
 if(pending)return;
 message.textContent='';
 if(!document.fullscreenElement&&(!document.documentElement.requestFullscreen||document.fullscreenEnabled===false)){
  message.textContent='Le plein écran n’est pas disponible dans ce navigateur.';return;
 }
 pending=true;button.disabled=true;
 try{
  if(document.fullscreenElement)await document.exitFullscreen();
  else await document.documentElement.requestFullscreen();
 }catch{
  message.textContent='Le plein écran a été refusé. Réessayez dans Chrome ou Samsung Internet.';
 }finally{pending=false;button.disabled=false;refresh();}
});
document.addEventListener('fullscreenchange',()=>{message.textContent='';refresh();window.dispatchEvent(new Event('resize'));});
refresh();

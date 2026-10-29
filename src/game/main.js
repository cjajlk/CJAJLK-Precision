import * as T from '../../assets/vendor/three.module.js';
import { TargetCarrier } from './carrier.js';
import { scoreAt, WEAPONS } from './rules.js';
import { SPORT_TARGET, mmToM, mToMM, scoreSportMM, drawSportTarget } from './target-spec.js';
import { AimFilter, comfortFov, sightRadiusPixels } from './aim.js';
import { acceptsSpace } from './input.js';
import { groupStats, readSessions, saveSession } from './groups.js';
const $=id=>document.getElementById(id), canvas=$('scene');
let renderer;
try{renderer=new T.WebGLRenderer({canvas,antialias:true});}catch(e){$('error').textContent='La 3D nécessite WebGL. Essayez un navigateur récent avec l’accélération graphique activée.';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=false;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.setClearColor(0x18231f);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
const scene=new T.Scene();scene.fog=new T.Fog(0x19251f,25,85);const camera=new T.PerspectiveCamera(55,innerWidth/innerHeight,.04,120);camera.position.set(0,1.65,4);camera.rotation.order='YXZ';scene.add(camera);scene.add(new T.HemisphereLight(0xd6f3e4,0x343126,2));
const mat=(color,metalness=0,roughness=.7)=>new T.MeshStandardMaterial({color,metalness,roughness});
const concrete=mat(0x3c4941), dark=mat(0x17251f), steel=mat(0x344139,.75,.3), wood=mat(0x644a32), black=mat(0x151c1b,.65,.28), accent=mat(0xd5f279,.2), glow=new T.MeshBasicMaterial({color:0xe0ffe1});
function box(w,h,d,m,x,y,z,parent=scene){const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.receiveShadow=true;o.castShadow=true;parent.add(o);return o;}
box(18,.2,85,concrete,0,-.1,-32);box(18,.3,85,dark,0,5,-32);box(.3,5,85,concrete,-9,2.5,-32);box(.3,5,85,concrete,9,2.5,-32);box(18,5,.4,dark,0,2.5,-72);
for(let z=2;z>-70;z-=7){box(17,.12,.13,steel,0,4.7,z);for(const x of [-5,0,5]){box(1.8,.04,.4,glow,x,4.5,z);if(x===0){const light=new T.PointLight(0xd9ffdc,36,20,2);light.position.set(x,4.25,z);scene.add(light);}}box(17,.01,.035,steel,0,.02,z);}
for(const x of [-6,-2,2,6]){box(.12,2.2,3,steel,x,1.1,3.4);box(.07,1.5,2.8,mat(0x43584a),x,1.7,3.4);box(.04,.04,65,steel,x,4,-30);}
box(3.9,.12,.8,wood,0,.9,2.5);for(const x of [-1.7,1.7])box(.12,.9,.65,steel,x,.45,2.5);
for(let z=-5;z>-65;z-=10){box(.07,.012,3,accent,-.95,.02,z);box(.07,.012,3,accent,.95,.02,z);}
const targetCanvas=document.createElement('canvas');targetCanvas.width=512;targetCanvas.height=512;const ctx=targetCanvas.getContext('2d');ctx.fillStyle='#e9e5cf';ctx.fillRect(0,0,512,512);for(let i=10;i>=1;i--){ctx.beginPath();ctx.arc(256,256,i*22,0,Math.PI*2);ctx.fillStyle=i>6?'#e9e5cf':'#202d27';ctx.fill();ctx.strokeStyle=i>6?'#526052':'#b7b9a3';ctx.lineWidth=1.5;ctx.stroke();}ctx.beginPath();ctx.arc(256,256,9,0,7);ctx.fillStyle='#202d27';ctx.fill();ctx.fillStyle='#293a30';ctx.font='bold 13px Arial';ctx.fillText('CJAJLK / PRECISION',18,28);ctx.fillText('SPORT TARGET — 01',18,490);
const tex=new T.CanvasTexture(targetCanvas);tex.colorSpace=T.SRGBColorSpace;const paper=new T.MeshStandardMaterial({map:tex,roughness:1});const targets=[];
for(let i=0;i<3;i++){const group=new T.Group();scene.add(group);const face=new T.Mesh(new T.PlaneGeometry(1.5,1.5),paper);face.position.y=1.8;group.add(face);box(1.65,1.65,.08,wood,0,1.8,-.06,group);box(.05,2,.05,steel,0,3.55,-.1,group);targets.push({group,face,base:(i-1)*3.4});}
const sportCanvas=document.createElement('canvas');sportCanvas.width=sportCanvas.height=1024;drawSportTarget(sportCanvas.getContext('2d'),1024);
const sportTexture=new T.CanvasTexture(sportCanvas);sportTexture.colorSpace=T.SRGBColorSpace;
const sportPaper=new T.MeshStandardMaterial({map:sportTexture,roughness:1});
function configureTargets(){
 for(const t of targets){const size=sport?mmToM(SPORT_TARGET.cardMM):1.5,backing=sport?mmToM(SPORT_TARGET.backingMM):1.65;
 t.face.geometry.dispose();t.face.geometry=new T.PlaneGeometry(size,size);t.face.material=sport?sportPaper:paper;t.face.position.y=sport?SPORT_TARGET.centerHeightM:1.8;
 const board=t.group.children[1];board.geometry.dispose();board.geometry=new T.BoxGeometry(backing,backing,sport?.01:.08);board.position.set(0,t.face.position.y,sport?-.009:-.06);
 const stem=t.group.children[2];const top=4.45,bottom=t.face.position.y+backing/2;stem.geometry.dispose();stem.geometry=new T.BoxGeometry(.02,top-bottom,.02);stem.position.set(0,(top+bottom)/2,-.03);
 }
}
const gun=new T.Group();camera.add(gun);const flash=new T.PointLight(0xffbf60,0,3);camera.add(flash);flash.position.set(.2,-.1,-1);
function buildGun(){while(gun.children.length){const child=gun.children[0];gun.remove(child);child.geometry?.dispose();if(child.userData.ownedMaterial)child.material.dispose();}const long=weapon!==0;box(.13,.16,long?.56:.27,black,0,0,-.2,gun);box(.11,.15,.12,steel,0,-.13,-.03,gun).rotation.x=-.2;box(.15,.045,long?.5:.29,steel,0,.1,-.21,gun);box(.035,.05,.025,black,0,.14,-.35,gun);if(long){box(.045,.045,.42,black,0,.025,-.65,gun);box(.15,.13,.24,weapon===1?wood:black,0,-.01,-.48,gun);box(.11,.15,.3,weapon===1?wood:black,0,-.04,.15,gun);box(.07,.24,.12,black,0,-.18,-.2,gun);}box(.065,.065,.035,accent,0,.03,long?-.87:-.35,gun);buildOptic();}
// The lens centre is on the camera axis when the weapon is shouldered.
const opticHeight=.235;
const lensMaterial=new T.MeshBasicMaterial({color:0x7ed7bf,transparent:true,opacity:.075,depthWrite:false,side:T.DoubleSide});
// Sporting aperture sight: no glass, illumination or telescopic reticle.
const sightMaterial=new T.MeshStandardMaterial({color:0x111413,metalness:.35,roughness:.7,side:T.DoubleSide});
function sightRing(inner,outer,z,material=sightMaterial){
 const ring=new T.Mesh(new T.RingGeometry(inner,outer,96),material);
 ring.position.set(0,opticHeight,z);gun.add(ring);return ring;
}
function buildDiopter(){
 // Broad rear eyepiece and its small clear aperture.
 sightRing(.060,.105,-.03);
 sightRing(.061,.102,-.042);
 const lip=new T.Mesh(new T.TorusGeometry(.102,.007,12,96),black);
 lip.position.set(0,opticHeight,-.03);gun.add(lip);
 box(.05,.09,.065,black,0,.135,-.035,gun);
 box(.035,.035,.04,steel,.114,opticHeight,-.035,gun);
 box(.03,.023,.035,steel,0,opticHeight+.119,-.035,gun);
 // Front globe, annular insert and two thin supporting bars.
 for(const z of [-.77,-.82])sightRing(.071,.081,z);
 sightRing(.050,.054,-.79);
 for(const x of [-.062,.062])box(.019,.003,.003,sightMaterial,x,opticHeight,-.79,gun);
 box(.025,.08,.065,black,0,opticHeight-.107,-.79,gun);
}
function buildOptic(){
 if(weapon===1){buildDiopter();return;}
 const radius=weapon===0?.056:.068, depth=weapon===1?.16:.085;
 for(const z of [-.2-depth/2,-.2+depth/2]){
  const rim=new T.Mesh(new T.TorusGeometry(radius,.012,12,64),black);
  rim.position.set(0,opticHeight,z);gun.add(rim);
  const bevel=new T.Mesh(new T.TorusGeometry(radius+.004,.003,8,64),steel);
  bevel.position.set(0,opticHeight,z+.009);gun.add(bevel);
 }
 const tube=new T.Mesh(new T.CylinderGeometry(radius,radius,depth,64,1,true),new T.MeshStandardMaterial({color:0x19221e,metalness:.65,roughness:.32,side:T.DoubleSide}));
 tube.userData.ownedMaterial=true;tube.rotation.x=Math.PI/2;tube.position.set(0,opticHeight,-.2);gun.add(tube);
 const glass=new T.Mesh(new T.CircleGeometry(radius-.002,64),lensMaterial);
 glass.position.set(0,opticHeight,-.2-depth/2);gun.add(glass);
 box(.07,.07,.08,black,0,.135,-.2,gun);
 box(.035,.035,.04,steel,radius+.017,opticHeight,-.2,gun);
 box(.035,.025,.04,steel,0,opticHeight+radius+.013,-.2,gun);
}
const carrier=new TargetCarrier();let selectedTarget=1,inspectionBlend=0,resumeRequired=false,sport=false,menuWeapon=0;
const aimFilter=new AimFilter();let currentPose={yaw:0,pitch:0};
let sessionLimit=0,cardIndex=0,sessionId="",sessionSaved=true,reloadZoom=false;
const shotLog=[];const ammoByWeapon=WEAPONS.map(w=>w.capacity);
function inspectionBusy(){return carrier.inspecting||inspectionBlend>.001||resumeRequired;}
function basePitch(){return sport?Math.atan2(SPORT_TARGET.centerHeightM-1.65,SPORT_TARGET.distanceM):0;}
function restoreControl(){if(!active||paused||carrier.inspecting||inspectionBlend>.001)return;resumeRequired=false;trigger=zoom=false;capture();updateCarrierUI();}
function setProfileControls(){const isSport=$('profile').value==='sport';for(const id of ['distance','mode','moving'])$(id).disabled=isSport;$('sportSettings').classList.toggle('hidden',!isSport);document.querySelectorAll('[data-weapon]').forEach(b=>{b.disabled=isSport;b.classList.toggle('selected',Number(b.dataset.weapon)===(isSport?1:menuWeapon));});}
$('profile').onchange=setProfileControls;
setProfileControls();
const targetTotals=targets.map(()=>({shots:0,points:0}));
const holeMaterial=new T.MeshBasicMaterial({color:0x34332c,side:T.DoubleSide});
const tornPaper=new T.MeshBasicMaterial({color:0xb7ab88,side:T.DoubleSide});
// A rail and carriage make the target's travel physically visible.
for(const t of targets){box(.035,.055,65,steel,t.base,4.57,-28);box(.3,.13,.25,steel,0,4.45,0,t.group);}
function retrieveTarget(){
 if(!active||paused)return;
 if(carrier.state==='range'&&inspectionBusy()){restoreControl();return;}
 if(carrier.state==='range'){
  selectedTarget=Number($('targetChoice').value);trigger=zoom=false;recoil=0;
  carrier.toggle();document.exitPointerLock?.();
 }else if(carrier.state==='close'){carrier.toggle();}
 updateCarrierUI();
}
function updateCarrierUI(){
 const busy=carrier.state==='bringing'||carrier.state==='sending'||(!carrier.inspecting&&inspectionBlend>.001);
 $('retrieve').disabled=busy;$('targetChoice').disabled=inspectionBusy()||(sport&&sessionLimit>0);
 $('retrieve').textContent=carrier.state==='range'?(resumeRequired?'REPRENDRE LE TIR [T]':'RAMENER [T]'):carrier.state==='close'?'RENVOYER [T]':'EN MOUVEMENT…';
 $('carrierState').textContent=carrier.state==='range'?'EN POSITION':carrier.state==='close'?'À EXAMINER':carrier.state==='bringing'?'RETOUR':'ENVOI';
 $('carrierInfo').textContent=carrier.inspecting?`${carrier.position.toFixed(1)} m · Tir désactivé${mode==='challenge'?' · Chrono suspendu':''}`:sport&&sessionLimit?'5 plombs par carton · T : ramener':'← → : choisir la cible · T : ramener';
 const total=targetTotals[selectedTarget];
 const cardShots=shotLog.filter(s=>s.card===cardIndex);
 $('nextTarget').classList.toggle('hidden',!sport||!sessionLimit);
 $('nextTarget').disabled=cardShots.length<5||shots>=sessionLimit||inspectionBusy()||paused;
 $('sessionProgress').textContent=sport&&sessionLimit?('Carton '+(cardIndex+1)+' · '+cardShots.length+'/5 · Séance '+shots+'/'+sessionLimit):sport?('Carton libre · '+shots+' tirs'):'';
 $('sessionHistory').textContent=sport&&sessionLimit?Array.from({length:cardIndex+1},(_,i)=>{const st=groupStats(shotLog.filter(s=>s.card===i));return 'C'+(i+1)+': '+st.score+' pts / '+st.shots+' tirs · décentrage '+(st.offset===null?'—':st.offset.toFixed(1)+' mm')+' · dispersion '+(st.dispersion===null?'—':st.dispersion.toFixed(1)+' mm');}).join(' · '):'';
 $('sessionSave').textContent=sessionLimit?(sessionSaved?'Résultats sauvegardés sur cet appareil':'Sauvegarde indisponible sur cet appareil'):'';
 $('shotNumbers').classList.toggle('hidden',carrier.state!=='close'||!$('numbers').checked);
 $('shotNumbers').textContent=carrier.state==='close'&&$('numbers').checked?cardShots.map((s,i)=>'#'+(i+1)+' : '+(s.impactMM?s.impactMM.x.toFixed(1)+', '+s.impactMM.y.toFixed(1)+' mm':'non mesuré')+(s.onCard?'':' · manqué')).join(' | '):'';
 $('targetReport').textContent=carrier.state==='close'?`${total.shots} impact${total.shots>1?'s':''} sur ce carton · ${total.points} points. Les impacts sont conservés au renvoi.`:'';
 if(sport&&carrier.state==='close'){
 const chosen=groupStats(shotLog.filter(s=>sessionLimit?s.card===cardIndex:s.intendedTarget===selectedTarget));
 const mm=v=>v===null?'—':v.toFixed(1)+' mm';
 $('targetReport').textContent=chosen.shots+' plombs · '+chosen.score+' points · Centre '+(chosen.center?chosen.center.x.toFixed(1)+', '+chosen.center.y.toFixed(1)+' mm':'—')+' · Décentrage '+mm(chosen.offset)+' · Dispersion (centre à centre) '+mm(chosen.dispersion)+' · '+chosen.measured+' positions mesurées, manqués inclus.';
 }
 $('hud').classList.toggle('inspecting',inspectionBusy());
}
$('retrieve').onclick=retrieveTarget;
 function recenter(){if(!active||paused||inspectionBusy())return;yaw=0;pitch=basePitch();recoil=0;aimFilter.reset(yaw,pitch);currentPose={yaw,pitch};camera.rotation.set(pitch,yaw,0);camera.updateMatrixWorld(true);trigger=false;}
 $('recenter').onclick=recenter;
 function nextTarget(){if(!sport||!sessionLimit||inspectionBusy()||paused||shots>=sessionLimit||shotLog.filter(s=>s.card===cardIndex).length<5)return;cardIndex++;clearMarks();targetTotals.forEach(t=>{t.shots=0;t.points=0;});recenter();persistSession();updateCarrierUI();}
 $('nextTarget').onclick=nextTarget;
 function persistSession(){if(!sport||!sessionLimit)return;sessionSaved=saveSession(localStorage,{id:sessionId,limit:sessionLimit,card:cardIndex,complete:shots>=sessionLimit,shots:shotLog});}
 function refreshSavedResults(){$('savedResults').textContent=readSessions(localStorage).map(s=>s.shots.length+'/'+s.limit+' plombs · '+groupStats(s.shots).score+' points · '+Array.from({length:Math.ceil(s.shots.length/5)},(_,i)=>{const st=groupStats(s.shots.filter(p=>p.card===i));return 'C'+(i+1)+': '+st.score+' pts, écart '+(st.dispersion===null?'—':st.dispersion.toFixed(1)+' mm');}).join(' / ')).join(' | ')||'Aucune séance sauvegardée.';}refreshSavedResults();
let aimBlend=0;
let weapon=0,ammo=12,active=false,paused=false,score=0,shots=0,hits=0,remaining=60,mode='free',moving=false,zoom=false,trigger=false,lastShot=-100,reloadLeft=0,recoil=0,yaw=0,pitch=0,elapsed=0,feedbackLeft=0,best=0;
try{best=Number(localStorage.getItem('cjajlk-precision-best'))||0;}catch{}$('best').textContent=best;
const marks=[];const ray=new T.Raycaster();const v2=new T.Vector2();let audio;
function sound(type){if(!$('sound').checked)return;try{audio??=new(window.AudioContext||window.webkitAudioContext)();audio.resume();const duration=type==='shot'?.16:.08;const buffer=audio.createBuffer(1,audio.sampleRate*duration,audio.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1)*Math.pow(1-i/data.length,3);const source=audio.createBufferSource();source.buffer=buffer;const filter=audio.createBiquadFilter();filter.type='lowpass';filter.frequency.value=type==='shot'?900+weapon*400:2200;const gain=audio.createGain();gain.gain.value=type==='shot'?.3:.07;source.connect(filter).connect(gain).connect(audio.destination);source.start();}catch{}}
function loadedCapacity(){return sport?1:WEAPONS[weapon].capacity;}
function updateHUD(){
 $('score').textContent=score;$('accuracy').textContent=shots?Math.round(hits/shots*100)+'%':'—';$('ammo').textContent=ammo;$('capacity').textContent=sport?' / 1 plomb':' / '+WEAPONS[weapon].capacity;
 $('weaponName').textContent=sport?'AIR 10 M · DIOPTRE':WEAPONS[weapon].name+(weapon===1?' · DIOPTRE':'');
 $('status').textContent=reloadLeft>0?'RECHARGEMENT…':sport?(ammo?'1 plomb chargé':'Rechargement nécessaire'):ammo?'PRÊT':'CHARGEUR VIDE · R';$('timer').textContent=mode==='free'?'LIBRE':Math.ceil(remaining)+' s';
 $('viewLabel').textContent=sport?(carrier.inspecting?'EXAMEN RAPPROCHÉ':zoom?'CONFORT VISUEL ×'+$('comfort').value+' · SANS EFFET SUR LE SCORE':'SPORT 10 M · V POUR ÉPAULER'):'MODE HISTORIQUE';
}
function selectWeapon(n){
 if(active&&(reloadLeft>0||inspectionBusy()||sport&&n!==1))return;
 ammoByWeapon[weapon]=ammo;weapon=n;menuWeapon=n;ammo=ammoByWeapon[n];trigger=false;zoom=false;buildGun();
 document.querySelectorAll('[data-weapon]').forEach(b=>b.classList.toggle('selected',Number(b.dataset.weapon)===n));updateHUD();
}
function reload(){if(!active||paused||inspectionBusy()||reloadLeft||ammo===loadedCapacity())return;reloadZoom=zoom;reloadLeft=WEAPONS[weapon].reload;trigger=false;zoom=false;sound('reload');updateHUD();}
function shoot(){
 if(!active||paused||inspectionBusy()||reloadLeft||elapsed-lastShot<WEAPONS[weapon].interval)return;
 if(sport&&sessionLimit&&(shots>=sessionLimit||shotLog.filter(s=>s.card===cardIndex).length>=5)){trigger=false;return;}
 if(ammo<=0){if(!sport)reload();else{trigger=false;updateHUD();}return;}
 // Use the camera pose last presented to the player. Recoil is applied afterwards.
 const spread=sport?0:WEAPONS[weapon].spread*(zoom?.35:1);
 v2.set(sport?0:(Math.random()-.5)*spread,sport?0:(Math.random()-.5)*spread);
 camera.updateMatrixWorld(true);scene.updateMatrixWorld(true);ray.setFromCamera(v2,camera);
 // Impact decorations must never participate in the target collision query.
 const intersection=ray.intersectObjects((sport&&sessionLimit?[targets[1]]:targets).map(t=>t.face),false)[0];
 let pts=0,index=null,local=null;
 if(intersection){index=targets.findIndex(t=>t.face===intersection.object);local=intersection.object.worldToLocal(intersection.point.clone());pts=sport?scoreSportMM(mToMM(local.x),mToMM(local.y)):scoreAt(local.x,local.y);}
 // Commit one departure only after the collision and scoring completed.
 lastShot=elapsed;ammo--;ammoByWeapon[weapon]=ammo;shots++;
 const planeTarget=targets[Number($('targetChoice').value)];
 let planePoint=local;
 if(!intersection){const worldPlane=new T.Plane(new T.Vector3(0,0,1),-planeTarget.face.getWorldPosition(new T.Vector3()).z);const hit=ray.ray.intersectPlane(worldPlane,new T.Vector3());if(hit)planePoint=planeTarget.face.worldToLocal(hit);}
 shotLog.push({card:cardIndex,id:shots,profile:sport?'air-rifle-10m':'legacy',weapon,target:index,intendedTarget:Number($('targetChoice').value),time:elapsed,score:pts,onCard:!!intersection,
 impactMM:planePoint?{x:mToMM(planePoint.x),y:mToMM(planePoint.y)}:null,
 aim:{yaw:camera.rotation.y,pitch:camera.rotation.x,origin:camera.position.toArray(),direction:ray.ray.direction.toArray(),oscillations:sport&&$('oscillations').checked,sensitivity:Number($('sensitivity').value),comfort:sport?Number($('comfort').value):1}});
 if(intersection){
 targetTotals[index].shots++;targetTotals[index].points+=pts;if(pts>0){hits++;score+=pts;}
 const radius=sport?mmToM(SPORT_TARGET.pelletMM)/2:.012;
 const mark=new T.Mesh(new T.CircleGeometry(radius,32),holeMaterial);mark.position.set(local.x,local.y,sport?.0001:.005);
 const tear=new T.Mesh(new T.RingGeometry(radius,radius*(sport?1.025:1.5),24),tornPaper);tear.position.z=sport?-.00001:-.001;mark.add(tear);
 intersection.object.add(mark);marks.push(mark);if(marks.length>160){const old=marks.shift();old.removeFromParent();old.traverse(o=>o.geometry?.dispose());}
 }
 $('feedback').textContent=pts?('+'+pts+(pts===10?' · PLEIN CENTRE':'')):'HORS ZONE';feedbackLeft=.8;
 recoil+=sport?.006:WEAPONS[weapon].recoil;flash.intensity=sport?0:8;sound('shot');persistSession();updateHUD();
}
function clearMarks(){marks.splice(0).forEach(m=>{m.removeFromParent();m.traverse(o=>o.geometry?.dispose());});}
function start(){
 sport=$('profile').value==='sport';sessionLimit=sport?Number($('series').value)||0:0;cardIndex=0;sessionId=Date.now()+'-'+Math.random().toString(36).slice(2);sessionSaved=true;reloadZoom=false;active=true;paused=false;score=shots=hits=0;remaining=60;
 mode=sport?'free':$('mode').value;moving=!sport&&$('moving').checked;const distance=sport?SPORT_TARGET.distanceM:Number($('distance').value);
 carrier.reset(distance);inspectionBlend=0;resumeRequired=false;selectedTarget=1;$('targetChoice').value='1';
 camera.position.set(0,1.65,4);targetTotals.forEach(t=>{t.shots=0;t.points=0;});clearMarks();shotLog.length=0;configureTargets();
 targets.forEach(t=>t.group.position.set(t.base,0,4-distance));
 ammoByWeapon.forEach((_,i)=>ammoByWeapon[i]=WEAPONS[i].capacity);weapon=sport?1:menuWeapon;ammo=sport?1:ammoByWeapon[weapon];ammoByWeapon[weapon]=ammo;reloadLeft=0;lastShot=-100;elapsed=0;
 yaw=0;pitch=basePitch();recoil=0;aimBlend=0;aimFilter.reset(yaw,pitch);currentPose={yaw,pitch};camera.rotation.set(pitch,yaw,0);camera.fov=55;camera.updateProjectionMatrix();camera.updateMatrixWorld(true);
 trigger=zoom=false;buildGun();updateCarrierUI();
 $('menu').classList.add('hidden');$('results').classList.add('hidden');$('hud').classList.remove('hidden');$('resume').classList.remove('hidden');capture();updateHUD();
}
function capture(){if(!inspectionBusy()&&matchMedia('(pointer:fine)').matches){try{const p=canvas.requestPointerLock();p?.catch(()=>{});}catch{}}}
function pause(){if(!active)return;refreshSavedResults();paused=true;trigger=zoom=false;document.exitPointerLock?.();$('menu').classList.remove('hidden');$('hud').classList.add('hidden');$('start').textContent='RECOMMENCER LA SESSION ↗';}
function resume(){paused=false;$('menu').classList.add('hidden');$('hud').classList.remove('hidden');capture();}
function finish(){active=false;trigger=zoom=false;document.exitPointerLock?.();if(score>best){best=score;try{localStorage.setItem('cjajlk-precision-best',best);}catch{}}$('best').textContent=best;$('finalScore').textContent=score;$('finalStats').textContent=`${shots} tirs · ${hits} impacts dans la cible · ${shots?Math.round(hits/shots*100):0} % dans les anneaux. Record : ${best} points.`;$('hud').classList.add('hidden');$('results').classList.remove('hidden');}
$('start').onclick=start;$('resume').onclick=resume;$('pause').onclick=pause;$('reload').onclick=reload;$('again').onclick=()=>{$('results').classList.add('hidden');$('menu').classList.remove('hidden');$('resume').classList.add('hidden');};document.querySelectorAll('[data-weapon]').forEach(b=>b.onclick=()=>{if(paused){menuWeapon=Number(b.dataset.weapon);setProfileControls();}else selectWeapon(Number(b.dataset.weapon));});
function aim(dx,dy){
 if(!active||paused||inspectionBusy())return;
 const sensitivity=sport?(zoom?.000012:.00012)*Number($('sensitivity').value):zoom?.00055:.0014;
 yaw=T.MathUtils.clamp(yaw-dx*sensitivity,-.64,.64);pitch=T.MathUtils.clamp(pitch-dy*sensitivity,-.38,.38);
}

document.addEventListener('mousemove',e=>{if(document.pointerLockElement===canvas)aim(e.movementX,e.movementY);});canvas.addEventListener('pointerdown',e=>{if(!active||paused)return;if(e.pointerType==='mouse'){if(e.button===0){trigger=true;shoot();}if(e.button===2&&!inspectionBusy())zoom=true;}});let touchPoint=null;canvas.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'){touchPoint={x:e.clientX,y:e.clientY,id:e.pointerId};canvas.setPointerCapture(e.pointerId);}});canvas.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'&&touchPoint?.id===e.pointerId){aim((e.clientX-touchPoint.x)*2,(e.clientY-touchPoint.y)*2);touchPoint={x:e.clientX,y:e.clientY,id:e.pointerId};}else if(e.pointerType==='mouse'&&document.pointerLockElement!==canvas&&active&&!paused){aim(e.movementX,e.movementY);}});window.addEventListener('pointerup',e=>{if(e.button===0)trigger=false;if(touchPoint?.id===e.pointerId)touchPoint=null;if(e.pointerType==='mouse'&&e.button===2)zoom=false;});window.addEventListener('pointercancel',()=>{trigger=false;touchPoint=null;});window.addEventListener('contextmenu',e=>e.preventDefault());$('fire').addEventListener('pointerdown',e=>{e.preventDefault();trigger=true;shoot();});$('zoom').onclick=()=>{if(active&&!paused&&!inspectionBusy())zoom=!zoom;};
window.addEventListener('keydown',e=>{if(e.target.matches('select,input'))return;if(e.code==='Escape'){pause();return;}if(!active||paused)return;if(e.code==='Space'){e.preventDefault();if(acceptsSpace(e,weapon))shoot();}if(!inspectionBusy()&&!(sport&&sessionLimit)&&(e.code==='ArrowLeft'||e.code==='ArrowRight')){e.preventDefault();const next=(Number($('targetChoice').value)+(e.code==='ArrowRight'?1:2))%3;$('targetChoice').value=String(next);}
if(e.code==='KeyC'&&!e.repeat)recenter();if(e.code==='KeyT'&&!e.repeat)retrieveTarget();if(e.code==='KeyV'&&!e.repeat&&!inspectionBusy()){zoom=!zoom;}if(e.code==='KeyR'&&(!sport||!e.repeat))reload();if(['Digit1','Digit2','Digit3'].includes(e.code))selectWeapon(Number(e.code.slice(-1))-1);});document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement&&active&&!paused&&!inspectionBusy())pause();});window.addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();}window.addEventListener('resize',resize);resize();buildGun();targets.forEach(t=>t.group.position.set(t.base,0,-6));
let previous=performance.now();
function frame(now){
 requestAnimationFrame(frame);
 const realDt=Math.max(0,(now-previous)/1000);previous=now;
 const dt=active&&!paused?realDt:0;
 if(active&&!paused){
  elapsed+=dt;
  if(mode==='challenge'&&!inspectionBusy()){remaining=Math.max(0,remaining-dt);if(remaining===0)finish();}
  if(reloadLeft>0){reloadLeft=Math.max(0,reloadLeft-dt);if(reloadLeft===0){ammo=loadedCapacity();ammoByWeapon[weapon]=ammo;zoom=reloadZoom;reloadZoom=false;}}
  if(moving&&!inspectionBusy())targets.forEach((t,i)=>t.group.position.x=t.base+Math.sin(elapsed*.8+i)*.75);
  const wasInspecting=carrier.inspecting;
  const near=sport?.5:Math.max(2,1.03/(Math.tan(55*Math.PI/360)*Math.min(camera.aspect,1)));
  carrier.step(dt,near);
  if(wasInspecting){targets[selectedTarget].group.position.z=4-carrier.position;targets[selectedTarget].group.position.x=T.MathUtils.lerp(targets[selectedTarget].group.position.x,targets[selectedTarget].base,1-Math.exp(-dt*6));if(!carrier.inspecting){yaw=0;pitch=basePitch();aimFilter.reset(yaw,pitch);resumeRequired=true;}}
 }
 inspectionBlend=T.MathUtils.lerp(inspectionBlend,active&&carrier.inspecting?1:0,1-Math.exp(-dt*7));if(inspectionBlend<.001&&!carrier.inspecting)inspectionBlend=0;
 recoil=T.MathUtils.lerp(recoil,0,1-Math.exp(-dt*11));flash.intensity*=Math.exp(-dt*35);feedbackLeft-=dt;if(feedbackLeft<=0)$('feedback').textContent='';
 camera.position.set(targets[selectedTarget].base*inspectionBlend,T.MathUtils.lerp(1.65,targets[selectedTarget].face.position.y,inspectionBlend),4);
 if(sport)currentPose=aimFilter.step(yaw,pitch,dt,elapsed,$('oscillations').checked&&!inspectionBusy());
 else {const breathing=active&&!paused&&!inspectionBusy()&&zoom&&weapon===1?.0007:0;currentPose={pitch:pitch+recoil*.18+Math.sin(elapsed*1.8)*breathing,yaw:yaw+Math.sin(elapsed*1.1)*breathing*.6};}
 camera.rotation.set(currentPose.pitch*(1-inspectionBlend),currentPose.yaw*(1-inspectionBlend),0);
 const aiming=active&&!paused&&!inspectionBusy()&&zoom&&reloadLeft===0;
 aimBlend=T.MathUtils.lerp(aimBlend,aiming?1:0,1-Math.exp(-dt*16));
 const aimedFov=sport?comfortFov(Number($('comfort').value),camera.aspect):WEAPONS[weapon].fov;
 const normalFov=T.MathUtils.lerp(55,aimedFov,aimBlend);
 camera.fov=T.MathUtils.lerp(normalFov,sport?18/Math.min(1,camera.aspect):55,inspectionBlend);camera.updateProjectionMatrix();camera.updateMatrixWorld(true);
 gun.visible=active&&!paused&&!inspectionBusy()&&!(sport&&aimBlend>.2);
 const rearm=reloadLeft>0?Math.sin(Math.PI*(1-reloadLeft/WEAPONS[weapon].reload)):0;
 gun.position.set((sport?0:.25)*(1-aimBlend),T.MathUtils.lerp(-.27,-opticHeight,aimBlend)-(sport?rearm*.12:reloadLeft*.06)-Math.sin(elapsed*1.6)*.002*(1-aimBlend),-.42+recoil*(1-aimBlend*.8));gun.rotation.x=recoil*.6*(1-aimBlend)+(sport?-rearm*.5:reloadLeft>0?-.5:0);
 const throughOptic=aiming&&aimBlend>.94;
 $('hud').classList.toggle('diopter-view',throughOptic&&weapon===1);$('opticReticle').classList.toggle('visible',throughOptic&&!sport&&weapon!==1);
 $('sportSight').classList.toggle('hidden',!throughOptic||!sport);
 const radius=sightRadiusPixels(innerHeight,camera.fov);$('sportSight').style.setProperty('--aperture',radius+'px');
 $('crosshair').classList.toggle('hidden',aimBlend>.2||inspectionBusy()||sport);
 $('aimShade').style.opacity=String(aimBlend*.5);$('zoom').classList.toggle('selected',aiming);$('zoom').setAttribute('aria-pressed',String(aiming));
 // Automatic fire is computed only after this frame's pose is ready.
 if(active&&!paused&&trigger&&weapon===2)shoot();
 if(active){updateCarrierUI();updateHUD();}
 if(!paused)renderer.render(scene,camera);
}

requestAnimationFrame(frame);







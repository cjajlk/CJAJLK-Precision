import {test} from 'node:test';
import assert from 'node:assert/strict';
import {game} from './harness.mjs';
function centre(g){g.run('camera.position.set(0,SPORT_TARGET.centerHeightM,4);camera.rotation.set(0,0,0);camera.updateMatrixWorld(true);');}
test('5 puis 40 impacts exactement superposés : une consommation et une entrée par départ',()=>{
 const g=game();g.run('start();');for(let i=0;i<40;i++){if(i&&i%5===0){g.run('reload();');g.tick(2);}g.tick(.8);centre(g);g.run('shoot();');assert.equal(g.run('shots'),i+1);assert.equal(g.run('shotLog.length'),i+1);assert.equal(g.run('ammo'),4-i%5);assert.equal(g.run('score'),10*(i+1));if(i===4)assert.equal(g.run('marks.length'),5);}
 assert.equal(g.run('marks.length'),40);assert.equal(g.run('targetTotals[1].shots'),40);
});
test('anciens modes : aucun remplissage gratuit, changement pendant rechargement bloqué',()=>{
 const g=game('legacy');g.run('selectWeapon(1);start();shoot();');assert.equal(g.run('ammo'),4);g.run('selectWeapon(1)');assert.equal(g.run('ammo'),4);g.run('selectWeapon(0);selectWeapon(1)');assert.equal(g.run('ammo'),4);g.run('reload();selectWeapon(0)');assert.equal(g.run('weapon'),1);g.tick(2);assert.equal(g.run('ammo'),5);
});
test('clavier, pause et reprise : Espace répété ignoré, aucun tir en pause',()=>{
 const g=game();g.run('start();');centre(g);g.key('Space');g.tick(1);g.key('Space',true);assert.equal(g.run('shots'),1);g.run('pause()');g.key('Space');g.tick(4);assert.equal(g.run('shots'),1);assert.equal(g.run('elapsed'),1);g.run('resume()');g.tick(1);centre(g);g.key('Space');assert.equal(g.run('shots'),2);
});
test('ramène-cible, examen et restauration explicite du contrôle',()=>{
 const g=game();g.run('start();');centre(g);g.run('shoot();retrieveTarget();');g.tick(2);assert.equal(g.run('carrier.state'),'close');g.key('Space');assert.equal(g.run('ammo'),4);assert.equal(g.run('shotLog.length'),1);g.run('retrieveTarget()');g.tick(2);assert.equal(g.run('carrier.state'),'range');assert.equal(g.run('resumeRequired'),true);g.key('Space');assert.equal(g.run('shots'),1);g.tick(2);g.run('restoreControl()');g.tick(1);centre(g);g.key('Space');assert.equal(g.run('shots'),2);assert.equal(g.run('marks.length'),2);
});
test('dimensions sport, conservation coordonnées après transport, pose indépendante du zoom',()=>{
 const g=game();g.run('start();');assert.equal(g.run('targets[1].face.geometry.parameters.width'),.08);assert.equal(g.run('carrier.distance'),10);
 centre(g);g.run('camera.rotation.y=-Math.atan(.004/10);camera.updateMatrixWorld(true);shoot();');assert.ok(Math.abs(g.run('shotLog[0].impactMM.x')-4)<1e-7);assert.equal(g.run('shotLog[0].score'),9);
 g.tick(1);centre(g);g.run('camera.rotation.y=-Math.atan(.004/10);camera.aspect=.6;camera.fov=2;camera.updateProjectionMatrix();camera.updateMatrixWorld(true);shoot();');assert.ok(Math.abs(g.run('shotLog[1].impactMM.x')-4)<1e-7);
 const x=g.run('marks[0].position.x');g.run('retrieveTarget()');g.tick(2);assert.equal(g.run('marks[0].position.x'),x);assert.ok(Math.abs(g.run('shotLog[0].impactMM.x')-g.run('shotLog[1].impactMM.x'))<1e-7);
});
test('modes historiques pistolet, carabine et automatique encore disponibles',()=>{
 for(const w of [0,1,2]){const g=game('legacy');g.run(`selectWeapon(${w});start();shoot();`);assert.equal(g.run('weapon'),w);assert.equal(g.run('shots'),1);assert.equal(g.run('targets[1].face.geometry.parameters.width'),1.5);assert.equal(g.run('ammo'),[11,4,29][w]);}
 const g=game('legacy');g.run('selectWeapon(2);start();trigger=true;');g.tick(.2);assert.equal(g.run('shots'),1);
});
test('temps de défi indépendant du plafonnement visuel et suspendu en examen',()=>{
 const g=game('legacy');g.element('mode').value='challenge';g.run('start()');g.tick(1);assert.equal(g.run('remaining'),59);g.run('retrieveTarget()');g.tick(1);assert.equal(g.run('remaining'),59);
});


test('entrée tactile simulée : glisser, viser, tirer sans perdre le doigt de visée',()=>{
 const g=game();g.run('start();innerWidth=390;innerHeight=844;resize();');
 g.listeners['scene:pointerdown']({pointerType:'touch',pointerId:10,clientX:100,clientY:100});
 g.listeners['scene:pointermove']({pointerType:'touch',pointerId:10,clientX:101,clientY:100});assert.notEqual(g.run('yaw'),0);
 g.element('zoom').onclick();assert.equal(g.run('zoom'),true);g.tick(1);centre(g);
 g.listeners['fire:pointerdown']({preventDefault(){}});assert.equal(g.run('shots'),1);
 g.listeners.pointerup({pointerType:'touch',pointerId:11,button:0});assert.equal(g.run('touchPoint.id'),10);
 g.listeners['scene:pointermove']({pointerType:'touch',pointerId:10,clientX:102,clientY:100});assert.ok(g.run('yaw')<0);
});

test('pose affichée, rayon et impact cohérents sans aléatoire',()=>{
 const g=game();g.run('start();zoom=true;');g.tick(.8);g.run('yaw+=.0003;');g.tick(.05);
 const yaw=g.run('currentPose.yaw'),pitch=g.run('currentPose.pitch');g.key('Space');
 assert.equal(g.run('shotLog[0].aim.yaw'),yaw);assert.equal(g.run('shotLog[0].aim.pitch'),pitch);
 const expected=g.run('(()=>{const a=shotLog[0].aim;const t=(-6-a.origin[2])/a.direction[2];return (a.origin[0]+t*a.direction[0])*1000;})()');
 assert.ok(Math.abs(g.run('shotLog[0].impactMM.x')-expected)<.1);
});

test('changer le profil au menu prépare une nouvelle session sans altérer la reprise',()=>{
 const g=game();g.run('start();');centre(g);g.key('Space');g.run('pause();menuWeapon=0;');g.element('profile').value='legacy';g.run('resume()');assert.equal(g.run('weapon'),1);assert.equal(g.run('ammo'),4);
 g.run('start()');assert.equal(g.run('sport'),false);assert.equal(g.run('weapon'),0);assert.equal(g.run('ammo'),12);
});

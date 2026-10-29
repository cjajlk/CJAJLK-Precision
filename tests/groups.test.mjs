import {test} from 'node:test';
import assert from 'node:assert/strict';
import {groupStats,saveSession,readSessions} from '../src/game/groups.js';
import {game} from './harness.mjs';
const centre=g=>g.run('camera.position.set(0,SPORT_TARGET.centerHeightM,4);camera.rotation.set(0,0,0);camera.updateMatrixWorld(true)');
test('mesures physiques : centre, écart extrême, manqués et cas insuffisants',()=>{
 const shots=[{score:10,impactMM:{x:0,y:0}},{score:0,impactMM:{x:60,y:80}},{score:0,impactMM:null}];
 const s=groupStats(shots);assert.equal(s.shots,3);assert.equal(s.measured,2);assert.equal(s.score,10);assert.equal(s.offset,50);assert.equal(s.dispersion,100);assert.deepEqual(s.center,{x:30,y:40});assert.equal(groupStats([]).center,null);assert.equal(groupStats(shots.slice(0,1)).dispersion,null);
});
test('séances 5, 20, 40 : arrêt à cinq, changement explicite, sauvegarde et fin',()=>{
 for(const limit of [5,20,40]){const g=game();g.element('series').value=String(limit);g.run('start()');
 for(let i=0;i<limit;i++){
  if(i&&i%5===0){g.tick(1);g.run('shoot()');assert.equal(g.run('shots'),i);g.run('nextTarget()');}
  if(i){g.run('reload()');g.tick(2);}
  g.tick(.8);centre(g);g.run('shoot()');
 }
 assert.equal(g.run('shots'),limit);assert.equal(g.run('score'),limit*10);assert.equal(g.run('marks.length'),5);assert.equal(g.run('cardIndex'),limit/5-1);
 g.tick(1);g.run('nextTarget();shoot()');assert.equal(g.run('shots'),limit);
 assert.equal(g.run("readSessions(localStorage)[0].shots.length"),limit);assert.equal(g.run('readSessions(localStorage)[0].complete'),true);
 }
});
test('recentrage explicite, conservation après rechargement et tir manqué enregistré',()=>{
 const g=game();g.element('series').value='5';g.run('start();yaw=.1;pitch=.1;recenter()');assert.equal(g.run('yaw'),0);assert.equal(g.run('pitch'),g.run('basePitch()'));
 g.run('zoom=true;camera.rotation.y=.2;camera.updateMatrixWorld(true);shoot();reload()');g.tick(2);assert.equal(g.run('zoom'),true);assert.equal(g.run('shotLog[0].onCard'),false);assert.equal(g.run('shotLog[0].score'),0);assert.ok(g.run('Math.abs(shotLog[0].impactMM.x)')>40);assert.equal(g.run('readSessions(localStorage)[0].shots.length'),1);
 g.run('retrieveTarget();yaw=.2;recenter()');assert.equal(g.run('yaw'),.2);
});
test('sauvegarde bornée et erreur de stockage explicite',()=>{
 const data=new Map();const store={getItem:k=>data.get(k),setItem:(k,v)=>data.set(k,v)};
 for(let i=0;i<25;i++)assert.equal(saveSession(store,{id:i,shots:[]}),true);
 assert.equal(readSessions(store).length,20);assert.equal(saveSession({getItem(){throw Error();},setItem(){throw Error();}},{id:1,shots:[]}),false);
});
test('ressources plafonnées après changements de mode et rendu immobile en pause',()=>{
 const g=game();g.run('start()');const n=g.run('scene.children.length');for(let i=0;i<20;i++)g.run('start()');assert.equal(g.run('scene.children.length'),n);assert.equal(g.run('marks.length'),0);assert.ok(g.run('scene.children.filter(o=>o.isPointLight).length')<=11);
 g.run('pause()');const t=g.run('elapsed');g.tick(3);assert.equal(g.run('elapsed'),t);
});

test('un tir sur le carton voisin reste un manqué dans une séance centrale',()=>{
 const g=game();g.element('series').value='5';g.run('start();camera.position.set(0,SPORT_TARGET.centerHeightM,4);camera.rotation.set(0,-Math.atan(3.4/10),0);camera.updateMatrixWorld(true);shoot()');assert.equal(g.run('score'),0);assert.equal(g.run('shotLog[0].onCard'),false);assert.ok(Math.abs(g.run('shotLog[0].impactMM.x')-3400)<1e-6);
});

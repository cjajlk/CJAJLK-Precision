import {test} from 'node:test';
import assert from 'node:assert/strict';
import {game} from './harness.mjs';
test('sport : un plomb, tir à vide sans recharge automatique, R obligatoire',()=>{
 const g=game();g.run('start()');assert.equal(g.run('ammo'),1);assert.equal(g.element('status').textContent,'1 plomb chargé');
 g.key('Space');g.tick(1);assert.equal(g.run('ammo'),0);assert.equal(g.element('status').textContent,'Rechargement nécessaire');
 for(let i=0;i<5;i++){g.key('Space');g.tick(2);}assert.equal(g.run('shots'),1);assert.equal(g.run('reloadLeft'),0);assert.equal(g.run('shotLog.length'),1);
 g.key('KeyR',true);assert.equal(g.run('reloadLeft'),0);g.key('KeyR');assert.ok(g.run('reloadLeft')>0);
 g.tick(.8);g.key('Space');assert.equal(g.run('ammo'),0);assert.equal(g.run('shots'),1);g.tick(1.1);assert.equal(g.run('ammo'),1);g.key('Space');assert.equal(g.run('ammo'),0);assert.equal(g.run('shots'),2);
});
test('sport : vues, armes, pause, réglages et carton ne rechargent pas',()=>{
 const g=game();g.element('series').value='20';g.run('start();shoot()');g.tick(1);
 g.key('KeyV');g.key('KeyC');g.key('Digit1');g.key('Digit2');g.key('Digit3');g.run('pause()');g.element('profile').value='legacy';g.run('resume()');assert.equal(g.run('sport'),true);assert.equal(g.run('ammo'),0);
 for(let i=1;i<5;i++){g.key('KeyR');g.tick(2);g.key('Space');g.tick(1);}assert.match(g.element('sessionProgress').textContent,/5\/5/);
 g.run('nextTarget()');assert.equal(g.run('ammo'),0);assert.match(g.element('sessionProgress').textContent,/0\/5/);g.key('Space');assert.equal(g.run('shots'),5);
});
test('sport : pause suspend le chargement, maintien du tir ne déclenche pas après recharge',()=>{
 const g=game();g.run('start();shoot();reload()');g.tick(.5);const left=g.run('reloadLeft');g.run('pause()');g.tick(10);assert.equal(g.run('reloadLeft'),left);assert.equal(g.run('ammo'),0);g.run('resume();trigger=true');g.tick(2);g.key('Space',true);assert.equal(g.run('ammo'),1);assert.equal(g.run('shots'),1);
});
test('sport tactile : bouton recharger puis exactement un nouveau départ',()=>{
 const g=game();g.run('start()');const tap=()=>g.listeners['fire:pointerdown']({preventDefault(){}});tap();g.tick(1);tap();g.tick(3);assert.equal(g.run('shots'),1);assert.equal(g.run('ammo'),0);g.element('reload').onclick();g.tick(2);tap();g.tick(1);tap();assert.equal(g.run('shots'),2);assert.equal(g.run('ammo'),0);
});

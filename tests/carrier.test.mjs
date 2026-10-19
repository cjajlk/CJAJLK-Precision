import {test} from 'node:test';
import assert from 'node:assert/strict';
import {TargetCarrier} from '../src/game/carrier.js';
test('ramener puis renvoyer à la distance choisie sans dépasser',()=>{for(const distance of [10,25,50]){const c=new TargetCarrier();c.reset(distance);c.toggle();assert.equal(c.inspecting,true);c.toggle();assert.equal(c.state,'bringing');for(let i=0;i<150;i++)c.step(.05,2);assert.equal(c.state,'close');assert.equal(c.position,2);c.toggle();for(let i=0;i<150;i++)c.step(.05,2);assert.equal(c.state,'range');assert.equal(c.position,distance);assert.equal(c.inspecting,false);}});
test('réinitialiser pendant le transport et cadrage portrait',()=>{const c=new TargetCarrier();c.toggle();c.step(1,3.8);assert.equal(c.position,3.8);c.reset(25);assert.equal(c.state,'range');assert.equal(c.position,25);});

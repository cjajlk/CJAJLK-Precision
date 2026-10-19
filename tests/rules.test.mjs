import {test} from 'node:test';
import assert from 'node:assert/strict';
import {scoreAt,WEAPONS} from '../src/game/rules.js';
test('centre, anneaux et hors cible',()=>{assert.equal(scoreAt(0,0),10);assert.equal(scoreAt(.2,0),7);assert.equal(scoreAt(.63,0),1);assert.equal(scoreAt(.66,0),0);assert.equal(scoreAt(.5,.5),0);assert.equal(scoreAt(-.2,0),scoreAt(.2,0));});
test('paramètres des trois armes valides',()=>{assert.equal(WEAPONS.length,3);for(const w of WEAPONS){assert.ok(w.capacity>0&&w.reload>0&&w.interval>0&&w.fov>0);}});

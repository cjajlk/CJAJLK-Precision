import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SPORT_TARGET, mmToM, scoreSportMM } from '../src/game/target-spec.js';
import { AimFilter, comfortFov, sightRadiusPixels } from '../src/game/aim.js';
import { acceptsSpace } from '../src/game/input.js';

test('dimensions physiques et cordons pédagogiques',()=>{
 assert.equal(mmToM(SPORT_TARGET.cardMM),.08);assert.equal(SPORT_TARGET.blackMM,30.5);assert.equal(SPORT_TARGET.ringDiametersMM[9],45.5);
 for(const [x,expected] of [[0,10],[2.5,10],[2.50001,9],[5,9],[5.00001,8],[25,1],[25.00001,0]])assert.equal(scoreSportMM(x,0),expected);
 assert.equal(scoreSportMM(NaN,0),0);assert.equal(scoreSportMM(0,-5),9);
});
test('pose reproductible et oscillations désactivables',()=>{
 const a=new AimFilter(),b=new AimFilter();a.reset(.02,-.03);b.reset(.02,-.03);
 for(let i=0;i<120;i++)assert.deepEqual(a.step(.01,-.02,1/60,i/60,true),b.step(.01,-.02,1/60,i/60,true));
 a.reset(.1,.2);assert.deepEqual(a.step(.1,.2,.016,999,false),{yaw:.1,pitch:.2});
});
test('filtrage stable à différentes cadences pour une entrée constante',()=>{
 const a=new AimFilter(),b=new AimFilter();for(let i=0;i<30;i++)a.step(.01,.02,1/30,0,false);for(let i=0;i<144;i++)b.step(.01,.02,1/144,0,false);
 assert.ok(Math.abs(a.yaw-b.yaw)<1e-12);assert.ok(Math.abs(a.pitch-b.pitch)<1e-12);
});
test('grossissement de confort et anneau restent purement visuels',()=>{
 const r30=sightRadiusPixels(720,comfortFov(30,16/9)),r60=sightRadiusPixels(720,comfortFov(60,16/9));assert.ok(Math.abs(r60/r30-2)<1e-10);
 assert.ok(comfortFov(60,.6)>comfortFov(60,16/9));assert.equal(scoreSportMM(4,0),9);
});
test('Espace ignore répétition carabine et pistolet, conserve automatique historique',()=>{
 assert.equal(acceptsSpace({code:'Space',repeat:false},1),true);assert.equal(acceptsSpace({code:'Space',repeat:true},1),false);
 assert.equal(acceptsSpace({code:'Space',repeat:true},0),false);assert.equal(acceptsSpace({code:'Space',repeat:true},2),true);assert.equal(acceptsSpace({code:'KeyR'},1),false);
});

import fs from 'node:fs';
import vm from 'node:vm';
import * as Three from '../assets/vendor/three.module.js';
import {WEAPONS,scoreAt} from '../src/game/rules.js';
import {TargetCarrier} from '../src/game/carrier.js';
import {SPORT_TARGET,mmToM,mToMM,scoreSportMM,drawSportTarget} from '../src/game/target-spec.js';
import {AimFilter,comfortFov,sightRadiusPixels} from '../src/game/aim.js';
import {acceptsSpace} from '../src/game/input.js';
export function game(profile='sport'){
 const elements=new Map(),listeners={};
 function listen(key,fn){const old=listeners[key];listeners[key]=old?e=>{old(e);fn(e);}:fn;}
 const defaults={distance:'10',mode:'free',targetChoice:'1',profile,sensitivity:'1',comfort:'60'};
 function element(id){if(!elements.has(id))elements.set(id,{value:defaults[id]||'',checked:false,textContent:'',disabled:false,style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},setAttribute(){},addEventListener(type,fn){listen(id+':'+type,fn);},setPointerCapture(){},requestPointerLock(){return Promise.resolve();},matches(){return false;},getContext(){return new Proxy({},{get:()=>()=>{}})}});return elements.get(id);}
 const doc={getElementById:element,createElement:()=>element('generated'),querySelectorAll:()=>[],addEventListener:(type,fn)=>listeners[type]=fn,exitPointerLock(){},pointerLockElement:null};
 class Renderer{constructor(){this.shadowMap={};}setPixelRatio(){}setClearColor(){}setSize(){}render(){}}
 const math=Object.create(Math);math.random=()=>.5;
 const context=vm.createContext({T:{...Three,WebGLRenderer:Renderer},WEAPONS,scoreAt,TargetCarrier,SPORT_TARGET,mmToM,mToMM,scoreSportMM,drawSportTarget,AimFilter,comfortFov,sightRadiusPixels,acceptsSpace,document:doc,window:{addEventListener:(type,fn)=>listeners[type]=fn},devicePixelRatio:1,innerWidth:1280,innerHeight:720,matchMedia:()=>({matches:false}),localStorage:{getItem:()=>null,setItem(){}},requestAnimationFrame(){},performance:{now:()=>0},Math:math,console});
 const source=fs.readFileSync(new URL('../src/game/main.js',import.meta.url),'utf8').replace(/^import .*;\r?$/gm,'');
 vm.runInContext(source+'\nglobalThis.probe={run:(code)=>eval(code)}',context);
 let clock=0;
 return {run:context.probe.run,element,listeners,tick(seconds){clock+=seconds*1000;context.probe.run(`frame(${clock})`);},key(code,repeat=false){listeners.keydown({target:{matches:()=>false},code,repeat,preventDefault(){}});}};
}

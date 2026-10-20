export class TargetCarrier {
 constructor(){this.reset(10);}
 reset(distance){this.distance=distance;this.position=distance;this.state='range';this.travel=null;}
 toggle(){if(this.state==='range'){this.state='bringing';this.travel=null;}else if(this.state==='close'){this.state='sending';this.travel=null;}}
 get inspecting(){return this.state!=='range';}
 step(dt,near){
  if(this.state==='close'){this.position=near;return;}
  if(this.state!=='bringing'&&this.state!=='sending')return;
  const goal=this.state==='bringing'?near:this.distance;
  if(!this.travel||this.travel.goal!==goal)this.travel={from:this.position,goal,time:0,duration:Math.max(.3,Math.abs(goal-this.position)/8)};
  const t=this.travel;t.time+=Math.max(0,dt);const p=Math.min(1,t.time/t.duration),ease=p*p*(3-2*p);
  this.position=t.from+(goal-t.from)*ease;
  if(p===1){this.position=goal;this.state=this.state==='bringing'?'close':'range';this.travel=null;}
 }
}

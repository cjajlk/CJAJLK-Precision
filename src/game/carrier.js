export class TargetCarrier {
 constructor(){this.reset(10);}
 reset(distance){this.distance=distance;this.position=distance;this.state='range';}
 toggle(){if(this.state==='range')this.state='bringing';else if(this.state==='close')this.state='sending';}
 get inspecting(){return this.state!=='range';}
 step(dt,near){const goal=this.state==='bringing'?near:this.distance;if(this.state==='bringing'||this.state==='sending'){const delta=goal-this.position;this.position+=Math.sign(delta)*Math.min(Math.abs(delta),8*dt);if(Math.abs(goal-this.position)<.001){this.position=goal;this.state=this.state==='bringing'?'close':'range';}}}
}


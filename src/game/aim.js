// Deterministic angular pose: the displayed pose is also the shot direction.
export class AimFilter {
 constructor(){this.reset(0,0);}
 reset(yaw,pitch){this.yaw=yaw;this.pitch=pitch;}
 step(yaw,pitch,dt,time,oscillations,profile='discovery',hold=0){const a=1-Math.exp(-Math.max(0,dt)/.025);this.yaw+=(yaw-this.yaw)*a;this.pitch+=(pitch-this.pitch)*a;const strength=({discovery:.65,training:1,simulation:1.4})[profile]??.65;const amount=oscillations?strength*(1+.45*Math.exp(-hold/1.8)):0;const breath=Math.sin(time*1.57);return {yaw:this.yaw+amount*(Math.sin(time*1.11)*.000045+Math.sin(time*2.67)*.000015),pitch:this.pitch+amount*(breath*.00011+Math.sin(time*2.31)*.00002)};}
}
export function comfortFov(magnification,aspect){return 2*Math.atan(Math.tan(55*Math.PI/360)/magnification/Math.min(1,aspect))*180/Math.PI;}
export function sightRadiusPixels(height,fov){return height/(2*Math.tan(fov*Math.PI/360))*.002;}

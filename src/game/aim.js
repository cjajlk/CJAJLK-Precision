// One deterministic angular pose; no hidden shot dispersion in the sports profile.
export class AimFilter {
 constructor(){this.reset(0,0);}
 reset(yaw,pitch){this.yaw=yaw;this.pitch=pitch;}
 step(yaw,pitch,dt,time,oscillations){const a=1-Math.exp(-Math.max(0,dt)/.025);this.yaw+=(yaw-this.yaw)*a;this.pitch+=(pitch-this.pitch)*a;const amount=oscillations?1:0;return {yaw:this.yaw+amount*(Math.sin(time*1.11)*.000045+Math.sin(time*2.67)*.000015),pitch:this.pitch+amount*(Math.sin(time*1.57)*.00007+Math.sin(time*2.31)*.00002)};}
}
export function comfortFov(magnification,aspect){return 2*Math.atan(Math.tan(55*Math.PI/360)/magnification/Math.min(1,aspect))*180/Math.PI;}
// Angular aperture of the front ring: 40 mm apparent opening at 10 m.
export function sightRadiusPixels(height,fov){return height/(2*Math.tan(fov*Math.PI/360))*.002;}

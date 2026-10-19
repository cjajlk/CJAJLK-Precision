export const WEAPONS = [
 {name:'PISTOLET / P-9',capacity:12,reload:1.3,interval:.24,spread:.012,recoil:.11,fov:38},
 {name:'CARABINE / C-22',capacity:5,reload:1.8,interval:.7,spread:.003,recoil:.07,fov:32},
 {name:'FUSIL D’ASSAUT / AR-30',capacity:30,reload:2,interval:.11,spread:.02,recoil:.06,fov:36}
];
export function scoreAt(x,y){const r=Math.hypot(x,y);const radius=220/512*1.5;if(r>radius)return 0;return Math.max(1,10-Math.floor(r/(radius/10)));}


// Dimensions: ISSF edition 2025, first print 12/2025, §6.3.4.3.
// The integer scoring convention is educational, not certified paper-gauge scoring.
export const SPORT_TARGET=Object.freeze({id:'air-rifle-10m',distanceM:10,cardMM:80,backingMM:170,blackMM:30.5,pelletMM:4.5,centerHeightM:1.4,ringDiametersMM:Object.freeze([.5,5.5,10.5,15.5,20.5,25.5,30.5,35.5,40.5,45.5])});
export const mmToM=value=>value/1000;
export const mToMM=value=>value*1000;
export function scoreSportMM(x,y){if(!Number.isFinite(x)||!Number.isFinite(y))return 0;const radius=Math.hypot(x,y);for(let i=0;i<10;i++)if(radius<=SPORT_TARGET.ringDiametersMM[i]/2+SPORT_TARGET.pelletMM/2+1e-9)return 10-i;return 0;}
export function drawSportTarget(ctx,size){
 const scale=size/SPORT_TARGET.cardMM,center=size/2;
 ctx.fillStyle='#eee9d7';ctx.fillRect(0,0,size,size);
 ctx.beginPath();ctx.arc(center,center,SPORT_TARGET.blackMM/2*scale,0,Math.PI*2);ctx.fillStyle='#171b18';ctx.fill();
 ctx.lineWidth=.12*scale;
 for(let i=9;i>=1;i--){const d=SPORT_TARGET.ringDiametersMM[i];ctx.beginPath();ctx.arc(center,center,d/2*scale,0,Math.PI*2);ctx.strokeStyle=d<=SPORT_TARGET.blackMM?'#a5a697':'#252c25';ctx.stroke();}
 ctx.beginPath();ctx.arc(center,center,.25*scale,0,Math.PI*2);ctx.fillStyle='#eee9d7';ctx.fill();
 ctx.font=`${1.1*scale}px Arial`;ctx.textAlign='center';ctx.textBaseline='middle';
 for(let score=1;score<=8;score++){const i=10-score;const radius=(SPORT_TARGET.ringDiametersMM[i]+SPORT_TARGET.ringDiametersMM[i-1])/4*scale;ctx.fillStyle=score>=4?'#ddd9c8':'#252c25';for(const [x,y] of [[radius,0],[-radius,0],[0,radius],[0,-radius]])ctx.fillText(String(score),center+x,center+y);}
}

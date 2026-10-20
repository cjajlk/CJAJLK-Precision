// All measurements are in millimetres on the target plane, including misses.
export function groupStats(shots) {
 const points=shots.filter(s=>s.impactMM&&Number.isFinite(s.impactMM.x)&&Number.isFinite(s.impactMM.y)).map(s=>s.impactMM);
 const n=points.length;
 const center=n?{x:points.reduce((a,p)=>a+p.x,0)/n,y:points.reduce((a,p)=>a+p.y,0)/n}:null;
 let dispersion=null;
 if(n>=2){dispersion=0;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)dispersion=Math.max(dispersion,Math.hypot(points[i].x-points[j].x,points[i].y-points[j].y));}
 return {shots:shots.length,measured:n,score:shots.reduce((a,s)=>a+s.score,0),center,offset:center?Math.hypot(center.x,center.y):null,dispersion};
}
export function readSessions(storage) {
 try {const data=JSON.parse(storage.getItem('cjajlk-precision-sessions')||'[]');return Array.isArray(data)?data.filter(s=>s&&Array.isArray(s.shots)&&s.shots.length<=40).slice(-20):[];} catch{return [];}
}
export function saveSession(storage,session) {
 try{const history=readSessions(storage).filter(s=>s.id!==session.id);history.push(session);storage.setItem('cjajlk-precision-sessions',JSON.stringify(history.slice(-20)));return true;}catch{return false;}
}

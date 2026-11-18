import {orderedShots,targets} from './targets.js';
export function distribution(s){
 if(s.mode!=='detail')return null;
 const shots=orderedShots(s),known=shots.filter(p=>p.score!==null),bins=Array(11).fill(0);
 for(const p of known)bins[p.score]++;
 const bands=[[0,3],[4,6],[7,10]].map(([min,max])=>{const count=bins.slice(min,max+1).reduce((a,b)=>a+b,0);return {min,max,count,percent:known.length?count/known.length*100:null};});
 return {bins,bands,count:known.length,unknown:shots.length-known.length,mean:known.length?known.reduce((a,p)=>a+p.score,0)/known.length:null};
}
export function compatible(a,b){return a.discipline===b.discipline&&a.planned===b.planned&&(a.perTarget??null)===(b.perTarget??null);}
export function comparable(sessions,s){return sessions.filter(x=>x.status==='done'&&x.mode==='detail'&&compatible(x,s)).sort((a,b)=>a.date.localeCompare(b.date)||a.id.localeCompare(b.id));}
export function targetResults(s){if(s.mode!=='detail')return [];return targets(s).map(t=>({...t,complete:t.items.length===t.capacity&&!t.uncertain,percent:t.total/(t.capacity*10)*100}));}
export function extremes(s){const rows=targetResults(s).filter(t=>t.complete);if(!rows.length)return {best:[],worst:[]};const high=Math.max(...rows.map(t=>t.percent)),low=Math.min(...rows.map(t=>t.percent));return {best:rows.filter(t=>t.percent===high).map(t=>t.number),worst:rows.filter(t=>t.percent===low).map(t=>t.number)};}
// Keep original series and chronological order, including legacy sessions.
export function appendShot(s,score){if(orderedShots(s).length>=s.planned)throw Error('Séance complète.');if(score!==null&&(!Number.isInteger(score)||score<0||score>10))throw Error('Score invalide.');if(!s.series.length)s.series.push({color:'#29d5ed',shots:[]});s.series.at(-1).shots.push(score);}
export function undoShot(s){for(let i=s.series.length-1;i>=0;i--)if(s.series[i].shots.length)return s.series[i].shots.pop();}
export function tapGate(delay=450,now=()=>performance.now()){let last=-Infinity;return ()=>{const t=now();if(t-last<delay)return false;last=t;return true;};}

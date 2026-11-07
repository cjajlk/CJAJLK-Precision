import {validateExtras} from './feelings.js';
export const KEY='cjajlk-real-notebook-v1';
export const RULES={'rifle10-integer':{name:'Carabine 10 m · points entiers',max:10,step:1}};
export function validate(s){
 if(!s||typeof s.id!=='string'||!s.id||s.id.length>100||typeof s.discipline!=='string'||!Object.hasOwn(RULES,s.discipline))throw Error('Séance ou discipline inconnue.');
 if(!Number.isInteger(s.planned)||s.planned<1||s.planned>1000)throw Error('Choisissez de 1 à 1 000 plombs.');
 if(typeof s.date!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(s.date)||!Number.isFinite(Date.parse(s.date+'Z'))||new Date(s.date+'Z').toISOString().slice(0,16)!==s.date)throw Error('Date invalide.');
 if(!['training','competition','other'].includes(s.type)||!['quick','detail'].includes(s.mode)||!['draft','done'].includes(s.status))throw Error('Format de séance invalide.');
 if(typeof s.notes!=='string'||s.notes.length>10000||!Array.isArray(s.series)||s.series.length>1000)throw Error('Notes ou séries invalides.');
 validateExtras(s);
 const max=RULES[s.discipline].max;
 if(s.total!==null&&(!Number.isInteger(s.total)||s.total<0||s.total>s.planned*max))throw Error('Total hors limites.');
 let count=0;
 for(const series of s.series){if(!series||!Array.isArray(series.shots)||series.shots.length>1000||!/^#[0-9a-f]{6}$/i.test(series.color))throw Error('Série invalide.');for(const n of series.shots){if(n!==null&&(!Number.isInteger(n)||n<0||n>max))throw Error('Chaque plomb doit valoir de 0 à 10, ou être incertain.');count++;}}
 if(count>s.planned)throw Error('Trop de tirs : modifiez volontairement le nombre prévu.');
 if(s.photo!==null&&(typeof s.photo!=='string'||s.photo.length>750000||!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(s.photo)))throw Error('Photo invalide ou trop volumineuse.');
 if(s.status==='done'&&!complete(s))throw Error('Séance incomplète : renseignez tous les scores avant de terminer.');
 return s;
}
export function complete(s){return s.mode==='quick'?s.total!==null:s.series.flatMap(g=>g.shots).length===s.planned&&s.series.every(g=>g.shots.every(n=>n!==null));}
export function stats(s){
 const values=s.series.flatMap(g=>g.shots),known=values.filter(n=>n!==null),sum=known.reduce((a,b)=>a+b,0),score=s.mode==='quick'?s.total:sum;
 const mean=s.mode==='quick'?(score===null?null:score/s.planned):(known.length?sum/known.length:null);
 return {score,max:s.planned*RULES[s.discipline].max,count:values.length,uncertain:values.length-known.length,mean,percent:score===null?null:score/(s.planned*RULES[s.discipline].max)*100,sd:s.mode==='detail'&&known.length>1&&known.length===values.length?Math.sqrt(known.reduce((a,n)=>a+(n-mean)**2,0)/known.length):null};
}
export function createSession(date,perTarget=5){return {perTarget,id:crypto.randomUUID(),date,discipline:'rifle10-integer',planned:30,type:'training',notes:'',photo:null,mode:'detail',total:null,series:[{color:'#29d5ed',shots:[]}],status:'draft'};}
export function progression(sessions,discipline,planned){return sessions.filter(s=>s.status==='done'&&s.discipline===discipline&&s.planned===Number(planned)).sort((a,b)=>a.date.localeCompare(b.date));}
export function parseBackup(text){
 const data=JSON.parse(text);if(data?.app!=='cjajlk-real-notebook'||data.version!==1||!Array.isArray(data.sessions)||data.sessions.length>5000)throw Error('Sauvegarde du carnet non reconnue.');
 const ids=new Set();for(const s of data.sessions){validate(s);if(ids.has(s.id))throw Error('Identifiant dupliqué dans la sauvegarde.');ids.add(s.id);}return data.sessions;
}
export function merge(existing,incoming){const ids=new Set(existing.map(s=>s.id));return [...existing,...incoming.filter(s=>!ids.has(s.id))];}
export function read(storage){const raw=storage.getItem(KEY);if(!raw)return [];return parseBackup(raw);}
export function backup(sessions){return JSON.stringify({app:'cjajlk-real-notebook',version:1,sessions},null,2);}
export function write(storage,sessions){sessions.forEach(validate);storage.setItem(KEY,backup(sessions));}

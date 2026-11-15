import {cost,power,all,where} from './engine.js';
export function assign(s,p){const z=s.combat.z,mine=all(s,p).filter(u=>where(s,u)==z),m={};
 const left=all(s,1-p).filter(u=>where(s,u)==z).sort((a,b)=>power(s,b)-power(s,a));
 for(const u of mine.sort((a,b)=>power(s,b)-power(s,a))){
  if(z=='b'+(1-p)){m[u.uid]='T';continue}
  const t=left.find(v=>power(s,v)<=power(s,u))||left[left.length-1];if(t){m[u.uid]=t.uid;if(power(s,t)<=power(s,u))left.splice(left.indexOf(t),1)}}
 return m}
export function next(s,p,D){
 if(s.combat)return s.combat.done[p]?null:{t:'assign',p,map:assign(s,p)};
 if(s.active!=p)return null;const P=s.P[p],av=P.res-P.used,mine=all(s,p);
 for(const x of [...P.hand].sort((a,b)=>cost(s,p,b)-cost(s,p,a))){const d=D[x.id];if(d.react||cost(s,p,x)>av)continue;
  if(d.type=='lieu'){const i=[p,1-p].find(i=>!s.L[i]&&(i==p||s.free[i]));if(i!=null)return{t:'play',p,uid:x.uid,tgt:i}}
  else if(d.type=='equip'){const u=mine.filter(u=>where(s,u)!='b'+(1-p)).sort((a,b)=>power(s,b)-power(s,a))[0];
   if(u&&(!d.eqCost||P.hand.length>1))return{t:'play',p,uid:x.uid,tgt:u.uid}}
  else return{t:'play',p,uid:x.uid}}
 for(const u of mine){if(u.tapped)continue;const w=where(s,u);
  if(w=='b'+p){const i=[1-p,p].find(i=>s.L[i]);if(i!=null)return{t:'move',p,uid:u.uid,to:'z'+i}}
  else if(w[0]=='z')return{t:'move',p,uid:u.uid,to:'b'+(1-p)}}
 return{t:'end',p}}

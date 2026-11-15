// Moteur pur : l'état est un JSON, act(état, action) -> {s} ou {err}. Aucune dépendance à l'UI.
let D={};export const setDefs=d=>D=d;export const defs=()=>D;
const shuf=a=>{for(let i=a.length;--i>0;){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const mk=(s,id,o)=>({uid:s.uid++,id,owner:o,tapped:false,eq:[],tmp:0,mt:false});
const rm=(a,x)=>a.splice(a.indexOf(x),1);
const nm=p=>p?'IA':'Toi';
const log=(s,t)=>{s.log.push(t);if(s.log.length>40)s.log.shift()};
export const all=(s,p)=>Object.values(s.Z).flat().filter(u=>p==null||u.owner==p);
export const where=(s,u)=>Object.keys(s.Z).find(k=>s.Z[k].includes(u));
export const find=(s,uid)=>all(s).find(u=>u.uid==uid);
export function power(s,u){let e=u.eq.reduce((a,q)=>a+(D[q.id].power||0),0);if(u.id=='peach')e*=2;
 let b=D[u.id].power+e+u.tmp;if(u.id=='mario'&&s.active!=u.owner)b+=2*u.eq.length;return b}
export function cost(s,p,c){const d=D[c.id];let k=d.cost;
 if(d.type=='action'&&d.fam.includes('Frère Mario')&&all(s,p).some(u=>u.id=='luigi'))k--;return Math.max(0,k)}
export function newGame(deck,first=0){
 const s={uid:1,active:first,first,log:[],winner:null,combat:null,Z:{b0:[],b1:[],z0:[],z1:[]},L:[null,null],free:[false,false],P:[]};
 for(let p=0;p<2;p++){const cs=[];for(const[id,n]of Object.entries(deck.cards))for(let i=0;i<n;i++)cs.push(mk(s,id,p));
  s.P.push({deck:shuf(cs),hand:[],disc:[],pv:D[deck.trans].pv,res:p==first?1:2,used:0,conq:0,turns:0,trans:deck.trans})}
 draw(s,0,5);draw(s,1,5);start(s,first);return s}
function draw(s,p,n){const P=s.P[p];while(n--&&P.deck.length)P.hand.push(P.deck.shift())}
export function kill(s,u){const k=where(s,u);s.Z[k].splice(s.Z[k].indexOf(u),1);s.P[u.owner].disc.push(u,...u.eq);u.eq=[];log(s,`${D[u.id].name} (${nm(u.owner)}) est détruit`)}
function start(s,p){const P=s.P[p];P.turns++;if(P.turns>1)P.res=Math.min(10,P.res+2);P.used=0;
 all(s,p).forEach(u=>{u.tapped=false;u.mt=false});
 s.Z['b'+p].filter(u=>u.owner!=p).forEach(u=>kill(s,u));
 [0,1].forEach(i=>{const l=s.L[i];if(l&&D[l.id].start=='galaxy')s.Z['z'+i].filter(u=>u.owner==p&&power(s,u)>=6).forEach(u=>{rm(s.Z['z'+i],u);s.Z['b'+p].push(u)})});
 [0,1].forEach(i=>{const l=s.L[i];if(!l)return;const n=s.Z['z'+i].filter(u=>u.owner==p).length,c=D[l.id].conq;
  l.occ[p]=n?l.occ[p]+1:0;if(c.turns?l.occ[p]>=c.turns:n>=c.units)conquer(s,i,p)});
 if(!(p==s.first&&P.turns==1))draw(s,p,1);log(s,`— Tour de ${nm(p)} —`)}
function conquer(s,i,p){const l=s.L[i];s.L[i]=null;s.free[i]=true;s.P[l.owner].disc.push(l);s.P[p].conq++;
 log(s,`${nm(p)} conquiert ${D[l.id].name} (${s.P[p].conq}/5)`);draw(s,p,D[l.id].draw);
 s.Z['z'+i].splice(0).forEach(u=>s.Z['b'+u.owner].push(u));if(s.P[p].conq>=5)s.winner=p}
function equip(s,u,c){u.eq.push(c);if(D[c.id].untap)u.tapped=false;log(s,`${D[c.id].name} équipé sur ${D[u.id].name}`)}
function fx(s,p,c,f){if(!f)return;const P=s.P[p];if(f.draw)draw(s,p,f.draw);
 if(f.search||f.equipTop){const top=P.deck.splice(0,f.search?f.search.n:f.equipTop);
  const best=top.filter(x=>{const d=D[x.id];return d.fam.includes('Royaume Champignon')&&(f.equipTop?d.type=='equip':x.id!=f.search.not)})
   .sort((a,b)=>D[b.id].cost-D[a.id].cost)[0];
  if(best){rm(top,best);if(f.equipTop)equip(s,c,best);else{P.hand.push(best);log(s,`${nm(p)} ajoute ${D[best.id].name} à sa main`)}}
  P.deck.push(...top)}
 if(f.moveBase){const u=all(s,p).find(x=>x.uid==f.mv);if(u&&where(s,u)!='b'+p){rm(s.Z[where(s,u)],u);s.Z['b'+p].push(u)}}}
export function act(s0,a){const s=structuredClone(s0);const e=ap(s,a);return e?{s:s0,err:e}:{s}}
function ap(s,a){
 if(s.winner!=null)return'Partie terminée';const p=a.p,P=s.P[p],c0=s.combat;
 if(a.t=='assign'){if(!c0||c0.done[p])return'Pas de combat';c0.map[p]=a.map||{};c0.done[p]=true;if(c0.done[0]&&c0.done[1])resolve(s);return}
 if(a.t=='react'){const c=P.hand.find(x=>x.uid==a.uid),d=c&&D[c.id];if(!c0||!d||!d.react)return'Réaction impossible';
  const u=find(s,a.tgt);if(!u||u.owner!=p||where(s,u)!=c0.z||c0.done[p])return'Cible invalide';
  const k=cost(s,p,c);if(P.res-P.used<k)return'Pas assez de ressources';P.used+=k;rm(P.hand,c);P.disc.push(c);u.tmp+=d.react;
  log(s,`${nm(p)} joue ${d.name} : ${D[u.id].name} +${d.react}`);return}
 if(c0)return'Combat en cours';if(s.active!=p)return'Ce n\'est pas ton tour';
 if(a.t=='end'){all(s).forEach(u=>u.tmp=0);s.active=1-p;start(s,1-p);return}
 if(a.t=='move'){const u=find(s,a.uid),to=a.to;if(!u||u.owner!=p)return'Personnage invalide';const from=where(s,u);
  if(u.tapped&&!(u.eq.some(q=>D[q.id].moveTapped)&&!u.mt))return'Personnage épuisé';
  const ok=from=='b'+p?(to[0]=='z'&&s.L[+to[1]]):(from[0]=='z'&&to[0]=='b');if(!ok)return'Déplacement impossible';
  if(u.tapped)u.mt=true;u.tapped=true;rm(s.Z[from],u);s.Z[to].push(u);log(s,`${D[u.id].name} (${nm(p)}) → ${to}`);
  if(s.Z[to].some(x=>x.owner!=p)||(to[0]=='b'&&to!='b'+p))s.combat={z:to,done:[false,false],map:[{},{}]};return}
 if(a.t=='play'){const c=P.hand.find(x=>x.uid==a.uid);if(!c)return'Carte absente';const d=D[c.id],k=cost(s,p,c);
  if(d.react)return'Réaction : jouable pendant un combat';if(P.res-P.used<k)return'Pas assez de ressources';
  if(d.type=='lieu'){const i=a.tgt;if((i!=0&&i!=1)||s.L[i]||!(i==p||s.free[i]))return'Emplacement indisponible';
   P.used+=k;rm(P.hand,c);c.occ=[0,0];s.L[i]=c;log(s,`${nm(p)} joue le Lieu ${d.name}`);return}
  if(d.type=='equip'){const u=find(s,a.tgt);if(!u||u.owner!=p)return'Choisis un de tes Personnages';
   if(d.eqCost&&P.hand.length<2)return'Il faut défausser 1 carte pour équiper';
   P.used+=k;rm(P.hand,c);if(d.eqCost){const x=P.hand.reduce((m,y)=>D[y.id].cost<D[m.id].cost?y:m);rm(P.hand,x);P.disc.push(x)}
   equip(s,u,c);return}
  P.used+=k;rm(P.hand,c);log(s,`${nm(p)} joue ${d.name}`);
  if(d.type=='perso'){c.tapped=true;s.Z['b'+p].push(c)}else P.disc.push(c);
  fx(s,p,c,{...d.fx,mv:a.mv});return}
 return'Action inconnue'}
function resolve(s){const c=s.combat,z=c.z,dm=new Map(),tr=[0,0];s.combat=null;
 for(const p of[0,1])for(const[uid,t]of Object.entries(c.map[p])){const u=find(s,+uid);
  if(!u||u.owner!=p||where(s,u)!=z)continue;const w=power(s,u);
  if(t=='T'){if(z=='b'+(1-p))tr[1-p]+=w}else{const v=find(s,+t);if(v&&v.owner!=p&&where(s,v)==z)dm.set(v,(dm.get(v)||0)+w)}}
 [...dm].filter(([v,d])=>d>=power(s,v)).forEach(([v])=>kill(s,v));
 for(const q of[0,1])if(tr[q]){s.P[q].pv=Math.max(0,s.P[q].pv-tr[q]);log(s,`Le Transcendant de ${nm(q)} perd ${tr[q]} PV`);if(!s.P[q].pv)s.winner=1-q}}


const D=CARDS,deck=DECK;E.setDefs(D);
const $=id=>document.getElementById(id),W=['Toi','IA'];
let s,sel=null,asg={},msg='';
const img=id=>`assets/cards/${D[id].img}`;
const unit=u=>`<div class="c ${u.tapped?'t':''} ${u.owner?'foe':''} ${sel&&sel.u==u.uid?'sel':''} ${asg[sel&&sel.u]==u.uid?'tg':''}" data-u="${u.uid}" title="${D[u.id].name}"><img src="${img(u.id)}"><b>${E.power(s,u)}</b>${u.eq.length?`<i>+${u.eq.length} éq.</i>`:''}</div>`;
const zone=k=>{const i=+k[1],us=s.Z[k].map(unit).join('');
 if(k[0]=='b'){const P=s.P[i];return`<div class="z" data-z="${k}"><h4>Base ${W[i]} — PV ${P.pv}</h4><div class="cs"><div class="c ${asg[sel&&sel.u]=='T'&&0?'tg':''}" data-t="${i}"><img src="${img(P.trans)}"><b>${P.pv}</b></div>${us}</div></div>`}
 const l=s.L[i],free=!l&&(i==0||s.free[i]);
 return`<div class="z ${sel&&sel.h&&D[sel.h.id].type=='lieu'&&free&&!l?'hl':''}" data-z="${k}"><h4>Lieu ${i?'adverse':'à toi'} ${l?`— occupation ${l.occ[0]}/${l.occ[1]}`:free?'— emplacement libre':'— réservé'}</h4><div class="cs">${l?`<div class="c lieu"><img src="${img(l.id)}"></div>`:''}${us}</div></div>`};
function render(){const P=s.P[0],C=s.combat;
 $('st').textContent=`Ressources ${P.res-P.used}/${P.res} · PV ${P.pv} vs ${s.P[1].pv} · Lieux ${P.conq}/5 vs ${s.P[1].conq}/5`;
 $('board').innerHTML=`<div class="row one">${zone('b1')}</div><div class="row">${zone('z1')}${zone('z0')}</div><div class="row one">${zone('b0')}</div>
 <div class="cs" id="hand">${P.hand.map(c=>{const d=D[c.id],k=E.cost(s,0,c);return`<div class="c ${k>P.res-P.used?'dim':''} ${sel&&sel.h&&sel.h.uid==c.uid?'sel':''}" data-h="${c.uid}"><img src="${img(c.id)}"><u>${d.react?d.cost:k}</u></div>`}).join('')}</div>`;
 $('log').innerHTML=s.log.slice().reverse().map(l=>`<div>${l}</div>`).join('');
 const mine=C&&!C.done[0];$('val').hidden=!mine;$('end').disabled=!!C||s.active!=0||s.winner!=null;
 $('msg').textContent=s.winner!=null?(s.winner==0?'Victoire !':'Défaite…'):msg||(mine?`Combat en ${C.z} : clique un de tes persos puis sa cible (ou le Transcendant), puis valide.`:s.active==0?'À toi de jouer.':'Tour de l\'IA…')}
function go(a){const r=E.act(s,a);if(r.err){msg=r.err}else{s=r.s;msg='';sel=null;asg={}}step()}
function step(){render();if(s.winner!=null)return;const C=s.combat;let a=null;
 if(C&&!C.done[1])a=AI.next(s,1,D);
 else if(C&&!C.done[0]&&!s.Z[C.z].some(u=>u.owner==0))a={t:'assign',p:0,map:{}};
 else if(!C&&s.active==1)a=AI.next(s,1,D)||{t:'end',p:1};
 if(!a)return;setTimeout(()=>{let r=E.act(s,a);if(r.err)r=E.act(s,a.t=='assign'?{...a,map:{}}:{t:'end',p:a.p});s=r.s;step()},450)}
document.addEventListener('click',e=>{if(s.winner!=null)return;const t=e.target.closest('[data-h],[data-u],[data-t],[data-z]');if(!t)return;
 const C=s.combat,hand=s.P[0].hand;
 if(t.dataset.h){const c=hand.find(x=>x.uid==t.dataset.h),d=D[c.id];
  if(!C&&(d.type=='perso'||(d.type=='action'&&!d.react)))return go({t:'play',p:0,uid:c.uid});
  sel={h:c};msg=d.type=='lieu'?'Clique sur ton emplacement de Lieu.':'Clique sur le Personnage cible.';return render()}
 if(t.dataset.u){const u=E.find(s,+t.dataset.u);
  if(sel&&sel.h){const d=D[sel.h.id];return go(d.react?{t:'react',p:0,uid:sel.h.uid,tgt:u.uid}:{t:'play',p:0,uid:sel.h.uid,tgt:u.uid})}
  if(C){if(u.owner==0&&E.where(s,u)==C.z)sel={u:u.uid};else if(sel&&sel.u)asg[sel.u]=u.uid;return render()}
  if(u.owner==0){sel={u:u.uid};msg='Clique sur un Lieu ou une Base pour déplacer.';return render()}return}
 if(t.dataset.t&&C&&sel&&sel.u){asg[sel.u]='T';return render()}
 if(t.dataset.z){const k=t.dataset.z;
  if(sel&&sel.h)return go({t:'play',p:0,uid:sel.h.uid,tgt:+k[1]});
  if(sel&&sel.u&&!C)return go({t:'move',p:0,uid:sel.u,to:k})}});
$('val').onclick=()=>go({t:'assign',p:0,map:asg});$('end').onclick=()=>go({t:'end',p:0});
$('new').onclick=()=>{s=E.newGame(deck,Math.random()<.5?0:1);sel=null;asg={};msg='';step()};
$('new').click();

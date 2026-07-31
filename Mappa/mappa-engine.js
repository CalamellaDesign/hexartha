// mappa-engine.js — HEXARTHA illustrated map engine
// Exports: wkRenderToSvg(svgEl, tiles, transform)
(function(global){
'use strict';
var R=90,H=R*Math.sqrt(3)/2,SF=R/52,NS='http://www.w3.org/2000/svg';
var _svg=null,_sm=false,_cpBuf='';

var DEFS=[
'<filter id="wk-text-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#000" flood-opacity="1"/></filter>',
'<filter id="wk-dark-halo" x="-40%" y="-80%" width="180%" height="260%"><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/><feFlood flood-color="#000" flood-opacity="0.92" result="color"/><feComposite in="color" in2="blur" operator="in" result="halo"/><feMerge><feMergeNode in="halo"/><feMergeNode in="halo"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
'<filter id="wk-glow-red-dot" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="5" result="blur"/><feFlood flood-color="#FF2010" flood-opacity="0.8" result="col"/><feComposite in="col" in2="blur" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
'<filter id="wk-glow-fire" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="6" result="blur"/><feFlood flood-color="#FF6010" flood-opacity="0.9" result="col"/><feComposite in="col" in2="blur" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
'<filter id="wk-fortress-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="18" result="blur"/><feFlood flood-color="#FF2010" flood-opacity="0.35" result="col"/><feComposite in="col" in2="blur" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
'<filter id="wk-glow-cat-accampamento" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6" result="blur"/><feFlood flood-color="#3A7030" flood-opacity="0.6" result="col"/><feComposite in="col" in2="blur" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
'<filter id="wk-glow-cat-stazione" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6" result="blur"/><feFlood flood-color="#A07820" flood-opacity="0.6" result="col"/><feComposite in="col" in2="blur" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
'<filter id="wk-glow-cat-ospedaliera" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6" result="blur"/><feFlood flood-color="#208868" flood-opacity="0.6" result="col"/><feComposite in="col" in2="blur" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
'<filter id="wk-glow-cat-militare" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6" result="blur"/><feFlood flood-color="#786808" flood-opacity="0.6" result="col"/><feComposite in="col" in2="blur" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
'<filter id="wk-glow-cat-estrazione" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6" result="blur"/><feFlood flood-color="#508030" flood-opacity="0.6" result="col"/><feComposite in="col" in2="blur" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
'<filter id="wk-glow-cat-riciclaggio" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6" result="blur"/><feFlood flood-color="#782808" flood-opacity="0.6" result="col"/><feComposite in="col" in2="blur" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
'<filter id="wk-glow-cat-avamposto" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6" result="blur"/><feFlood flood-color="#508830" flood-opacity="0.6" result="col"/><feComposite in="col" in2="blur" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
'<filter id="wk-stz-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="13" result="blur"/><feFlood flood-color="#A07820" flood-opacity="0.22" result="col"/><feComposite in="col" in2="blur" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
'<filter id="wk-mil-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="14" result="blur"/><feFlood flood-color="#786808" flood-opacity="0.22" result="col"/><feComposite in="col" in2="blur" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
'<filter id="wk-rec-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="13" result="blur"/><feFlood flood-color="#782808" flood-opacity="0.22" result="col"/><feComposite in="col" in2="blur" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
'<filter id="wk-ext-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="14" result="blur"/><feFlood flood-color="#508030" flood-opacity="0.24" result="col"/><feComposite in="col" in2="blur" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
'<filter id="wk-camp-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="13" result="blur"/><feFlood flood-color="#60A040" flood-opacity="0.22" result="col"/><feComposite in="col" in2="blur" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
'<filter id="wk-avo-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="13" result="blur"/><feFlood flood-color="#508830" flood-opacity="0.22" result="col"/><feComposite in="col" in2="blur" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
'<filter id="wk-urb-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="10" result="blur"/><feFlood flood-color="#2a2830" flood-opacity="0.18" result="col"/><feComposite in="col" in2="blur" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
'<filter id="wk-osp-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="14" result="blur"/><feFlood flood-color="#208868" flood-opacity="0.22" result="col"/><feComposite in="col" in2="blur" operator="in" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
'<radialGradient id="wk-fort-bg" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="rgba(120,8,4,0.95)"/><stop offset="100%" stop-color="rgba(40,2,0,1)"/></radialGradient>',
'<radialGradient id="wk-fort-glow-center" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#FF2010" stop-opacity="0.18"/><stop offset="100%" stop-color="#FF2010" stop-opacity="0"/></radialGradient>'
].join('');

function injectDefs(){
  if(_svg.querySelector('#wk-dark-halo'))return;
  var defs=_svg.querySelector('defs');
  if(!defs){defs=document.createElementNS(NS,'defs');_svg.insertBefore(defs,_svg.firstChild);}
  var tmp=document.createElementNS(NS,'svg');
  tmp.innerHTML='<defs>'+DEFS+'</defs>';
  var td=tmp.querySelector('defs');
  while(td.firstChild)defs.appendChild(td.firstChild);
}

function addCP(id,cx,cy){
  if(_sm){_cpBuf+=`<clipPath id="${id}"><polygon points="${hexPts(cx,cy)}"/></clipPath>`;return;}
  var defs=_svg.querySelector('defs');
  var cp=document.createElementNS(NS,'clipPath');cp.setAttribute('id',id);
  var pp=document.createElementNS(NS,'polygon');pp.setAttribute('points',hexPts(cx,cy));
  cp.appendChild(pp);defs.appendChild(cp);
}

// Dual-mode el(): DOM elements when _sm=false (external calls), virtual nodes when _sm=true (wkRenderToSvg)
function el(tag,attrs){
  if(!_sm){
    var e=document.createElementNS(NS,tag);
    if(attrs)Object.entries(attrs).forEach(([k,v])=>{if(v!=null)e.setAttribute(k,''+v);});
    return e;
  }
  var a='',c=[];
  if(attrs)Object.entries(attrs).forEach(([k,v])=>{if(v!=null)a+=` ${k}="${v}"`;});
  return{_a:a,_c:c,
    setAttribute:function(k,v){if(v!=null)this._a+=` ${k}="${v}"`;return this;},
    appendChild:function(ch){this._c.push(ch);return this;},
    toString:function(){return this._c.length?`<${tag}${this._a}>${this._c.join('')}</${tag}>`:`<${tag}${this._a}/>`;}};
}
function txt(str,attrs){
  if(!_sm){
    var e=document.createElementNS(NS,'text');
    if(attrs)Object.entries(attrs).forEach(([k,v])=>{if(v!=null)e.setAttribute(k,''+v);});
    e.textContent=str;return e;
  }
  var a='';if(attrs)Object.entries(attrs).forEach(([k,v])=>{if(v!=null)a+=` ${k}="${v}"`;});
  var safe=String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  var c=[safe];
  return{_a:a,_c:c,
    setAttribute:function(k,v){if(v!=null)this._a+=` ${k}="${v}"`;return this;},
    appendChild:function(ch){this._c.push(ch);return this;},
    toString:function(){return `<text${this._a}>${this._c.join('')}</text>`;}};
}
function hexPts(cx,cy){
  return[[cx+R,cy],[cx+R/2,cy-H],[cx-R/2,cy-H],[cx-R,cy],[cx-R/2,cy+H],[cx+R/2,cy+H]]
    .map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
}
function hexPtsS(cx,cy,sc){
  var r=R*sc,h=r*Math.sqrt(3)/2;
  return[[cx+r,cy],[cx+r/2,cy-h],[cx-r/2,cy-h],[cx-r,cy],[cx-r/2,cy+h],[cx+r/2,cy+h]]
    .map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
}
function tc(col,v){return[Math.round((60+col*78)*SF),Math.round((50+(v/2)*90)*SF)];}
function wrapN(nome,max){
  var ws=nome.split(' '),ls=[],cur='';
  ws.forEach(w=>{if((cur+(cur?' ':'')+w).length<=max)cur+=(cur?' ':'')+w;else{if(cur)ls.push(cur);cur=w;}});
  if(cur)ls.push(cur);return ls.slice(0,3);
}
function anim6(g,polyEl,vals,dur){
  g.appendChild(polyEl); // animazione disabilitata per performance nel prototipo
}
function dots6(cx,cy,fill){
  var g2=el('g');
  [[cx+R,cy],[cx+R/2,cy-H],[cx-R/2,cy-H],[cx-R,cy],[cx-R/2,cy+H],[cx+R/2,cy+H]]
    .forEach(([vx,vy])=>g2.appendChild(el('circle',{cx:vx,cy:vy,r:3.5,fill})));
  return g2;
}

function drawCatIcon(pg,cat,cx,cy,size,color,filt){
  var s=size*0.45,sw=Math.max(1.5,size*0.065);
  var attrs={transform:'translate('+cx.toFixed(1)+','+cy.toFixed(1)+')',stroke:color,fill:'none',
    'stroke-width':sw.toFixed(2),'stroke-linecap':'round','stroke-linejoin':'round',opacity:'0.82'};
  if(filt!==undefined)attrs.filter=filt;
  var ig=el('g',attrs);
  switch(cat){
    case'accampamento':
      ig.appendChild(el('polyline',{points:`${-s},${s} 0,${-s} ${s},${s} ${-s},${s}`}));
      ig.appendChild(el('polyline',{points:`${(-s*0.30).toFixed(1)},${s.toFixed(1)} ${(-s*0.30).toFixed(1)},${(s-s*0.48).toFixed(1)} ${(s*0.30).toFixed(1)},${(s-s*0.48).toFixed(1)} ${(s*0.30).toFixed(1)},${s.toFixed(1)}`}));break;
    case'avamposto':{
      var pts=[[0,-s],[s,-s*0.22],[s*0.62,s],[-s*0.62,s],[-s,-s*0.22]]
        .map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
      ig.appendChild(el('polygon',{points:pts}));break;}
    case'stazione':{
      var bh=s*0.42,wr=s*0.20,by2=-(bh+wr*0.45);
      ig.appendChild(el('rect',{x:(-s*0.92).toFixed(1),y:by2.toFixed(1),width:(s*1.84).toFixed(1),height:(bh*2).toFixed(1),rx:(s*0.10).toFixed(1)}));
      ig.appendChild(el('line',{x1:(-s*0.92).toFixed(1),y1:(by2+bh*0.42).toFixed(1),x2:(s*0.92).toFixed(1),y2:(by2+bh*0.42).toFixed(1),'stroke-opacity':'0.55'}));
      [-s*0.52,s*0.52].forEach(wx=>ig.appendChild(el('circle',{cx:wx.toFixed(1),cy:(by2+bh*2+wr*0.72).toFixed(1),r:wr.toFixed(1)})));break;}
    case'fortezza':{
      var w=s*0.95,hh=s*0.90,mw=s*0.22,mh=s*0.26,wt=-hh+mh;
      ig.appendChild(el('path',{d:`M${(-w).toFixed(1)},${hh.toFixed(1)} L${(-w).toFixed(1)},${wt.toFixed(1)} L${w.toFixed(1)},${wt.toFixed(1)} L${w.toFixed(1)},${hh.toFixed(1)} Z`}));
      [-s*0.52,0,s*0.52].forEach(mx=>ig.appendChild(el('rect',{x:(mx-mw/2).toFixed(1),y:(-hh).toFixed(1),width:mw.toFixed(1),height:mh.toFixed(1)})));
      var gw=s*0.22,gh=s*0.40;
      ig.appendChild(el('path',{d:`M${(-gw).toFixed(1)},${hh.toFixed(1)} L${(-gw).toFixed(1)},${(hh-gh+gw).toFixed(1)} A${gw.toFixed(1)},${gw.toFixed(1)} 0 0,1 ${gw.toFixed(1)},${(hh-gh+gw).toFixed(1)} L${gw.toFixed(1)},${hh.toFixed(1)}`}));break;}
    case'ospedaliera':{
      var arm=s*0.92,th=s*0.28;
      ig.appendChild(el('rect',{x:(-arm).toFixed(1),y:(-th).toFixed(1),width:(arm*2).toFixed(1),height:(th*2).toFixed(1),rx:(th*0.15).toFixed(1)}));
      ig.appendChild(el('rect',{x:(-th).toFixed(1),y:(-arm).toFixed(1),width:(th*2).toFixed(1),height:(arm*2).toFixed(1),rx:(th*0.15).toFixed(1)}));break;}
    case'militare':{
      var r2=s*0.80,gp=s*0.24;
      ig.appendChild(el('circle',{cx:0,cy:0,r:r2.toFixed(1)}));
      ig.appendChild(el('line',{x1:-r2,y1:0,x2:-gp,y2:0}));ig.appendChild(el('line',{x1:gp,y1:0,x2:r2,y2:0}));
      ig.appendChild(el('line',{x1:0,y1:-r2,x2:0,y2:-gp}));ig.appendChild(el('line',{x1:0,y1:gp,x2:0,y2:r2}));
      ig.appendChild(el('circle',{cx:0,cy:0,r:(gp*0.28).toFixed(1),fill:color,stroke:'none'}));break;}
    case'riciclaggio':
      ig.appendChild(el('polygon',{points:`${(-s*0.66).toFixed(1)},${(-s*0.08).toFixed(1)} ${(s*0.66).toFixed(1)},${(-s*0.08).toFixed(1)} ${(s*0.50).toFixed(1)},${(s*0.98).toFixed(1)} ${(-s*0.50).toFixed(1)},${(s*0.98).toFixed(1)}`}));
      ig.appendChild(el('line',{x1:(-s*0.82).toFixed(1),y1:(-s*0.08).toFixed(1),x2:(s*0.82).toFixed(1),y2:(-s*0.08).toFixed(1)}));
      ig.appendChild(el('path',{d:`M${(-s*0.26).toFixed(1)},${(-s*0.08).toFixed(1)} L${(-s*0.26).toFixed(1)},${(-s*0.50).toFixed(1)} L${(s*0.26).toFixed(1)},${(-s*0.50).toFixed(1)} L${(s*0.26).toFixed(1)},${(-s*0.08).toFixed(1)}`,fill:'none'}));
      ig.appendChild(el('line',{x1:(-s*0.26).toFixed(1),y1:(s*0.28).toFixed(1),x2:(s*0.26).toFixed(1),y2:(s*0.28).toFixed(1)}));
      ig.appendChild(el('line',{x1:(-s*0.20).toFixed(1),y1:(s*0.62).toFixed(1),x2:(s*0.20).toFixed(1),y2:(s*0.62).toFixed(1)}));break;
    case'estrazione':{
      var aw=s*0.44,shW=aw*0.28;
      ig.appendChild(el('polygon',{points:`0,${(-s).toFixed(1)} ${(-aw).toFixed(1)},${(-s+aw*0.9).toFixed(1)} ${(-shW).toFixed(1)},${(-s+aw*0.9).toFixed(1)} ${(-shW).toFixed(1)},${(s*0.28).toFixed(1)} ${shW.toFixed(1)},${(s*0.28).toFixed(1)} ${shW.toFixed(1)},${(-s+aw*0.9).toFixed(1)} ${aw.toFixed(1)},${(-s+aw*0.9).toFixed(1)}`}));
      ig.appendChild(el('line',{x1:(-s*0.62).toFixed(1),y1:(s*0.28).toFixed(1),x2:(s*0.62).toFixed(1),y2:(s*0.28).toFixed(1)}));break;}
    case'urbana':{
      var uw=s*0.80,uh=s*0.95,ww=s*0.17,whh=s*0.20,wg=s*0.34,dw=s*0.20,dh=s*0.30;
      ig.appendChild(el('rect',{x:(-uw).toFixed(1),y:(-uh).toFixed(1),width:(uw*2).toFixed(1),height:(uh*2).toFixed(1)}));
      [[-wg,-uh*0.48],[wg,-uh*0.48],[-wg,uh*0.06],[wg,uh*0.06]].forEach(([wx,wy])=>
        ig.appendChild(el('rect',{x:(wx-ww/2).toFixed(1),y:(wy-whh/2).toFixed(1),width:ww.toFixed(1),height:whh.toFixed(1)})));
      ig.appendChild(el('rect',{x:(-dw/2).toFixed(1),y:(uh-dh).toFixed(1),width:dw.toFixed(1),height:dh.toFixed(1)}));break;}
    default:ig.appendChild(el('circle',{cx:0,cy:0,r:s.toFixed(1)}));
  }
  pg.appendChild(ig);
}

// ── drawFortezza ──────────────────────────────────────────────────────────────
function drawFortezza(cx,cy){
  var g=el('g',{'class':'tile tile-fortezza'});
  var cid='wk-cp-fortezza';addCP(cid,cx,cy);
  var C={'clip-path':'url(#'+cid+')'};
  g.appendChild(el('rect',{x:cx-R-2,y:cy-H-2,width:(R+2)*2,height:(H+2)*2,fill:'url(#wk-fort-bg)',...C}));
  g.appendChild(el('rect',{x:cx-R,y:cy-H,width:R*2,height:H*2,fill:'url(#wk-fort-glow-center)',...C}));
  var sg=el('g',C);
  [{ox:-28,oy:-18,rx:22,ry:12,op:0.13},{ox:32,oy:10,rx:18,ry:10,op:0.10},
   {ox:-10,oy:30,rx:25,ry:11,op:0.11},{ox:15,oy:-32,rx:16,ry:9,op:0.09},
   {ox:-38,oy:22,rx:14,ry:7,op:0.08},{ox:40,oy:-15,rx:12,ry:8,op:0.10}]
    .forEach(s=>sg.appendChild(el('ellipse',{cx:cx+s.ox,cy:cy+s.oy,rx:s.rx,ry:s.ry,fill:'rgba(200,0,0,0.15)',opacity:s.op})));
  g.appendChild(sg);
  g.appendChild(el('polygon',{points:hexPtsS(cx,cy,0.80),fill:'#1a0000',stroke:'#8B0000','stroke-width':'8',...C}));
  var tR=R*0.80,tHH=tR*Math.sqrt(3)/2;
  var tg=el('g',C);
  [[cx+tR,cy],[cx+tR/2,cy-tHH],[cx-tR/2,cy-tHH],[cx-tR,cy],[cx-tR/2,cy+tHH],[cx+tR/2,cy+tHH]]
    .forEach(([tx,ty])=>tg.appendChild(el('circle',{cx:tx,cy:ty,r:8,fill:'#600000',stroke:'#8B0000','stroke-width':'2'})));
  g.appendChild(tg);
  g.appendChild(el('polygon',{points:hexPtsS(cx,cy,0.52),fill:'rgba(80,4,0,0.5)',stroke:'#600000','stroke-width':'2',...C}));
  var cR=R*0.52,cH=cR*Math.sqrt(3)/2;
  var cv=[[cx+cR,cy],[cx+cR/2,cy-cH],[cx-cR/2,cy-cH],[cx-cR,cy],[cx-cR/2,cy+cH],[cx+cR/2,cy+cH]];
  var fp=cv.map((v,i)=>{var n=cv[(i+1)%6];return[(v[0]+n[0])/2,(v[1]+n[1])/2];});
  var fg=el('g',C);
  [0,1,3,4].forEach(i=>fg.appendChild(el('circle',{cx:fp[i][0],cy:fp[i][1],r:4,fill:'#FF4010',filter:'url(#wk-glow-fire)'})));
  g.appendChild(fg);
  var kg=el('g',C);
  kg.appendChild(el('rect',{x:cx-15,y:cy-13,width:30,height:26,fill:'#1a0000',stroke:'#8B0000','stroke-width':'2'}));
  var kt=txt('✕',{x:cx,y:cy+1,'text-anchor':'middle','dominant-baseline':'middle','font-size':14,fill:'#5a0000','font-family':'monospace'});
  kg.appendChild(kt);g.appendChild(kg);
  g.appendChild(el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#8B0000','stroke-width':'5',...C}));
  var ap=el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#FF2010','stroke-width':'2.5','stroke-opacity':'0.3'});
  anim6(g,ap,'0.3;1;0.3','1.2s');
  g.appendChild(dots6(cx,cy,'#FF3010','url(#wk-glow-red-dot)'));
  var lb=el('g',{'class':'wk-tile-label',filter:'url(#wk-dark-halo)'});
  drawCatIcon(lb,'fortezza',cx,cy-22,Math.round(R*0.30),'#FF5030');
  lb.appendChild(txt('FORTEZZA',{x:cx,y:cy+16,'text-anchor':'middle','dominant-baseline':'middle','font-size':Math.round(R*0.13),'font-weight':'bold','letter-spacing':'3',fill:'#FF5030','font-family':'monospace'}));
  lb.appendChild(txt('ROSSA',{x:cx,y:cy+32,'text-anchor':'middle','dominant-baseline':'middle','font-size':Math.round(R*0.11),'font-weight':'bold','letter-spacing':'5',fill:'#CC1010','font-family':'monospace'}));
  g.appendChild(lb);return g;
}

// ── drawOspedale ──────────────────────────────────────────────────────────────
function drawOspedale(tile,cx,cy){
  var ala=tile.nome.split(' ').pop().toLowerCase(),isH=ala==='nord'||ala==='sud';
  var g=el('g',{'class':'tile tile-ospedaliera'});
  var cid='wk-cp-osp-'+ala;addCP(cid,cx,cy);var C={'clip-path':'url(#'+cid+')'};
  g.appendChild(el('rect',{x:cx-R-2,y:cy-H-2,width:(R+2)*2,height:(H+2)*2,fill:'#090b0d',...C}));
  [{ox:-52,oy:-34,w:44,h:32},{ox:16,oy:-26,w:50,h:36},{ox:-28,oy:22,w:56,h:32},{ox:38,oy:16,w:32,h:42},{ox:-64,oy:6,w:26,h:26}]
    .forEach(p=>g.appendChild(el('rect',{x:cx+p.ox,y:cy+p.oy,width:p.w,height:p.h,fill:'#0d0f12',opacity:'0.85',...C})));
  [{ox:-30,oy:46,rx:22,ry:12,op:0.30},{ox:44,oy:-32,rx:15,ry:9,op:0.24},{ox:-58,oy:-20,rx:13,ry:7,op:0.22},{ox:58,oy:34,rx:11,ry:6,op:0.20},{ox:10,oy:54,rx:19,ry:11,op:0.28}]
    .forEach(s=>g.appendChild(el('ellipse',{cx:cx+s.ox,cy:cy+s.oy,rx:s.rx,ry:s.ry,fill:'rgba(90,10,10,0.8)',opacity:s.op,...C})));
  [{ox:-70,oy:-12,rx:10,ry:5},{ox:66,oy:-28,rx:9,ry:5},{ox:-44,oy:62,rx:10,ry:5},{ox:52,oy:57,rx:8,ry:4},{ox:-30,oy:-64,rx:9,ry:4},{ox:32,oy:-60,rx:8,ry:4}]
    .forEach(v=>g.appendChild(el('ellipse',{cx:cx+v.ox,cy:cy+v.oy,rx:v.rx,ry:v.ry,fill:'#141210',opacity:'0.88',...C})));
  var em={top:[cx,cy-H],ur:[cx+67.5,cy-H/2],lr:[cx+67.5,cy+H/2],bot:[cx,cy+H],ll:[cx-67.5,cy+H/2],ul:[cx-67.5,cy-H/2]};
  Object.values(em).forEach(([ex,ey])=>{
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#0c0f12','stroke-width':20,...C}));
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#1e2630','stroke-width':13,...C}));
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#2e3c48','stroke-width':1.5,'stroke-dasharray':'10,8',...C}));});
  var bx,by,bw,bh,wx,wy,ww,wh,ux,uy;
  if(ala==='nord'){bx=-36;by=-8;bw=72;bh=26;wx=-14;wy=-48;ww=28;wh=40;ux=22;uy=24;}
  else if(ala==='sud'){bx=-36;by=-18;bw=72;bh=26;wx=-14;wy=8;ww=28;wh=40;ux=22;uy=-40;}
  else if(ala==='est'){bx=-10;by=-36;bw=26;bh=72;wx=16;wy=-14;ww=40;wh=28;ux=-40;uy=24;}
  else{bx=-16;by=-36;bw=26;bh=72;wx=-56;wy=-14;ww=40;wh=28;ux=22;uy=24;}
  var bg=el('g',C);
  bg.appendChild(el('rect',{x:cx+bx+3,y:cy+by+3,width:bw,height:bh,fill:'#000',opacity:'0.38'}));
  bg.appendChild(el('rect',{x:cx+wx+3,y:cy+wy+3,width:ww,height:wh,fill:'#000',opacity:'0.32'}));
  bg.appendChild(el('rect',{x:cx+bx,y:cy+by,width:bw,height:bh,fill:'#141820',stroke:'#1e2430','stroke-width':'1.5'}));
  bg.appendChild(el('rect',{x:cx+wx,y:cy+wy,width:ww,height:wh,fill:'#161c22',stroke:'#1e2430','stroke-width':'1.5'}));
  bg.appendChild(el('rect',{x:cx+ux,y:cy+uy,width:20,height:16,fill:'#121520',stroke:'#1e2430','stroke-width':'1'}));
  g.appendChild(bg);
  var wCX=cx+wx+ww/2,wCY=cy+wy+wh/2,bCX=cx+bx+bw/2,bCY=cy+by+bh/2;
  var wg=el('g',C);
  for(var di=-1;di<=1;di++)for(var dj=-1;dj<=1;dj++)
    wg.appendChild(el('rect',{x:wCX+di*(isH?8:6)-1.5,y:wCY+dj*(isH?6:8)-1.5,width:3,height:3,fill:'#c8a040',opacity:'0.12'}));
  g.appendChild(wg);
  g.appendChild(el('rect',{x:bCX-4,y:bCY-3,width:8,height:5,fill:'#1c2228',stroke:'#283040','stroke-width':'1',...C}));
  g.appendChild(el('rect',{x:bCX+6,y:bCY+1,width:6,height:4,fill:'#1c2228',stroke:'#283040','stroke-width':'1',...C}));
  var cg=el('g',C),arm=9,th=2.8;
  cg.appendChild(el('rect',{x:bCX-arm,y:bCY-th,width:arm*2,height:th*2,fill:'#5a0000'}));
  cg.appendChild(el('rect',{x:bCX-th,y:bCY-arm,width:th*2,height:arm*2,fill:'#5a0000'}));
  cg.appendChild(el('rect',{x:bCX-arm+1,y:bCY-th+0.5,width:(arm-1)*2,height:(th-0.5)*2,fill:'#991010'}));
  cg.appendChild(el('rect',{x:bCX-th+0.5,y:bCY-arm+1,width:(th-0.5)*2,height:(arm-1)*2,fill:'#991010'}));
  g.appendChild(cg);
  var hg=el('g',C);
  hg.appendChild(el('circle',{cx:wCX,cy:wCY,r:10,fill:'none',stroke:'#208868','stroke-width':'1.5',opacity:'0.55'}));
  hg.appendChild(el('line',{x1:wCX-5,y1:wCY-6,x2:wCX-5,y2:wCY+6,stroke:'#208868','stroke-width':'1.8',opacity:'0.55'}));
  hg.appendChild(el('line',{x1:wCX+5,y1:wCY-6,x2:wCX+5,y2:wCY+6,stroke:'#208868','stroke-width':'1.8',opacity:'0.55'}));
  hg.appendChild(el('line',{x1:wCX-5,y1:wCY,x2:wCX+5,y2:wCY,stroke:'#208868','stroke-width':'1.8',opacity:'0.55'}));
  g.appendChild(hg);
  if(isH){g.appendChild(el('circle',{cx:cx-52,cy:cy+34,r:3.5,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.80',...C}));
    g.appendChild(el('circle',{cx:cx+52,cy:cy-34,r:2.5,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.65',...C}));}
  else{g.appendChild(el('circle',{cx:cx+34,cy:cy-52,r:3.5,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.80',...C}));
    g.appendChild(el('circle',{cx:cx-34,cy:cy+52,r:2.5,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.65',...C}));}
  g.appendChild(el('circle',{cx:cx+ux+5,cy:cy+uy+4,r:3,fill:'#c8a040',opacity:'0.22',...C}));
  g.appendChild(el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#061412','stroke-width':'5',...C}));
  g.appendChild(el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#208868','stroke-width':'1.5',...C}));
  var ap=el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#50C090','stroke-width':'1.2','stroke-opacity':'0.2'});
  anim6(g,ap,'0.2;0.65;0.2','2.5s');
  g.appendChild(dots6(cx,cy,'#50C090','url(#wk-glow-cat-ospedaliera)'));
  var lb=el('g',{'class':'wk-tile-label',filter:'url(#wk-dark-halo)'});
  drawCatIcon(lb,'ospedaliera',cx,cy-20,Math.round(R*0.28),'#50C090');
  lb.appendChild(txt('OSPEDALE',{x:cx,y:cy+12,'text-anchor':'middle','dominant-baseline':'middle','font-size':Math.round(R*0.13),'font-weight':'bold','letter-spacing':'2',fill:'#50C090','font-family':'monospace'}));
  lb.appendChild(txt('ALA '+tile.nome.split(' ').pop().toUpperCase(),{x:cx,y:cy+28,'text-anchor':'middle','dominant-baseline':'middle','font-size':Math.round(R*0.11),'font-weight':'bold','letter-spacing':'4',fill:'#208868','font-family':'monospace'}));
  g.appendChild(lb);return g;
}

// ── drawStazione ──────────────────────────────────────────────────────────────
function drawStazione(tile,cx,cy){
  var trk={'Stazione Nord':['bot','lr'],'Stazione Nord-Ovest':['top','bot'],'Stazione Ovest':['top','ur'],
    'Stazione Est':['bot','ll'],'Stazione Sud-Est':['top','bot'],'Stazione Sud':['top','ul']};
  var [t1,t2]=trk[tile.nome]||['top','bot'];
  var g=el('g',{'class':'tile tile-stazione'});
  var cid='wk-cp-stz-'+tile.nome.replace(/ /g,'-').toLowerCase();addCP(cid,cx,cy);var C={'clip-path':'url(#'+cid+')'};
  var em={top:[cx,cy-H],ur:[cx+67.5,cy-H/2],lr:[cx+67.5,cy+H/2],bot:[cx,cy+H],ll:[cx-67.5,cy+H/2],ul:[cx-67.5,cy-H/2]};
  var [e1x,e1y]=em[t1],[e2x,e2y]=em[t2],dx=e2x-e1x,dy=e2y-e1y;
  var tLen=Math.sqrt(dx*dx+dy*dy),ux2=dx/tLen,uy2=dy/tLen;
  var mX=(e1x+e2x)/2,mY=(e1y+e2y)/2;
  var dot=(-uy2)*(cx-mX)+ux2*(cy-mY),bpx=dot>=0?-uy2:uy2,bpy=dot>=0?ux2:-ux2;
  g.appendChild(el('rect',{x:cx-R-2,y:cy-H-2,width:(R+2)*2,height:(H+2)*2,fill:'#0c0a06',...C}));
  [{ox:-50,oy:-30,w:42,h:28},{ox:14,oy:-22,w:48,h:32},{ox:-26,oy:20,w:52,h:28},{ox:36,oy:14,w:28,h:38},{ox:-60,oy:6,w:22,h:22}]
    .forEach(p=>g.appendChild(el('rect',{x:cx+p.ox,y:cy+p.oy,width:p.w,height:p.h,fill:'#100e0a',opacity:'0.85',...C})));
  [{ox:-28,oy:42,rx:20,ry:11,op:0.26},{ox:42,oy:-30,rx:14,ry:8,op:0.20},{ox:-56,oy:14,rx:10,ry:6,op:0.18}]
    .forEach(s=>g.appendChild(el('ellipse',{cx:cx+s.ox,cy:cy+s.oy,rx:s.rx,ry:s.ry,fill:'rgba(60,40,10,0.8)',opacity:s.op,...C})));
  [{ox:-68,oy:-10,rx:9,ry:5},{ox:64,oy:-24,rx:8,ry:5},{ox:-42,oy:60,rx:9,ry:5},{ox:50,oy:56,rx:7,ry:4},{ox:-28,oy:-62,rx:8,ry:4}]
    .forEach(v=>g.appendChild(el('ellipse',{cx:cx+v.ox,cy:cy+v.oy,rx:v.rx,ry:v.ry,fill:'#14100a',opacity:'0.88',...C})));
  if(tile.nome==='Stazione Nord-Ovest'||tile.nome==='Stazione Sud-Est')
    ['ur','lr','ll','ul'].forEach(k=>{var[ex,ey]=em[k];
      g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#0e1012','stroke-width':11,...C}));
      g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#16191e','stroke-width':7,...C}));
      g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#20252a','stroke-width':1,'stroke-dasharray':'7,8',opacity:'0.55',...C}));});
  g.appendChild(el('line',{x1:e1x,y1:e1y,x2:e2x,y2:e2y,stroke:'#161008','stroke-width':24,...C}));
  g.appendChild(el('line',{x1:e1x,y1:e1y,x2:e2x,y2:e2y,stroke:'#1e1608','stroke-width':16,...C}));
  var sHL=tLen*0.30,sOff=16;
  var spx=-bpx,spy=-bpy;
  var s1x=mX+ux2*(-sHL)+spx*sOff,s1y=mY+uy2*(-sHL)+spy*sOff;
  var s2x=mX+ux2*(sHL)+spx*sOff,s2y=mY+uy2*(sHL)+spy*sOff;
  g.appendChild(el('line',{x1:s1x,y1:s1y,x2:s2x,y2:s2y,stroke:'#141008','stroke-width':14,...C}));
  for(var si=0;si<=7;si++){var st=si/7;var stx2=s1x+(s2x-s1x)*st,sty2=s1y+(s2y-s1y)*st;
    g.appendChild(el('line',{x1:(stx2-uy2*7).toFixed(1),y1:(sty2+ux2*7).toFixed(1),x2:(stx2+uy2*7).toFixed(1),y2:(sty2-ux2*7).toFixed(1),stroke:'#2a1c0c','stroke-width':'3',...C}));}
  [-3.5,3.5].forEach(off=>{
    g.appendChild(el('line',{x1:(s1x-uy2*off).toFixed(1),y1:(s1y+ux2*off).toFixed(1),x2:(s2x-uy2*off).toFixed(1),y2:(s2y+ux2*off).toFixed(1),stroke:'#5a5040','stroke-width':'2',...C}));});
  g.appendChild(el('line',{x1:(s1x-uy2*9).toFixed(1),y1:(s1y+ux2*9).toFixed(1),x2:(s1x+uy2*9).toFixed(1),y2:(s1y-ux2*9).toFixed(1),stroke:'#6a5030','stroke-width':'3',...C}));
  for(var ti=0;ti<=16;ti++){var tt=ti/16;var ttx=e1x+dx*tt,tty=e1y+dy*tt;
    g.appendChild(el('line',{x1:(ttx-uy2*12).toFixed(1),y1:(tty+ux2*12).toFixed(1),x2:(ttx+uy2*12).toFixed(1),y2:(tty-ux2*12).toFixed(1),stroke:'#2e1e0c','stroke-width':'4',...C}));}
  [-4.5,4.5].forEach(off=>{
    g.appendChild(el('line',{x1:(e1x-uy2*off).toFixed(1),y1:(e1y+ux2*off).toFixed(1),x2:(e2x-uy2*off).toFixed(1),y2:(e2y+ux2*off).toFixed(1),stroke:'#726050','stroke-width':'2.8',...C}));
    g.appendChild(el('line',{x1:(e1x-uy2*off).toFixed(1),y1:(e1y+ux2*off).toFixed(1),x2:(e2x-uy2*off).toFixed(1),y2:(e2y+ux2*off).toFixed(1),stroke:'#928060','stroke-width':'0.8',opacity:'0.35',...C}));});
  var pL=tLen*0.36,pIn=8,pOut=22;
  var pp=[(mX+ux2*(-pL)+bpx*pIn).toFixed(1)+','+(mY+uy2*(-pL)+bpy*pIn).toFixed(1),
    (mX+ux2*(pL)+bpx*pIn).toFixed(1)+','+(mY+uy2*(pL)+bpy*pIn).toFixed(1),
    (mX+ux2*(pL)+bpx*pOut).toFixed(1)+','+(mY+uy2*(pL)+bpy*pOut).toFixed(1),
    (mX+ux2*(-pL)+bpx*pOut).toFixed(1)+','+(mY+uy2*(-pL)+bpy*pOut).toFixed(1)].join(' ');
  g.appendChild(el('polygon',{points:pp,fill:'#1c1808',stroke:'#342a10','stroke-width':'1',...C}));
  g.appendChild(el('line',{x1:(mX+ux2*(-pL)+bpx*pIn).toFixed(1),y1:(mY+uy2*(-pL)+bpy*pIn).toFixed(1),x2:(mX+ux2*(pL)+bpx*pIn).toFixed(1),y2:(mY+uy2*(pL)+bpy*pIn).toFixed(1),stroke:'#A07820','stroke-width':'1.8',opacity:'0.65',...C}));
  var bIn=pOut+2,bOut=pOut+16,bLen=pL*0.90;
  var bpp=[(mX+ux2*(-bLen)+bpx*bIn+2).toFixed(1)+','+(mY+uy2*(-bLen)+bpy*bIn+2).toFixed(1),
    (mX+ux2*(bLen)+bpx*bIn+2).toFixed(1)+','+(mY+uy2*(bLen)+bpy*bIn+2).toFixed(1),
    (mX+ux2*(bLen)+bpx*bOut+2).toFixed(1)+','+(mY+uy2*(bLen)+bpy*bOut+2).toFixed(1),
    (mX+ux2*(-bLen)+bpx*bOut+2).toFixed(1)+','+(mY+uy2*(-bLen)+bpy*bOut+2).toFixed(1)].join(' ');
  g.appendChild(el('polygon',{points:bpp,fill:'#000',opacity:'0.40',...C}));
  var bpp2=[(mX+ux2*(-bLen)+bpx*bIn).toFixed(1)+','+(mY+uy2*(-bLen)+bpy*bIn).toFixed(1),
    (mX+ux2*(bLen)+bpx*bIn).toFixed(1)+','+(mY+uy2*(bLen)+bpy*bIn).toFixed(1),
    (mX+ux2*(bLen)+bpx*bOut).toFixed(1)+','+(mY+uy2*(bLen)+bpy*bOut).toFixed(1),
    (mX+ux2*(-bLen)+bpx*bOut).toFixed(1)+','+(mY+uy2*(-bLen)+bpy*bOut).toFixed(1)].join(' ');
  g.appendChild(el('polygon',{points:bpp2,fill:'#181208',stroke:'#2c2008','stroke-width':'1.8',...C}));
  for(var bi=0;bi<5;bi++){var btt=(bi+0.5)/5,bwt=-bLen+2*bLen*btt,bwo=bIn+5;
    g.appendChild(el('rect',{x:(mX+ux2*bwt+bpx*bwo-2.5).toFixed(1),y:(mY+uy2*bwt+bpy*bwo-2).toFixed(1),width:5,height:4,fill:'#c8a040',opacity:'0.20',...C}));}
  g.appendChild(el('line',{x1:(mX+ux2*(-pL*0.90)+bpx*(pIn-1.5)).toFixed(1),y1:(mY+uy2*(-pL*0.90)+bpy*(pIn-1.5)).toFixed(1),x2:(mX+ux2*(pL*0.90)+bpx*(pIn-1.5)).toFixed(1),y2:(mY+uy2*(pL*0.90)+bpy*(pIn-1.5)).toFixed(1),stroke:'#A07820','stroke-width':'1.2',opacity:'0.50',...C}));
  var wL=18,wW=6.5,wCX2=mX-ux2*14,wCY2=mY-uy2*14;
  g.appendChild(el('polygon',{points:`${(wCX2+ux2*wL-uy2*wW).toFixed(1)},${(wCY2+uy2*wL+ux2*wW).toFixed(1)} ${(wCX2+ux2*wL+uy2*wW).toFixed(1)},${(wCY2+uy2*wL-ux2*wW).toFixed(1)} ${(wCX2-ux2*wL+uy2*wW).toFixed(1)},${(wCY2-uy2*wL-ux2*wW).toFixed(1)} ${(wCX2-ux2*wL-uy2*wW).toFixed(1)},${(wCY2-uy2*wL+ux2*wW).toFixed(1)}`,fill:'#201608',stroke:'#3a2808','stroke-width':'1.5',...C}));
  g.appendChild(el('line',{x1:(wCX2+ux2*(wL-2)).toFixed(1),y1:(wCY2+uy2*(wL-2)).toFixed(1),x2:(wCX2-ux2*(wL-2)).toFixed(1),y2:(wCY2-uy2*(wL-2)).toFixed(1),stroke:'#504030','stroke-width':'2.5',opacity:'0.65',...C}));
  var sigX=(mX+bpx*18+ux2*(pL*0.68)).toFixed(1),sigY=(mY+bpy*18+uy2*(pL*0.68)).toFixed(1);
  g.appendChild(el('line',{x1:sigX,y1:sigY,x2:sigX,y2:(parseFloat(sigY)+10),stroke:'#7a6048','stroke-width':'1.5',...C}));
  g.appendChild(el('circle',{cx:sigX,cy:sigY,r:4,fill:'#201008',stroke:'#A07820','stroke-width':'1.2',...C}));
  g.appendChild(el('circle',{cx:sigX,cy:sigY,r:1.8,fill:'#c8a040',opacity:'0.24',...C}));
  g.appendChild(el('circle',{cx:cx-52,cy:cy+30,r:3,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.70',...C}));
  g.appendChild(el('circle',{cx:cx+50,cy:cy-28,r:2,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.55',...C}));
  g.appendChild(el('circle',{cx:cx+30,cy:cy+48,r:3,fill:'#c8a040',opacity:'0.22',...C}));
  g.appendChild(el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#1a1004','stroke-width':'5',...C}));
  g.appendChild(el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#A07820','stroke-width':'1.5',...C}));
  var ap=el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#D0A840','stroke-width':'1','stroke-opacity':'0.2'});
  anim6(g,ap,'0.2;0.60;0.2','2.8s');
  g.appendChild(dots6(cx,cy,'#D0A840','url(#wk-glow-cat-stazione)'));
  var lb=el('g',{'class':'wk-tile-label',filter:'url(#wk-dark-halo)'});
  drawCatIcon(lb,'stazione',cx,cy-18,Math.round(R*0.28),'#D0A840');
  lb.appendChild(txt('STAZIONE',{x:cx,y:cy+12,'text-anchor':'middle','dominant-baseline':'middle','font-size':Math.round(R*0.13),'font-weight':'bold','letter-spacing':'2',fill:'#D0A840','font-family':'monospace'}));
  lb.appendChild(txt(tile.nome.replace('Stazione ','').toUpperCase(),{x:cx,y:cy+28,'text-anchor':'middle','dominant-baseline':'middle','font-size':Math.round(R*0.11),'font-weight':'bold','letter-spacing':'4',fill:'#A07820','font-family':'monospace'}));
  g.appendChild(lb);return g;
}

// ── drawMilitare ──────────────────────────────────────────────────────────────
function drawMilitare(tile,cx,cy){
  var isA=tile.nome==='Armeria';
  var g=el('g',{'class':'tile tile-militare'});
  var cid='wk-cp-mil-'+tile.nome.toLowerCase();addCP(cid,cx,cy);var C={'clip-path':'url(#'+cid+')'};
  g.appendChild(el('rect',{x:cx-R-2,y:cy-H-2,width:(R+2)*2,height:(H+2)*2,fill:'#0b0d08',...C}));
  [{ox:-52,oy:-32,w:42,h:30},{ox:14,oy:-24,w:48,h:34},{ox:-26,oy:22,w:54,h:30},{ox:36,oy:14,w:30,h:42},{ox:-60,oy:6,w:24,h:24}]
    .forEach(p=>g.appendChild(el('rect',{x:cx+p.ox,y:cy+p.oy,width:p.w,height:p.h,fill:'#0f120a',opacity:'0.85',...C})));
  [{ox:-28,oy:44,rx:20,ry:11,op:0.32},{ox:42,oy:-30,rx:16,ry:9,op:0.25},{ox:-54,oy:-18,rx:13,ry:7,op:0.22}]
    .forEach(s=>g.appendChild(el('ellipse',{cx:cx+s.ox,cy:cy+s.oy,rx:s.rx,ry:s.ry,fill:'rgba(16,14,6,0.95)',opacity:s.op,...C})));
  [{ox:-68,oy:-10,rx:9,ry:5},{ox:64,oy:-25,rx:8,ry:5},{ox:-42,oy:60,rx:9,ry:5},{ox:50,oy:57,rx:7,ry:4},{ox:-28,oy:-63,rx:8,ry:4},{ox:30,oy:-60,rx:7,ry:4}]
    .forEach(v=>g.appendChild(el('ellipse',{cx:cx+v.ox,cy:cy+v.oy,rx:v.rx,ry:v.ry,fill:'#141208',opacity:'0.88',...C})));
  var em={top:[cx,cy-H],ur:[cx+67.5,cy-H/2],lr:[cx+67.5,cy+H/2],bot:[cx,cy+H],ll:[cx-67.5,cy+H/2],ul:[cx-67.5,cy-H/2]};
  Object.values(em).forEach(([ex,ey])=>{
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#0e1009','stroke-width':20,...C}));
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#1c2210','stroke-width':13,...C}));
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#2a3418','stroke-width':1.5,'stroke-dasharray':'10,8',...C}));});
  g.appendChild(el('polygon',{points:hexPtsS(cx,cy,0.84),fill:'none',stroke:'#3a3810','stroke-width':'1.8','stroke-dasharray':'5,4',opacity:'0.75',...C}));
  var star=(scx,scy,r)=>{var pts=[];for(var i=0;i<5;i++){var ao=(i*72-90)*Math.PI/180,ai=(i*72-90+36)*Math.PI/180;pts.push(`${(scx+Math.cos(ao)*r).toFixed(1)},${(scy+Math.sin(ao)*r).toFixed(1)}`);pts.push(`${(scx+Math.cos(ai)*r*0.40).toFixed(1)},${(scy+Math.sin(ai)*r*0.40).toFixed(1)}`);}return pts.join(' ');};
  if(isA){
    g.appendChild(el('rect',{x:cx-33+3,y:cy-23+3,width:66,height:46,fill:'#000',opacity:'0.40',...C}));
    g.appendChild(el('rect',{x:cx-33,y:cy-23,width:66,height:46,fill:'#121608',stroke:'#262e0e','stroke-width':'2.5',...C}));
    g.appendChild(el('rect',{x:cx-28,y:cy-18,width:56,height:36,fill:'#161c0a',stroke:'#1e260c','stroke-width':'1',...C}));
    for(var i=-2;i<=2;i++)g.appendChild(el('line',{x1:cx+i*10,y1:cy-22,x2:cx+i*10,y2:cy+22,stroke:'#1e2810','stroke-width':'0.9',opacity:'0.8',...C}));
    g.appendChild(el('polygon',{points:star(cx,cy,8),fill:'#786808',opacity:'0.65',...C}));
    [{ox:-54,oy:-30,w:22,h:18},{ox:36,oy:20,w:22,h:18}].forEach(b=>{
      g.appendChild(el('rect',{x:cx+b.ox+2,y:cy+b.oy+2,width:b.w,height:b.h,fill:'#000',opacity:'0.32',...C}));
      g.appendChild(el('rect',{x:cx+b.ox,y:cy+b.oy,width:b.w,height:b.h,fill:'#151908',stroke:'#24300e','stroke-width':'1.5',...C}));});
    g.appendChild(el('rect',{x:cx+33,y:cy-9,width:14,height:18,fill:'#0f1208',stroke:'#222c0e','stroke-width':'1',...C}));
    [-4,0,4].forEach(dy=>g.appendChild(el('line',{x1:cx+33,y1:cy+dy,x2:cx+47,y2:cy+dy,stroke:'#786808','stroke-width':'0.8',opacity:'0.5',...C})));
    [{ox:-33,oy:-23},{ox:33,oy:-23},{ox:-33,oy:23}].forEach(t=>g.appendChild(el('circle',{cx:cx+t.ox,cy:cy+t.oy,r:6,fill:'#1e2410',stroke:'#786808','stroke-width':'1.8',...C})));
    [{ox:-58,oy:34,w:15,h:9},{ox:-58,oy:47,w:15,h:9}].forEach(v=>{
      g.appendChild(el('rect',{x:cx+v.ox,y:cy+v.oy,width:v.w,height:v.h,fill:'#1a1e0c',stroke:'#30380e','stroke-width':'1',...C}));
      g.appendChild(el('rect',{x:cx+v.ox+1,y:cy+v.oy+1,width:5,height:4,fill:'#c8a040',opacity:'0.10',...C}));});
  }else{
    g.appendChild(el('rect',{x:cx-38,y:cy-22,width:68,height:42,fill:'#0e1208',opacity:'0.75',...C}));
    for(var ii=-3;ii<=3;ii++)g.appendChild(el('line',{x1:cx+ii*10,y1:cy-20,x2:cx+ii*10,y2:cy+18,stroke:'#1e2810','stroke-width':'1',opacity:'0.55',...C}));
    [{oy:-36},{oy:-8},{oy:20}].forEach(b=>{
      g.appendChild(el('rect',{x:cx-40+2,y:cy+b.oy+2,width:68,height:19,fill:'#000',opacity:'0.32',...C}));
      g.appendChild(el('rect',{x:cx-40,y:cy+b.oy,width:68,height:19,fill:'#161c0a',stroke:'#222c0e','stroke-width':'1.5',...C}));
      [-14,-2,10,22].forEach(dx=>g.appendChild(el('rect',{x:cx+dx,y:cy+b.oy+6,width:5,height:5,fill:'#c8a040',opacity:'0.10',...C})));});
    g.appendChild(el('rect',{x:cx+34+2,y:cy-28+2,width:28,height:34,fill:'#000',opacity:'0.38',...C}));
    g.appendChild(el('rect',{x:cx+34,y:cy-28,width:28,height:34,fill:'#1c2210',stroke:'#2a3012','stroke-width':'2',...C}));
    g.appendChild(el('polygon',{points:star(cx+48,cy-11,7),fill:'#786808',opacity:'0.70',...C}));
    [{ox:-44,oy:-54},{ox:-24,oy:-54}].forEach(t=>g.appendChild(el('circle',{cx:cx+t.ox,cy:cy+t.oy,r:5,fill:'#1e2410',stroke:'#786808','stroke-width':'1.8',...C})));
    g.appendChild(el('line',{x1:cx-44,y1:cy-54,x2:cx-16,y2:cy-54,stroke:'#786808','stroke-width':'2',opacity:'0.6',...C}));
    [{ox:-60,oy:46},{ox:-40,oy:46},{ox:-20,oy:46}].forEach(v=>{
      g.appendChild(el('rect',{x:cx+v.ox,y:cy+v.oy,width:16,height:9,fill:'#1a1e0c',stroke:'#30380e','stroke-width':'1',...C}));
      g.appendChild(el('rect',{x:cx+v.ox+1,y:cy+v.oy+1,width:5,height:4,fill:'#c8a040',opacity:'0.10',...C}));});
    g.appendChild(el('line',{x1:cx-52,y1:cy-46,x2:cx-52,y2:cy+44,stroke:'#786808','stroke-width':'1.2',opacity:'0.45',...C}));
    g.appendChild(el('rect',{x:cx-52,y:cy-46,width:14,height:8,fill:'#786808',opacity:'0.40',...C}));
  }
  g.appendChild(el('circle',{cx:cx-50,cy:cy+36,r:3.5,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.75',...C}));
  g.appendChild(el('circle',{cx:cx+48,cy:cy-36,r:2.5,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.60',...C}));
  g.appendChild(el('circle',{cx:cx+52,cy:cy+18,r:3,fill:'#c8a040',opacity:'0.22',...C}));
  g.appendChild(el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#0e1006','stroke-width':'5',...C}));
  g.appendChild(el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#786808','stroke-width':'1.5',...C}));
  var ap=el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#C0A020','stroke-width':'1','stroke-opacity':'0.2'});
  anim6(g,ap,'0.2;0.55;0.2','3.2s');
  g.appendChild(dots6(cx,cy,'#C0A020','url(#wk-glow-cat-militare)'));
  var lb=el('g',{'class':'wk-tile-label',filter:'url(#wk-dark-halo)'});
  drawCatIcon(lb,'militare',cx,cy-20,Math.round(R*0.28),'#C0A020');
  lb.appendChild(txt(tile.nome.toUpperCase(),{x:cx,y:cy+14,'text-anchor':'middle','dominant-baseline':'middle','font-size':Math.round(R*0.13),'font-weight':'bold','letter-spacing':'3',fill:'#C0A020','font-family':'monospace'}));
  g.appendChild(lb);return g;
}

// ── drawRiciclaggio ───────────────────────────────────────────────────────────
function drawRiciclaggio(tile,cx,cy){
  var nome=tile.nome;
  var g=el('g',{'class':'tile tile-riciclaggio'});
  var cid='wk-cp-rec-'+nome.replace(/ /g,'-').toLowerCase();addCP(cid,cx,cy);var C={'clip-path':'url(#'+cid+')'};
  g.appendChild(el('rect',{x:cx-R-2,y:cy-H-2,width:(R+2)*2,height:(H+2)*2,fill:'#0c0a06',...C}));
  [{ox:-48,oy:-28,w:40,h:30},{ox:12,oy:-20,w:46,h:34},{ox:-24,oy:18,w:50,h:28},{ox:34,oy:12,w:30,h:38},{ox:-58,oy:4,w:20,h:24}]
    .forEach(p=>g.appendChild(el('rect',{x:cx+p.ox,y:cy+p.oy,width:p.w,height:p.h,fill:'#110e08',opacity:'0.82',...C})));
  var em={top:[cx,cy-H],ur:[cx+67.5,cy-H/2],lr:[cx+67.5,cy+H/2],bot:[cx,cy+H],ll:[cx-67.5,cy+H/2],ul:[cx-67.5,cy-H/2]};
  Object.values(em).forEach(([ex,ey])=>{
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#0e0a06','stroke-width':20,...C}));
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#1a1408','stroke-width':13,...C}));
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#28201a','stroke-width':1.5,'stroke-dasharray':'10,8',...C}));});
  if(nome==='Discarica'){
    g.appendChild(el('ellipse',{cx:(cx-16).toFixed(1),cy:(cy-14).toFixed(1),rx:28,ry:18,fill:'rgba(16,36,8,0.88)',stroke:'#1a3010','stroke-width':'1',opacity:'0.82',...C}));
    g.appendChild(el('ellipse',{cx:(cx-16).toFixed(1),cy:(cy-14).toFixed(1),rx:20,ry:12,fill:'rgba(24,50,12,0.55)',opacity:'0.55',...C}));
    [{bx:cx-30,by:cy-28,its:[{rx:20,ry:13,c:'#1e1808'},{rx:15,ry:9,ox:10,oy:-6,c:'#251c0a'},{rx:12,ry:7,ox:-8,oy:5,c:'#1a1406'}]},
     {bx:cx+26,by:cy+22,its:[{rx:22,ry:12,c:'#201a0a'},{rx:16,ry:8,ox:-9,oy:4,c:'#1e1808'}]},
     {bx:cx-6, by:cy+44,its:[{rx:18,ry:10,c:'#1c1606'},{rx:14,ry:7,ox:9,oy:-5,c:'#231a08'}]}]
      .forEach(pile=>pile.its.forEach(it=>g.appendChild(el('ellipse',{cx:(pile.bx+(it.ox||0)).toFixed(1),cy:(pile.by+(it.oy||0)).toFixed(1),rx:it.rx,ry:it.ry,fill:it.c,stroke:'#2e2010','stroke-width':'0.8',opacity:'0.92',...C}))));
    [{ox:42,oy:-28},{ox:-46,oy:28}].forEach(t=>{var tx=cx+t.ox,ty=cy+t.oy;
      g.appendChild(el('circle',{cx:tx,cy:ty,r:6,fill:'#1c1408',stroke:'#782808','stroke-width':'1.5',...C}));
      g.appendChild(el('line',{x1:tx-4,y1:ty-4,x2:tx+4,y2:ty+4,stroke:'#782808','stroke-width':'1.2',...C}));
      g.appendChild(el('line',{x1:tx+4,y1:ty-4,x2:tx-4,y2:ty+4,stroke:'#782808','stroke-width':'1.2',...C}));});
    for(var dri=0;dri<3;dri++){var dty=cy+28+dri*8;
      g.appendChild(el('line',{x1:cx+10,y1:dty,x2:cx+52,y2:dty,stroke:'#211808','stroke-width':'3.5',opacity:'0.65',...C}));}
    g.appendChild(el('circle',{cx:cx+42,cy:cy-22,r:4,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.82',...C}));
    g.appendChild(el('circle',{cx:cx-8,cy:cy+50,r:3,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.60',...C}));
  }else if(nome==='Mercato'){
    g.appendChild(el('rect',{x:(cx-24).toFixed(1),y:(cy-24).toFixed(1),width:48,height:48,fill:'#141008',opacity:'0.72',...C}));
    g.appendChild(el('line',{x1:(cx-24).toFixed(1),y1:cy,x2:(cx+24).toFixed(1),y2:cy,stroke:'#201808','stroke-width':'4',opacity:'0.45',...C}));
    g.appendChild(el('line',{x1:cx,y1:(cy-24).toFixed(1),x2:cx,y2:(cy+24).toFixed(1),stroke:'#201808','stroke-width':'4',opacity:'0.45',...C}));
    var tC=['#5a1e08','#3a1408','#482010','#501808','#401c06','#5a2010','#421806','#4a1c0a'];
    [{ox:-46,oy:-18,w:18,h:12},{ox:-46,oy:6,w:18,h:12},{ox:28,oy:-18,w:18,h:12},{ox:28,oy:6,w:18,h:12},
     {ox:-18,oy:-46,w:12,h:16},{ox:6,oy:-46,w:12,h:16},{ox:-18,oy:30,w:12,h:16},{ox:6,oy:30,w:12,h:16}]
      .forEach((s,i)=>{g.appendChild(el('rect',{x:(cx+s.ox).toFixed(1),y:(cy+s.oy).toFixed(1),width:s.w,height:s.h,fill:'#181208',stroke:'#302010','stroke-width':'1.2',...C}));
        g.appendChild(el('line',{x1:(cx+s.ox).toFixed(1),y1:(cy+s.oy).toFixed(1),x2:(cx+s.ox+s.w).toFixed(1),y2:(cy+s.oy).toFixed(1),stroke:tC[i],'stroke-width':'2.5',opacity:'0.65',...C}));});
    g.appendChild(el('circle',{cx:cx,cy:cy,r:4,fill:'#FF5010',filter:'url(#wk-glow-fire)',opacity:'0.68',...C}));
    g.appendChild(el('circle',{cx:(cx-50).toFixed(1),cy:(cy+34).toFixed(1),r:2.5,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.48',...C}));
  }else if(nome==='Area Magazzini'){
    [{oy:-30},{oy:6}].forEach(b=>{
      g.appendChild(el('rect',{x:(cx-40+2).toFixed(1),y:(cy+b.oy+2).toFixed(1),width:80,height:22,fill:'#000',opacity:'0.30',...C}));
      g.appendChild(el('rect',{x:(cx-40).toFixed(1),y:(cy+b.oy).toFixed(1),width:80,height:22,fill:'#181208',stroke:'#2c1e0c','stroke-width':'1.5',...C}));
      for(var mi=-3;mi<=3;mi++)g.appendChild(el('line',{x1:(cx+mi*12).toFixed(1),y1:(cy+b.oy).toFixed(1),x2:(cx+mi*12).toFixed(1),y2:(cy+b.oy+22).toFixed(1),stroke:'#221808','stroke-width':'0.9',opacity:'0.72',...C}));
      g.appendChild(el('rect',{x:(cx+40).toFixed(1),y:(cy+b.oy+5).toFixed(1),width:14,height:12,fill:'#0e0c06',stroke:'#1e1808','stroke-width':'1',...C}));});
    g.appendChild(el('rect',{x:(cx-58).toFixed(1),y:(cy-34).toFixed(1),width:20,height:66,fill:'#161008',stroke:'#2a1e0c','stroke-width':'1.5',...C}));
    for(var mj=0;mj<5;mj++)g.appendChild(el('rect',{x:(cx-30+mj*15).toFixed(1),y:(cy-52).toFixed(1),width:13,height:9,fill:'#1e1208',stroke:'#30200e','stroke-width':'1',...C}));
    for(var mk=0;mk<4;mk++)g.appendChild(el('rect',{x:(cx-24+mk*16).toFixed(1),y:(cy+36).toFixed(1),width:14,height:9,fill:'#221408',stroke:'#382010','stroke-width':'1',...C}));
    g.appendChild(el('circle',{cx:(cx-50).toFixed(1),cy:(cy+44).toFixed(1),r:3,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.62',...C}));
  }else{
    [{ox:-42,oy:-26,rx:22,ry:12,op:0.32},{ox:36,oy:24,rx:20,ry:11,op:0.28},{ox:-6,oy:46,rx:18,ry:10,op:0.26},{ox:50,oy:-20,rx:14,ry:8,op:0.24}]
      .forEach(s=>g.appendChild(el('ellipse',{cx:(cx+s.ox).toFixed(1),cy:(cy+s.oy).toFixed(1),rx:s.rx,ry:s.ry,fill:'rgba(70,20,6,0.8)',opacity:s.op,...C})));
    [-9,9].forEach(off=>g.appendChild(el('line',{x1:(cx-72).toFixed(1),y1:(cy+off).toFixed(1),x2:(cx+72).toFixed(1),y2:(cy+off).toFixed(1),stroke:'#5a4030','stroke-width':'2.5',...C})));
    g.appendChild(el('rect',{x:(cx+28).toFixed(1),y:(cy-18).toFixed(1),width:26,height:30,fill:'#201808',stroke:'#4a2810','stroke-width':'1.5',...C}));
    [{bx:cx-40,by:cy-42,pcs:[{w:22,h:12},{w:18,h:9,oy:-11},{w:14,h:7,ox:4,oy:-19}]},
     {bx:cx+38,by:cy-32,pcs:[{w:20,h:12},{w:16,h:8,oy:-10}]},
     {bx:cx-36,by:cy+30,pcs:[{w:24,h:13},{w:18,h:8,ox:3,oy:-11}]},
     {bx:cx+40,by:cy+36,pcs:[{w:20,h:12},{w:16,h:8,ox:-2,oy:-10}]}]
      .forEach(pile=>pile.pcs.forEach((pc,i)=>g.appendChild(el('rect',{x:(pile.bx+(pc.ox||0)-pc.w/2).toFixed(1),y:(pile.by+(pc.oy||0)).toFixed(1),width:pc.w,height:pc.h,fill:['#201808','#281e0a','#1c1406'][i%3],stroke:'#382810','stroke-width':'1',opacity:'0.92',...C}))));
    g.appendChild(el('circle',{cx:(cx-52).toFixed(1),cy:(cy+42).toFixed(1),r:3.5,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.82',...C}));
    g.appendChild(el('circle',{cx:(cx+50).toFixed(1),cy:(cy-42).toFixed(1),r:2.5,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.64',...C}));
  }
  g.appendChild(el('circle',{cx:(cx-28).toFixed(1),cy:(cy-52).toFixed(1),r:2.5,fill:'#c8a040',opacity:'0.16',...C}));
  g.appendChild(el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#1a0c04','stroke-width':'5',...C}));
  g.appendChild(el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#782808','stroke-width':'1.5',...C}));
  var ap=el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#B06030','stroke-width':'1','stroke-opacity':'0.2'});
  anim6(g,ap,'0.2;0.56;0.2','3.4s');
  g.appendChild(dots6(cx,cy,'#B06030','url(#wk-glow-cat-riciclaggio)'));
  var lb=el('g',{'class':'wk-tile-label',filter:'url(#wk-dark-halo)'});
  drawCatIcon(lb,'riciclaggio',cx,cy-20,Math.round(R*0.28),'#B06030');
  var nl=wrapN(nome.toUpperCase(),12),fs=Math.round(R*0.12);
  nl.forEach((ln,i)=>lb.appendChild(txt(ln,{x:cx,y:cy+12+i*fs*1.4,'text-anchor':'middle','dominant-baseline':'middle','font-size':fs,'font-weight':'bold','letter-spacing':'2',fill:'#B06030','font-family':'monospace'})));
  g.appendChild(lb);return g;
}

// ── drawEstrazione ────────────────────────────────────────────────────────────
function drawEstrazione(tile,cx,cy){
  var isA=tile.nome.includes('Alpha');
  var g=el('g',{'class':'tile tile-estrazione'});
  var cid='wk-cp-ext-'+tile.nome.replace(/ /g,'-').toLowerCase();addCP(cid,cx,cy);var C={'clip-path':'url(#'+cid+')'};
  g.appendChild(el('rect',{x:cx-R-2,y:cy-H-2,width:(R+2)*2,height:(H+2)*2,fill:'#090c06',...C}));
  [{ox:-50,oy:-28,w:44,h:32},{ox:10,oy:-22,w:50,h:30},{ox:-28,oy:18,w:56,h:30},{ox:28,oy:10,w:36,h:42}]
    .forEach(p=>g.appendChild(el('rect',{x:cx+p.ox,y:cy+p.oy,width:p.w,height:p.h,fill:'#0e1208',opacity:'0.80',...C})));
  [{ox:isA?-56:56,oy:-18,rx:10,ry:5},{ox:isA?-50:50,oy:20,rx:9,ry:5},{ox:30,oy:-48,rx:10,ry:5},{ox:-30,oy:50,rx:12,ry:6}]
    .forEach(v=>g.appendChild(el('ellipse',{cx:(cx+v.ox).toFixed(1),cy:(cy+v.oy).toFixed(1),rx:v.rx,ry:v.ry,fill:'#1c2010',opacity:'0.72',...C})));
  var rEx=isA?[[cx+67.5,cy-H/2],[cx+67.5,cy+H/2]]:[[cx-67.5,cy-H/2],[cx-67.5,cy+H/2]];
  rEx.forEach(([ex,ey])=>{
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#0a0c06','stroke-width':20,...C}));
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#141c0c','stroke-width':13,...C}));
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#1e2e14','stroke-width':1.5,'stroke-dasharray':'10,8',...C}));});
  g.appendChild(el('rect',{x:(cx-23+2).toFixed(1),y:(cy-20+2).toFixed(1),width:46,height:40,fill:'#000',opacity:'0.58',...C}));
  g.appendChild(el('rect',{x:(cx-23).toFixed(1),y:(cy-20).toFixed(1),width:46,height:40,fill:'#050604',stroke:'#141e0c','stroke-width':'1.8',...C}));
  [[cx-17,cy-14,cx-8,cy-6],[cx+17,cy-14,cx+8,cy-6],[cx-15,cy+16,cx-8,cy+8],[cx+15,cy+16,cx+8,cy+8]]
    .forEach(([x1,y1,x2,y2])=>g.appendChild(el('line',{x1,y1,x2,y2,stroke:'#0c1008','stroke-width':'1.2',opacity:'0.55',...C})));
  [[cx-23,cy-20,cx-23,cy-52],[cx+23,cy-20,cx+23,cy-52]].forEach(([x1,y1,x2,y2])=>g.appendChild(el('line',{x1,y1,x2,y2,stroke:'#2a3818','stroke-width':'2.5',...C})));
  g.appendChild(el('line',{x1:cx-28,y1:cy-52,x2:cx+28,y2:cy-52,stroke:'#2a3818','stroke-width':'2.5',...C}));
  [[cx-23,cy-32,cx-9,cy-52],[cx+23,cy-32,cx+9,cy-52]].forEach(([x1,y1,x2,y2])=>g.appendChild(el('line',{x1,y1,x2,y2,stroke:'#1e2c10','stroke-width':'1.5',opacity:'0.68',...C})));
  g.appendChild(el('circle',{cx:cx,cy:cy-52,r:5,fill:'#181e10',stroke:'#508030','stroke-width':'1.5',...C}));
  g.appendChild(el('line',{x1:cx,y1:cy-52,x2:cx,y2:cy-20,stroke:'#344820','stroke-width':'1.2',opacity:'0.62',...C}));
  var inX=isA?1:-1;
  [{ox:inX*44,oy:24,rx:16,ry:9,c:'#1c2410'},{ox:inX*42,oy:-36,rx:13,ry:7,c:'#182010'},{ox:inX*-30,oy:40,rx:11,ry:6,c:'#1a2210'}]
    .forEach(p=>{g.appendChild(el('ellipse',{cx:(cx+p.ox).toFixed(1),cy:(cy+p.oy).toFixed(1),rx:p.rx,ry:p.ry,fill:p.c,stroke:'#283818','stroke-width':'1',opacity:'0.88',...C}));
      g.appendChild(el('rect',{x:(cx+p.ox-p.rx*0.28).toFixed(1),y:(cy+p.oy-p.ry*0.6).toFixed(1),width:(p.rx*0.56).toFixed(1),height:(p.ry*0.55).toFixed(1),fill:'#222e14',opacity:'0.75',...C}));});
  g.appendChild(el('circle',{cx:(cx+inX*-52).toFixed(1),cy:(cy+32).toFixed(1),r:3,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.70',...C}));
  g.appendChild(el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#0a1006','stroke-width':'5',...C}));
  g.appendChild(el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#508030','stroke-width':'1.5',...C}));
  var ap=el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#80C040','stroke-width':'1','stroke-opacity':'0.2'});
  anim6(g,ap,'0.2;0.55;0.2','3.6s');
  g.appendChild(dots6(cx,cy,'#80C040','url(#wk-glow-cat-estrazione)'));
  var lb=el('g',{'class':'wk-tile-label',filter:'url(#wk-dark-halo)'});
  drawCatIcon(lb,'estrazione',cx,cy-20,Math.round(R*0.28),'#80C040');
  var nl2=wrapN(tile.nome.toUpperCase(),12),fs2=Math.round(R*0.12);
  nl2.forEach((ln,i)=>lb.appendChild(txt(ln,{x:cx,y:cy+12+i*fs2*1.4,'text-anchor':'middle','dominant-baseline':'middle','font-size':fs2,'font-weight':'bold','letter-spacing':'2',fill:'#80C040','font-family':'monospace'})));
  g.appendChild(lb);return g;
}

// ── drawAccampamento ──────────────────────────────────────────────────────────
function drawAccampamento(tile,cx,cy){
  var nome=tile.nome,isLeft=tile.col<4;
  var g=el('g',{'class':'tile tile-accampamento'});
  var cid='wk-cp-camp-'+nome.replace(/ /g,'-').toLowerCase();addCP(cid,cx,cy);var C={'clip-path':'url(#'+cid+')'};
  var addTent=(tx,ty,w,h)=>{
    g.appendChild(el('rect',{x:(tx-w/2).toFixed(1),y:(ty-h/2).toFixed(1),width:w,height:h,rx:2,fill:'#1a2410',stroke:'#2e4020','stroke-width':'1',...C}));
    g.appendChild(el('line',{x1:(tx-w/2).toFixed(1),y1:ty,x2:(tx+w/2).toFixed(1),y2:ty,stroke:'#3a5028','stroke-width':'0.8',opacity:'0.60',...C}));};
  g.appendChild(el('rect',{x:cx-R-2,y:cy-H-2,width:(R+2)*2,height:(H+2)*2,fill:'#080c06',...C}));
  [{ox:-48,oy:-30,w:44,h:32},{ox:10,oy:-22,w:48,h:30},{ox:-26,oy:18,w:54,h:28},{ox:28,oy:10,w:36,h:44}]
    .forEach(p=>g.appendChild(el('rect',{x:cx+p.ox,y:cy+p.oy,width:p.w,height:p.h,fill:'#0d1208',opacity:'0.80',...C})));
  [{ox:-56,oy:-22,rx:12,ry:7},{ox:50,oy:20,rx:10,ry:6},{ox:-40,oy:50,rx:12,ry:6},{ox:44,oy:-40,rx:11,ry:6}]
    .forEach(v=>g.appendChild(el('ellipse',{cx:(cx+v.ox).toFixed(1),cy:(cy+v.oy).toFixed(1),rx:v.rx,ry:v.ry,fill:'#1c2810',opacity:'0.76',...C})));
  var em={top:[cx,cy-H],ur:[cx+67.5,cy-H/2],lr:[cx+67.5,cy+H/2],bot:[cx,cy+H],ll:[cx-67.5,cy+H/2],ul:[cx-67.5,cy-H/2]};
  (isLeft?['bot','ur','lr']:['top','ul','ll']).forEach(k=>{var[ex,ey]=em[k];
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#090c06','stroke-width':20,...C}));
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#121a0c','stroke-width':13,...C}));
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#1e2e14','stroke-width':1.5,'stroke-dasharray':'10,8',...C}));});
  if(nome.includes('Strategico')){
    addTent(cx,cy-10,34,18);
    [[-36,-28],[36,-28],[-36,20],[36,20]].forEach(([ox,oy])=>addTent(cx+ox,cy+oy,18,10));
    g.appendChild(el('rect',{x:(cx-50).toFixed(1),y:(cy-40).toFixed(1),width:100,height:72,fill:'none',stroke:'#2a4018','stroke-width':'1.2','stroke-dasharray':'6,5',opacity:'0.58',...C}));
    var twx=isLeft?cx+44:cx-44;
    g.appendChild(el('rect',{x:(twx-7).toFixed(1),y:(cy-46).toFixed(1),width:14,height:14,fill:'#141e0c',stroke:'#4a7030','stroke-width':'1.5',...C}));
    var antx=isLeft?cx-30:cx+30;
    g.appendChild(el('line',{x1:antx,y1:cy-22,x2:antx,y2:cy-42,stroke:'#3a5028','stroke-width':'1.2',opacity:'0.52',...C}));
    g.appendChild(el('circle',{cx:cx,cy:cy+10,r:4,fill:'#FF5010',filter:'url(#wk-glow-fire)',opacity:'0.78',...C}));
  }else if(nome.includes('Boschi')){
    [{ox:-28,oy:-34,rx:22,ry:16},{ox:22,oy:-32,rx:20,ry:15},{ox:-48,oy:4,rx:18,ry:13},
     {ox:34,oy:8,rx:22,ry:16},{ox:-14,oy:30,rx:20,ry:14},{ox:40,oy:-14,rx:15,ry:11},{ox:-36,oy:46,rx:16,ry:11}]
      .forEach(tr=>g.appendChild(el('ellipse',{cx:(cx+tr.ox).toFixed(1),cy:(cy+tr.oy).toFixed(1),rx:tr.rx,ry:tr.ry,fill:'#1e2e10',stroke:'#263c14','stroke-width':'0.8',opacity:'0.88',...C})));
    addTent(cx-20,cy-16,14,9);addTent(cx+18,cy+12,14,9);addTent(cx-6,cy+32,12,8);
    g.appendChild(el('circle',{cx:cx,cy:cy,r:3,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.58',...C}));
  }else if(nome.includes('Popolare')){
    [[-34,-30],[-12,-30],[12,-30],[34,-30],[-36,6],[36,6],[-20,32],[20,32]]
      .forEach(([ox,oy])=>addTent(cx+ox,cy+oy,15,9));
    g.appendChild(el('ellipse',{cx:cx,cy:cy,rx:18,ry:14,fill:'#0d1208',opacity:'0.68',...C}));
    g.appendChild(el('circle',{cx:cx,cy:cy,r:4,fill:'#FF5010',filter:'url(#wk-glow-fire)',opacity:'0.80',...C}));
    g.appendChild(el('circle',{cx:isLeft?cx-44:cx+44,cy:cy+28,r:2.5,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.52',...C}));
  }else{
    var wallR=52,gapC=isLeft?0:180;
    for(var ca=0;ca<360;ca+=22){if(Math.abs(((ca-gapC+540)%360)-180)<28)continue;
      var rad=ca*Math.PI/180,wx2=cx+Math.cos(rad)*wallR,wy2=cy+Math.sin(rad)*wallR,pr=rad+Math.PI/2;
      var pts2=[[wx2+Math.cos(pr)*4.5+Math.cos(rad)*2.5,wy2+Math.sin(pr)*4.5+Math.sin(rad)*2.5],[wx2-Math.cos(pr)*4.5+Math.cos(rad)*2.5,wy2-Math.sin(pr)*4.5+Math.sin(rad)*2.5],[wx2-Math.cos(pr)*4.5-Math.cos(rad)*2.5,wy2-Math.sin(pr)*4.5-Math.sin(rad)*2.5],[wx2+Math.cos(pr)*4.5-Math.cos(rad)*2.5,wy2+Math.sin(pr)*4.5-Math.sin(rad)*2.5]].map(([px,py])=>`${px.toFixed(1)},${py.toFixed(1)}`).join(' ');
      g.appendChild(el('polygon',{points:pts2,fill:'#1a2410',stroke:'#2e4020','stroke-width':'0.9',...C}));}
    [[-24,-20],[20,-20],[-22,20],[20,20]].forEach(([ox,oy])=>addTent(cx+ox,cy+oy,16,10));
    var t1x=isLeft?cx+40:cx-40;
    [[t1x,cy-36],[t1x,cy+30]].forEach(([tx2,ty2])=>g.appendChild(el('rect',{x:(tx2-6).toFixed(1),y:(ty2-6).toFixed(1),width:12,height:12,fill:'#141e0c',stroke:'#507038','stroke-width':'1.5',...C})));
    g.appendChild(el('circle',{cx:cx,cy:cy,r:4,fill:'#FF5010',filter:'url(#wk-glow-fire)',opacity:'0.78',...C}));
  }
  g.appendChild(el('circle',{cx:(cx-28).toFixed(1),cy:(cy-52).toFixed(1),r:2,fill:'#c8a040',opacity:'0.14',...C}));
  g.appendChild(el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#0c1208','stroke-width':'5',...C}));
  g.appendChild(el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#60A040','stroke-width':'1.5',...C}));
  var ap=el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#A0E060','stroke-width':'1','stroke-opacity':'0.2'});
  anim6(g,ap,'0.2;0.55;0.2','3.8s');
  g.appendChild(dots6(cx,cy,'#A0E060','url(#wk-glow-cat-accampamento)'));
  var lb=el('g',{'class':'wk-tile-label',filter:'url(#wk-dark-halo)'});
  drawCatIcon(lb,'accampamento',cx,cy-20,Math.round(R*0.28),'#A0E060');
  var nl3=wrapN(tile.nome.toUpperCase(),12),fs3=Math.round(R*0.12);
  nl3.forEach((ln,i)=>lb.appendChild(txt(ln,{x:cx,y:cy+12+i*fs3*1.4,'text-anchor':'middle','dominant-baseline':'middle','font-size':fs3,'font-weight':'bold','letter-spacing':'2',fill:'#A0E060','font-family':'monospace'})));
  g.appendChild(lb);return g;
}

// ── drawAvamposto ─────────────────────────────────────────────────────────────
function drawAvamposto(tile,cx,cy){
  var nome=tile.nome,isTop=tile.v===0;
  var g=el('g',{'class':'tile tile-avamposto'});
  var cid='wk-cp-avo-'+nome.replace(/ /g,'-').toLowerCase();addCP(cid,cx,cy);var C={'clip-path':'url(#'+cid+')'};
  g.appendChild(el('rect',{x:cx-R-2,y:cy-H-2,width:(R+2)*2,height:(H+2)*2,fill:'#080c06',...C}));
  [{ox:-50,oy:-30,w:46,h:32},{ox:10,oy:-24,w:48,h:30},{ox:-28,oy:18,w:54,h:28},{ox:30,oy:12,w:34,h:42}]
    .forEach(p=>g.appendChild(el('rect',{x:cx+p.ox,y:cy+p.oy,width:p.w,height:p.h,fill:'#0c1208',opacity:'0.80',...C})));
  [{ox:-54,oy:-20,rx:11,ry:6},{ox:50,oy:22,rx:10,ry:5},{ox:42,oy:-40,rx:10,ry:5},{ox:-40,oy:46,rx:11,ry:6}]
    .forEach(v=>g.appendChild(el('ellipse',{cx:(cx+v.ox).toFixed(1),cy:(cy+v.oy).toFixed(1),rx:v.rx,ry:v.ry,fill:'#1c2810',opacity:'0.74',...C})));
  var em={top:[cx,cy-H],ur:[cx+67.5,cy-H/2],lr:[cx+67.5,cy+H/2],bot:[cx,cy+H],ll:[cx-67.5,cy+H/2],ul:[cx-67.5,cy-H/2]};
  (isTop?['bot','ll','lr']:['top','ul','ur']).forEach(k=>{var[ex,ey]=em[k];
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#0a0c06','stroke-width':20,...C}));
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#141c0c','stroke-width':13,...C}));
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#1e2e14','stroke-width':1.5,'stroke-dasharray':'10,8',...C}));});
  if(isTop){
    g.appendChild(el('circle',{cx:cx,cy:cy,r:44,fill:'none',stroke:'#2a4018','stroke-width':'1.4','stroke-dasharray':'5,4',opacity:'0.65',...C}));
    g.appendChild(el('rect',{x:(cx-10+2).toFixed(1),y:(cy-15+2).toFixed(1),width:20,height:20,fill:'#000',opacity:'0.45',...C}));
    g.appendChild(el('rect',{x:(cx-10).toFixed(1),y:(cy-15).toFixed(1),width:20,height:20,fill:'#141e0c',stroke:'#508830','stroke-width':'1.8',...C}));
    g.appendChild(el('line',{x1:cx,y1:cy-15,x2:cx,y2:cy+5,stroke:'#3a5820','stroke-width':'1',opacity:'0.55',...C}));
    g.appendChild(el('line',{x1:cx-10,y1:cy-5,x2:cx+10,y2:cy-5,stroke:'#3a5820','stroke-width':'1',opacity:'0.55',...C}));
    [[cx-10,cy-15,cx-36,cy-36],[cx+10,cy-15,cx+36,cy-36],[cx-10,cy+5,cx-36,cy+24],[cx+10,cy+5,cx+36,cy+24]]
      .forEach(([x1,y1,x2,y2])=>g.appendChild(el('line',{x1,y1,x2,y2,stroke:'#2e4018','stroke-width':'1.6',opacity:'0.62',...C})));
    [[cx-32,cy+28],[cx+32,cy+28]].forEach(([px,py])=>g.appendChild(el('rect',{x:(px-5).toFixed(1),y:(py-5).toFixed(1),width:10,height:10,fill:'#121c0a',stroke:'#3c6028','stroke-width':'1.4',...C})));
    g.appendChild(el('rect',{x:(cx-22).toFixed(1),y:(cy+20).toFixed(1),width:44,height:5,fill:'#1c2e10',stroke:'#508830','stroke-width':'1',opacity:'0.80',...C}));
    [[cx-22,cy+48],[cx+22,cy+48]].forEach(([fx,fy])=>g.appendChild(el('circle',{cx:fx,cy:fy,r:4,fill:'#80C060',opacity:'0.36',...C})));
    g.appendChild(el('circle',{cx:(cx-38).toFixed(1),cy:(cy-38).toFixed(1),r:3,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.68',...C}));
  }else{
    g.appendChild(el('rect',{x:(cx-26).toFixed(1),y:(cy-32).toFixed(1),width:52,height:6,fill:'#1c2e10',stroke:'#508830','stroke-width':'1.2',opacity:'0.82',...C}));
    [[cx-26,cy-32],[cx+26,cy-32]].forEach(([bx2,by2])=>g.appendChild(el('rect',{x:(bx2-2).toFixed(1),y:by2.toFixed(1),width:4,height:14,fill:'#243018',...C})));
    [[cx-32,cy-8,20,16],[cx+12,cy-8,20,16]].forEach(([bx2,by2,bw2,bh2])=>{
      g.appendChild(el('rect',{x:bx2.toFixed(1),y:by2.toFixed(1),width:bw2,height:bh2,fill:'#141e0c',stroke:'#3c6028','stroke-width':'1.4',...C}));
      g.appendChild(el('rect',{x:(bx2+5).toFixed(1),y:(by2+4).toFixed(1),width:8,height:6,fill:'#1e2e14',stroke:'#2e4818','stroke-width':'0.8',...C}));});
    g.appendChild(el('rect',{x:(cx-10).toFixed(1),y:(cy-8).toFixed(1),width:20,height:16,fill:'#0e1408',opacity:'0.65',...C}));
    for(var avi=0;avi<3;avi++)g.appendChild(el('line',{x1:(cx-10).toFixed(1),y1:(cy-4+avi*6).toFixed(1),x2:(cx+10).toFixed(1),y2:(cy-4+avi*6).toFixed(1),stroke:'#2a4018','stroke-width':'1.5',opacity:'0.50',...C}));
    g.appendChild(el('rect',{x:(cx-18).toFixed(1),y:(cy+16).toFixed(1),width:36,height:22,fill:'#0e1408',opacity:'0.60',...C}));
    [{ox:-12,oy:20,s:9},{ox:0,oy:20,s:9},{ox:12,oy:20,s:9},{ox:-8,oy:30,s:9},{ox:6,oy:30,s:9}].forEach(b=>g.appendChild(el('rect',{x:(cx+b.ox-b.s/2).toFixed(1),y:(cy+b.oy).toFixed(1),width:b.s,height:b.s,fill:'#1a2810',stroke:'#2e4018','stroke-width':'0.9',...C})));
    g.appendChild(el('circle',{cx:(cx+38).toFixed(1),cy:(cy+38).toFixed(1),r:3,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.66',...C}));
  }
  g.appendChild(el('circle',{cx:(cx+(isTop?-46:46)).toFixed(1),cy:(cy+(isTop?24:-24)).toFixed(1),r:2,fill:'#c8a040',opacity:'0.14',...C}));
  g.appendChild(el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#0c1208','stroke-width':'5',...C}));
  g.appendChild(el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#508830','stroke-width':'1.5',...C}));
  var ap=el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#80C060','stroke-width':'1','stroke-opacity':'0.2'});
  anim6(g,ap,'0.2;0.54;0.2','3.5s');
  g.appendChild(dots6(cx,cy,'#80C060','url(#wk-glow-cat-avamposto)'));
  var lb=el('g',{'class':'wk-tile-label',filter:'url(#wk-dark-halo)'});
  drawCatIcon(lb,'avamposto',cx,cy-20,Math.round(R*0.28),'#80C060');
  var nl4=wrapN(tile.nome.toUpperCase(),12),fs4=Math.round(R*0.12);
  nl4.forEach((ln,i)=>lb.appendChild(txt(ln,{x:cx,y:cy+12+i*fs4*1.4,'text-anchor':'middle','dominant-baseline':'middle','font-size':fs4,'font-weight':'bold','letter-spacing':'2',fill:'#80C060','font-family':'monospace'})));
  g.appendChild(lb);return g;
}

// ── drawUrbana ────────────────────────────────────────────────────────────────
function drawUrbana(tile,cx,cy){
  var nome=tile.nome;
  var g=el('g',{'class':'tile tile-urbana'});
  var cid='wk-cp-urb-'+nome.replace(/ /g,'-').toLowerCase();addCP(cid,cx,cy);var C={'clip-path':'url(#'+cid+')'};
  var addBldg=(bx,by,bw,bh,fill,sc)=>{fill=fill||'#101012';sc=sc||'#1e1e22';g.appendChild(el('rect',{x:(bx-bw/2).toFixed(1),y:(by-bh/2).toFixed(1),width:bw,height:bh,fill,stroke:sc,'stroke-width':'1.2',...C}));};
  var addTree=(tx,ty,rx2,ry2)=>g.appendChild(el('ellipse',{cx:tx.toFixed(1),cy:ty.toFixed(1),rx:rx2,ry:ry2,fill:'#0e1208',stroke:'#1a2010','stroke-width':'0.8',opacity:'0.88',...C}));
  var addCross=(cx2,cy2,sz)=>{g.appendChild(el('line',{x1:cx2,y1:(cy2-sz).toFixed(1),x2:cx2,y2:(cy2+sz).toFixed(1),stroke:'#202028','stroke-width':'1.2',...C}));g.appendChild(el('line',{x1:(cx2-sz).toFixed(1),y1:cy2,x2:(cx2+sz).toFixed(1),y2:cy2,stroke:'#202028','stroke-width':'1.2',...C}));};
  g.appendChild(el('rect',{x:cx-R-2,y:cy-H-2,width:(R+2)*2,height:(H+2)*2,fill:'#070708',...C}));
  [{ox:-48,oy:-28,w:44,h:30},{ox:12,oy:-22,w:46,h:28},{ox:-30,oy:20,w:52,h:26},{ox:28,oy:14,w:32,h:38}]
    .forEach(p=>g.appendChild(el('rect',{x:(cx+p.ox).toFixed(1),y:(cy+p.oy).toFixed(1),width:p.w,height:p.h,fill:'#0c0c12',opacity:'0.75',...C})));
  [{ox:-52,oy:-22,rx:10,ry:5},{ox:48,oy:24,rx:9,ry:5},{ox:44,oy:-42,rx:9,ry:5},{ox:-42,oy:48,rx:10,ry:6}]
    .forEach(v=>g.appendChild(el('ellipse',{cx:(cx+v.ox).toFixed(1),cy:(cy+v.oy).toFixed(1),rx:v.rx,ry:v.ry,fill:'#121210',opacity:'0.70',...C})));
  var em={top:[cx,cy-H],ur:[cx+67.5,cy-H/2],lr:[cx+67.5,cy+H/2],bot:[cx,cy+H],ll:[cx-67.5,cy+H/2],ul:[cx-67.5,cy-H/2]};
  ['top','ur','lr','bot','ll','ul'].forEach(k=>{var[ex,ey]=em[k];
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#0c0c14','stroke-width':20,...C}));
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#1c1c26','stroke-width':13,...C}));
    g.appendChild(el('line',{x1:cx,y1:cy,x2:ex,y2:ey,stroke:'#2c2c44','stroke-width':1.5,'stroke-dasharray':'10,8',opacity:'0.60',...C}));});
  if(!nome.includes('Capannone')){
    var rx1=cx-67.5,ry1=cy-H/2,rx2=cx+67.5,ry2=cy+H/2;
    var rdx=rx2-rx1,rdy=ry2-ry1,rlen=Math.sqrt(rdx*rdx+rdy*rdy);
    var rnx=-rdy/rlen*3.5,rny=rdx/rlen*3.5;
    for(var ri=1;ri<=7;ri++){var rft=ri/8,stx=rx1+rdx*rft,sty=ry1+rdy*rft;
      g.appendChild(el('line',{x1:(stx+rnx*1.6).toFixed(1),y1:(sty+rny*1.6).toFixed(1),x2:(stx-rnx*1.6).toFixed(1),y2:(sty-rny*1.6).toFixed(1),stroke:'#161820','stroke-width':'4.5',opacity:'0.55',...C}));}
    g.appendChild(el('line',{x1:(rx1+rnx).toFixed(1),y1:(ry1+rny).toFixed(1),x2:(rx2+rnx).toFixed(1),y2:(ry2+rny).toFixed(1),stroke:'#242432','stroke-width':'1.6',opacity:'0.70',...C}));
    g.appendChild(el('line',{x1:(rx1-rnx).toFixed(1),y1:(ry1-rny).toFixed(1),x2:(rx2-rnx).toFixed(1),y2:(ry2-rny).toFixed(1),stroke:'#242432','stroke-width':'1.6',opacity:'0.70',...C}));
  }
  var isBosco=nome.includes('Bosco')||nome.includes('Boschetto')||nome.includes('Sentiero');
  if(isBosco){
    var isRov=nome.includes('Rovine'),isCon=nome.includes('Controllato'),isRic2=nome.includes('Riconquistato'),isSen=nome.includes('Sentiero');
    var tSets={rovine:[[cx-30,cy-34,22,16],[cx+24,cy-30,18,14],[cx-46,cy+6,16,12],[cx+32,cy+10,20,15],[cx-16,cy+32,18,13],[cx+38,cy-16,13,10]],
      controllato:[[cx-26,cy-32,20,15],[cx+20,cy-30,18,14],[cx-44,cy+4,16,12],[cx+34,cy+8,20,15],[cx-14,cy+28,18,13],[cx+38,cy-14,13,9],[cx-34,cy+44,14,10]],
      riconquistato:[[cx-28,cy-36,22,16],[cx+24,cy-32,20,15],[cx-48,cy+2,18,13],[cx+36,cy+6,22,16],[cx-14,cy+28,20,14],[cx+40,cy-14,15,11],[cx-36,cy+44,16,11]],
      sentiero:[[cx-42,cy-22,18,13],[cx+42,cy-22,16,12],[cx-44,cy+10,18,13],[cx+44,cy+10,16,12],[cx-30,cy+44,16,11],[cx+30,cy+44,14,10]],
      def:[[cx-22,cy-26,16,11],[cx+18,cy-24,14,10],[cx-36,cy+2,12,9],[cx+28,cy+6,16,11],[cx-12,cy+24,14,10],[cx+34,cy-10,11,8],[cx-28,cy+36,13,9]]};
    var tk=isRov?'rovine':isCon?'controllato':isRic2?'riconquistato':isSen?'sentiero':'def';
    if(isRov)[[cx-10,cy-10,24,14],[cx+22,cy+24,20,12]].forEach(([bx,by,bw,bh])=>addBldg(bx,by,bw,bh,'#0c0c10','#1c1c22'));
    if(isRic2)[[cx-14,cy-6,22,14],[cx+18,cy+14,18,12]].forEach(([bx,by,bw,bh])=>addBldg(bx,by,bw,bh,'#0c0c10','#1c1c22'));
    if(isSen)g.appendChild(el('line',{x1:cx,y1:(cy-72).toFixed(1),x2:cx,y2:(cy+72).toFixed(1),stroke:'#0b0b0e','stroke-width':'16',opacity:'0.75',...C}));
    tSets[tk].forEach(([tx,ty,rx3,ry3])=>addTree(tx,ty,rx3,ry3));
    if(isCon)[[cx-24,cy-44],[cx+24,cy-44],[cx-46,cy+2]].forEach(([mx,my])=>{
      g.appendChild(el('line',{x1:mx,y1:my,x2:mx,y2:(my+18).toFixed(1),stroke:'#282830','stroke-width':'1.5',...C}));
      g.appendChild(el('circle',{cx:mx,cy:my,r:3,fill:'#1e1e28',stroke:'#30304a','stroke-width':'1',...C}));});
    if(nome.includes('Boschetto'))addBldg(cx-50,cy+18,14,22,'#0c0c10','#1a1a1e');
    g.appendChild(el('circle',{cx:cx,cy:cy,r:3,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.40',...C}));
  }else if(nome.includes('Palude')){
    [{ox:0,oy:-18,rx:24,ry:14},{ox:-24,oy:12,rx:18,ry:11},{ox:20,oy:18,rx:16,ry:10},{ox:-10,oy:38,rx:14,ry:9}]
      .forEach(w=>g.appendChild(el('ellipse',{cx:(cx+w.ox).toFixed(1),cy:(cy+w.oy).toFixed(1),rx:w.rx,ry:w.ry,fill:'#050810',stroke:'#0a0e18','stroke-width':'1',opacity:'0.90',...C})));
    [[cx-36,cy-32],[cx+28,cy-16],[cx-18,cy+46],[cx+40,cy+34]].forEach(([ptx,pty])=>{
      g.appendChild(el('line',{x1:ptx,y1:pty,x2:ptx,y2:(pty-18).toFixed(1),stroke:'#161810','stroke-width':'2',opacity:'0.65',...C}));
      g.appendChild(el('line',{x1:ptx,y1:(pty-8).toFixed(1),x2:(ptx-8).toFixed(1),y2:(pty-16).toFixed(1),stroke:'#161810','stroke-width':'1.2',opacity:'0.58',...C}));
      g.appendChild(el('line',{x1:ptx,y1:(pty-8).toFixed(1),x2:(ptx+8).toFixed(1),y2:(pty-16).toFixed(1),stroke:'#161810','stroke-width':'1.2',opacity:'0.58',...C}));});
    [{ox:14,oy:-28,rx:6,ry:3},{ox:-28,oy:28,rx:7,ry:3},{ox:32,oy:40,rx:5,ry:3}]
      .forEach(d=>g.appendChild(el('ellipse',{cx:(cx+d.ox).toFixed(1),cy:(cy+d.oy).toFixed(1),rx:d.rx,ry:d.ry,fill:'#0e1010',opacity:'0.78',...C})));
  }else if(nome.includes('Cimitero')){
    g.appendChild(el('rect',{x:(cx-54).toFixed(1),y:(cy-44).toFixed(1),width:108,height:80,fill:'none',stroke:'#1e1e28','stroke-width':'1.2','stroke-dasharray':'8,5',opacity:'0.50',...C}));
    for(var crow=0;crow<4;crow++)for(var ccol=0;ccol<4;ccol++){
      var hx2=cx-30+ccol*20,hy2=cy-28+crow*20;
      if((crow+ccol)%3===0)addCross(hx2,hy2,6);
      else{g.appendChild(el('rect',{x:(hx2-3).toFixed(1),y:(hy2-7).toFixed(1),width:6,height:10,fill:'#0e0e12',stroke:'#202028','stroke-width':'0.8',...C}));
        g.appendChild(el('ellipse',{cx:hx2.toFixed(1),cy:(hy2-7).toFixed(1),rx:3,ry:3,fill:'#0e0e12',stroke:'#202028','stroke-width':'0.8',...C}));}}
    [{ox:-44,oy:28,rx:14,ry:8},{ox:40,oy:-32,rx:12,ry:7}]
      .forEach(v=>g.appendChild(el('ellipse',{cx:(cx+v.ox).toFixed(1),cy:(cy+v.oy).toFixed(1),rx:v.rx,ry:v.ry,fill:'#0d1008',opacity:'0.72',...C})));
  }else if(nome.includes('Capannone')){
    [-5,5].forEach(off=>g.appendChild(el('line',{x1:(cx-72).toFixed(1),y1:(cy+off).toFixed(1),x2:(cx+72).toFixed(1),y2:(cy+off).toFixed(1),stroke:'#1a1a1e','stroke-width':'2',...C})));
    for(var capi=-60;capi<=60;capi+=14)g.appendChild(el('line',{x1:(cx+capi).toFixed(1),y1:(cy-9).toFixed(1),x2:(cx+capi).toFixed(1),y2:(cy+9).toFixed(1),stroke:'#121214','stroke-width':'3',opacity:'0.70',...C}));
    g.appendChild(el('rect',{x:(cx-36).toFixed(1),y:(cy-24).toFixed(1),width:76,height:46,fill:'#000',opacity:'0.38',...C}));
    g.appendChild(el('rect',{x:(cx-38).toFixed(1),y:(cy-26).toFixed(1),width:76,height:46,fill:'#0c0c10',stroke:'#1e1e24','stroke-width':'1.8',...C}));
    for(var capi2=-3;capi2<=3;capi2++)g.appendChild(el('line',{x1:(cx+capi2*12).toFixed(1),y1:(cy-26).toFixed(1),x2:(cx+capi2*12).toFixed(1),y2:(cy+20).toFixed(1),stroke:'#181820','stroke-width':'0.8',opacity:'0.58',...C}));
    g.appendChild(el('rect',{x:(cx+22).toFixed(1),y:(cy-12).toFixed(1),width:14,height:18,fill:'#0a0a0c',stroke:'#262630','stroke-width':'1.2',...C}));
    g.appendChild(el('circle',{cx:(cx-28).toFixed(1),cy:(cy-36).toFixed(1),r:3,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.52',...C}));
  }else if(nome.includes('Prigione')){
    g.appendChild(el('rect',{x:(cx-52).toFixed(1),y:(cy-44).toFixed(1),width:104,height:80,fill:'none',stroke:'#1a1a22','stroke-width':'1.2','stroke-dasharray':'5,4',opacity:'0.50',...C}));
    g.appendChild(el('rect',{x:(cx-20).toFixed(1),y:(cy-18).toFixed(1),width:40,height:34,fill:'#000',opacity:'0.52',...C}));
    g.appendChild(el('rect',{x:(cx-18).toFixed(1),y:(cy-16).toFixed(1),width:36,height:32,fill:'#050508',stroke:'#262632','stroke-width':'1.8',...C}));
    for(var pri=0;pri<4;pri++)g.appendChild(el('line',{x1:(cx-18).toFixed(1),y1:(cy-10+pri*6).toFixed(1),x2:(cx+18).toFixed(1),y2:(cy-10+pri*6).toFixed(1),stroke:'#1e1e28','stroke-width':'1.5',...C}));
    for(var prj=0;prj<4;prj++)g.appendChild(el('line',{x1:(cx-9+prj*6).toFixed(1),y1:(cy-16).toFixed(1),x2:(cx-9+prj*6).toFixed(1),y2:(cy+16).toFixed(1),stroke:'#1e1e28','stroke-width':'1.5',...C}));
    [[cx-44,cy-36],[cx+44,cy-36],[cx-44,cy+32],[cx+44,cy+32]].forEach(([tx2,ty2])=>g.appendChild(el('rect',{x:(tx2-5).toFixed(1),y:(ty2-5).toFixed(1),width:10,height:10,fill:'#0c0c10',stroke:'#1e1e28','stroke-width':'1.2',...C})));
  }else if(nome.includes('Varco')||nome.includes('Dogana')){
    var isMil2=nome.includes('Militarizzato'),isInt=nome.includes('Interdetto'),isDog=nome.includes('Dogana');
    addBldg(cx,cy,isDog?36:26,isDog?20:14,'#0e0e12','#242432');
    if(isMil2){
      [cy-28,cy+28].forEach(by2=>g.appendChild(el('rect',{x:(cx-30).toFixed(1),y:by2.toFixed(1),width:60,height:5,fill:'#141420',stroke:'#242430','stroke-width':'1',...C})));
      [[cx-36,cy-40],[cx+36,cy-40],[cx-36,cy+36],[cx+36,cy+36]].forEach(([mx,my])=>g.appendChild(el('circle',{cx:mx,cy:my,r:3,fill:'#181826',stroke:'#28283a','stroke-width':'1',...C})));
    }else if(isInt){
      [[cx-32,cy-28,20,12],[cx+28,cy+26,18,10],[cx-38,cy+34,14,10]].forEach(([rx,ry,rw,rh])=>addBldg(rx,ry,rw,rh,'#141416','#1e1e24'));
      g.appendChild(el('line',{x1:(cx-16).toFixed(1),y1:(cy-16).toFixed(1),x2:(cx+16).toFixed(1),y2:(cy+16).toFixed(1),stroke:'#24243a','stroke-width':'3',opacity:'0.72',...C}));
      g.appendChild(el('line',{x1:(cx+16).toFixed(1),y1:(cy-16).toFixed(1),x2:(cx-16).toFixed(1),y2:(cy+16).toFixed(1),stroke:'#24243a','stroke-width':'3',opacity:'0.72',...C}));
    }else{
      g.appendChild(el('line',{x1:cx,y1:(cy-10).toFixed(1),x2:cx,y2:(cy+10).toFixed(1),stroke:'#28283a','stroke-width':'1.5',...C}));
      g.appendChild(el('line',{x1:(cx-14).toFixed(1),y1:cy,x2:(cx+14).toFixed(1),y2:cy,stroke:'#28283a','stroke-width':'1.5',...C}));
      g.appendChild(el('rect',{x:(cx-24).toFixed(1),y:(cy-30).toFixed(1),width:48,height:5,fill:'#141420',stroke:'#24243a','stroke-width':'1',...C}));
      [{ox:-28,oy:26,s:10},{ox:-14,oy:26,s:10},{ox:0,oy:26,s:10}].forEach(b=>g.appendChild(el('rect',{x:(cx+b.ox-b.s/2).toFixed(1),y:(cy+b.oy).toFixed(1),width:b.s,height:b.s,fill:'#141416',stroke:'#1e1e24','stroke-width':'0.8',...C})));
    }
    g.appendChild(el('circle',{cx:(cx+42).toFixed(1),cy:(cy-40).toFixed(1),r:3,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.50',...C}));
  }else{
    var isF=nome.includes('Fantasma'),isSob=nome.includes('Sobborghi'),isCon2=nome.includes('Conteso'),isOcc=nome.includes('Occupato'),isEva=nome.includes('Evacuata');
    var bldgs=isSob?[[cx-40,cy-24,18,12],[cx-16,cy-24,18,12],[cx+8,cy-24,18,12],[cx+32,cy-24,18,12],[cx-40,cy+10,18,12],[cx-16,cy+10,18,12],[cx+8,cy+10,18,12],[cx+32,cy+10,18,12]]:
      isF?[[cx-32,cy-20,28,22],[cx+16,cy-20,28,22],[cx-32,cy+18,28,20],[cx+16,cy+18,28,20]]:
      nome.includes('Dismesso')?[[cx-28,cy-14,42,24],[cx+26,cy-14,18,24],[cx-28,cy+22,28,16],[cx+14,cy+22,34,16]]:
      [[cx-36,cy-22,24,18],[cx+12,cy-22,24,18],[cx-36,cy+14,24,16],[cx+12,cy+14,24,16],[cx-8,cy-34,16,14]];
    bldgs.forEach(([bx,by,bw,bh])=>{addBldg(bx,by,bw,bh,isF?'#070710':'#0e0e12',isF?'#14141e':'#1e1e24');});
    if(isCon2){g.appendChild(el('rect',{x:(cx-22).toFixed(1),y:(cy-3).toFixed(1),width:44,height:6,fill:'#141418',stroke:'#202028','stroke-width':'1',...C}));}
    if(isOcc){g.appendChild(el('line',{x1:cx,y1:(cy-38).toFixed(1),x2:cx,y2:(cy-20).toFixed(1),stroke:'#202030','stroke-width':'1.5',...C}));g.appendChild(el('rect',{x:cx.toFixed(1),y:(cy-38).toFixed(1),width:10,height:6,fill:'#1c1c2a',...C}));}
    if(isEva)[[cx-28,cy-42],[cx+28,cy-40],[cx+30,cy+34]].forEach(([sx,sy])=>g.appendChild(el('polygon',{points:`${sx},${sy-6} ${sx-5},${sy+4} ${sx+5},${sy+4}`,fill:'none',stroke:'#20202e','stroke-width':'1.2',opacity:'0.70',...C})));
    [{ox:-50,oy:-20,rx:8,ry:5},{ox:46,oy:24,rx:7,ry:4},{ox:-10,oy:52,rx:9,ry:5}]
      .forEach(d=>g.appendChild(el('ellipse',{cx:(cx+d.ox).toFixed(1),cy:(cy+d.oy).toFixed(1),rx:d.rx,ry:d.ry,fill:'#0c0c10',opacity:'0.72',...C})));
    if(!isF&&!isEva)g.appendChild(el('circle',{cx:cx,cy:cy,r:3,fill:'#FF4010',filter:'url(#wk-glow-fire)',opacity:'0.48',...C}));
  }
  g.appendChild(el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#08080e','stroke-width':'5',...C}));
  g.appendChild(el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#484860','stroke-width':'2.0',...C}));
  var apU=el('polygon',{points:hexPts(cx,cy),fill:'none',stroke:'#686880','stroke-width':'1.2','stroke-opacity':'0.18'});
  anim6(g,apU,'0.18;0.52;0.18','5s');
  g.appendChild(dots6(cx,cy,'#585870',null));
  var lb=el('g',{'class':'wk-tile-label',filter:'url(#wk-dark-halo)'});
  drawCatIcon(lb,'urbana',cx,cy-20,Math.round(R*0.25),'#606070');
  var nlU=wrapN(tile.nome.toUpperCase(),12),fsU=Math.round(R*0.11);
  nlU.forEach((ln,i)=>lb.appendChild(txt(ln,{x:cx,y:cy+12+i*fsU*1.4,'text-anchor':'middle','dominant-baseline':'middle','font-size':fsU,'font-weight':'bold','letter-spacing':'2',fill:'#606070','font-family':'monospace'})));
  g.appendChild(lb);return g;
}

// ── API pubblica ──────────────────────────────────────────────────────────────
global.wkDrawCatIcon=drawCatIcon; // _sm=false → restituisce DOM reali, usabile dal prototipo

global.wkRenderToSvg=function(svgEl,tiles,transform){
  _svg=svgEl;injectDefs();_cpBuf='';_sm=true;

  // Costruisce tutte le tessere come stringhe SVG (virtual nodes → toString())
  var tilesStr='';
  tiles.forEach(t=>{
    var cat=t.type||t.cat||'',nome=t.name||t.nome||'';
    var tile={col:t.col,v:t.v,cat,nome,player:t.player};
    var[cx,cy]=tc(t.col,t.v);var tg;
    if(cat==='fortezza')        tg=drawFortezza(cx,cy);
    else if(cat==='ospedaliera') tg=drawOspedale(tile,cx,cy);
    else if(cat==='stazione')    tg=drawStazione(tile,cx,cy);
    else if(cat==='militare')    tg=drawMilitare(tile,cx,cy);
    else if(cat==='riciclaggio') tg=drawRiciclaggio(tile,cx,cy);
    else if(cat==='estrazione')  tg=drawEstrazione(tile,cx,cy);
    else if(cat==='accampamento')tg=drawAccampamento(tile,cx,cy);
    else if(cat==='avamposto')   tg=drawAvamposto(tile,cx,cy);
    else if(cat==='urbana')      tg=drawUrbana(tile,cx,cy);
    else tg=el('g',{});
    tilesStr+=''+tg;
  });
  _sm=false;

  // Circuito stazioni (stringa diretta, senza animazione)
  var stO=[{col:2,v:0},{col:6,v:0},{col:6,v:6},{col:6,v:12},{col:2,v:12},{col:2,v:6}];
  var ptStr=stO.map(s=>{var p=tc(s.col,s.v);return p[0].toFixed(1)+','+p[1].toFixed(1);}).join(' ');
  var dotStr=stO.map(s=>{var p=tc(s.col,s.v);
    return `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="none" stroke="#c8a040" stroke-width="1.2" opacity="0.30"/>` +
           `<circle cx="${p[0]}" cy="${p[1]}" r="5" fill="#c8a040" opacity="0.85"/>`;}).join('');
  var circuitStr=`<g class="wk-station-circuit">` +
    `<polygon points="${ptStr}" fill="none" stroke="#c8a040" stroke-width="8" stroke-dasharray="16,12" opacity="0.06"/>` +
    `<polygon points="${ptStr}" fill="none" stroke="#c8a040" stroke-width="1.8" stroke-dasharray="16,12" opacity="0.38"/>` +
    dotStr+'</g>';

  // Inietta clipPaths nel defs reale tramite DOMParser
  if(_cpBuf){
    var cpDoc=new DOMParser().parseFromString(
      '<svg xmlns="http://www.w3.org/2000/svg">'+_cpBuf+'</svg>','image/svg+xml');
    var defs=_svg.querySelector('defs');
    Array.from(cpDoc.documentElement.childNodes).forEach(n=>defs.appendChild(document.adoptNode(n)));
    _cpBuf='';
  }

  // Crea il gruppo contenitore e inietta tutto il contenuto in un colpo (innerHTML >> DOM API)
  var g=document.createElementNS(NS,'g');
  g.setAttribute('class','wk-layer');
  if(transform)g.setAttribute('transform',transform);
  g.setAttribute('pointer-events','none');
  g.innerHTML=tilesStr+circuitStr;
  svgEl.appendChild(g);
  return g;
};
})(window);

// কার্ড রেন্ডারিং ইঞ্জিন: টেমপ্লেট (TPL) এখানে। নতুন টেমপ্লেট যোগ করার নিয়ম README-তে।
const F={mn:"Mina",gl:"Galada",at:"Atma",ns:"Noto Serif Bengali",nb:"Noto Sans Bengali",hs:"Hind Siliguri",tb:"Tiro Bangla",ab:"Anek Bangla",bd:"Baloo Da 2"};
const $=i=>document.getElementById(i);
const S={img:null,logo:null,logoData:null,pc:null,ac:null};
const PLAT={fb:[1200,630],ig:[1080,1080],igp:[1080,1350],story:[1080,1920],yt:[1280,720],x:[1600,900]};
let designs=[],sel=0,ready=false;
const lum=h=>{const n=parseInt(h.slice(1),16);return(.299*(n>>16)+.587*(n>>8&255)+.114*(n&255))/255};
const ink=h=>lum(h)>.58?"#141414":"#ffffff";
const src=()=>(S.url||S.web||"").trim().replace(/^https?:\/\//i,"").replace(/^www\./i,"").replace(/\/.*$/,"").slice(0,40);
const hf=f=>fs=>`${f[0]===F.tb||f[0]===F.gl?400:700} ${fs}px "${f[0]}"`;
const bf=f=>fs=>`400 ${fs}px "${f[1]}"`;

const rnd=s=>()=>(s=(s*16807)%2147483647)/2147483647;
const mix=(a,b,t)=>{const A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16),f=(i)=>Math.round(((A>>i)&255)*(1-t)+((B>>i)&255)*t);return"#"+((1<<24)+(f(16)<<16)+(f(8)<<8)+f(0)).toString(16).slice(1)};
const hexA=(h,a)=>{const n=parseInt(h.slice(1),16);return`rgba(${n>>16},${n>>8&255},${n&255},${a})`};
function lines(t){t=String(t).replace(/\*/g,"");const l=t.split("\n").map(s=>s.trim()).filter(Boolean);if(l.length>1)return l.slice(0,7);const w=t.trim().split(/\s+/).filter(Boolean);if(w.length<=2)return w.length?[w.join(" ")]:[t];const n=Math.min(4,Math.ceil(w.length/2)),per=Math.ceil(w.length/n),o=[];for(let i=0;i<w.length;i+=per)o.push(w.slice(i,i+per).join(" "));return o}
function bird(x,cx,cy,s,col){x.fillStyle=col;x.beginPath();x.moveTo(cx-s,cy);x.quadraticCurveTo(cx-s*.5,cy-s*.8,cx,cy);x.quadraticCurveTo(cx+s*.5,cy-s*.8,cx+s,cy);x.quadraticCurveTo(cx+s*.4,cy-s*.1,cx,cy+s*.25);x.quadraticCurveTo(cx-s*.4,cy-s*.1,cx-s,cy);x.fill()}
function stack(x,ls,ff,X,Y,w,h,o){
  x.textBaseline="middle";const al=o.al||"center",lh=o.lh||1.12;
  let sz=ls.map(l=>{x.font=ff(100);return 100*w/Math.max(1,x.measureText(l).width)});
  const mn=Math.min(...sz),mx=o.max*S.sc;sz=sz.map(s=>Math.min(s,mn*(o.vary||1.35),mx));
  let tot=sz.reduce((a,s)=>a+s*lh,0);if(tot>h){const k=h/tot;sz=sz.map(s=>s*k);tot=h}
  let y=Y+(h-tot)/2;const y0=y,px=al==="center"?X+w/2:al==="right"?X+w:X;
  ls.forEach((l,i)=>{const s=sz[i];x.font=ff(s);x.textAlign=al;x.textBaseline="middle";const cy=y+s*lh/2;
    if(o.fn)o.fn(x,l,px,cy,s,i,ls.length);else{x.fillStyle=o.col;x.fillText(l,px,cy)}y+=s*lh});
  return{y0,y:y0,tot}}
// ===== টাইপোগ্রাফি কম্পোজার: যেকোনো বাংলা লেখা থেকে স্বয়ংক্রিয় লেটারিং-লকআপ =====
// ইনপুট নিয়ম: Enter = নতুন লাইন, *শব্দ* = হাইলাইট/বড় রঙিন শব্দ। কিছু না দিলে নিজে লাইন ভাগ করে ও মূল শব্দ বেছে নেয়।
const FM={heavy:["Baloo Da 2",800],brush:["Atma",700],cal:["Galada",400],mina:["Mina",700],black:["Noto Sans Bengali",900],serif:["Noto Serif Bengali",900],anek:["Anek Bangla",800],hind:["Hind Siliguri",700]};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function parseT(x,t,f0){
  const raw=String(t||"").replace(/\r/g,"").split("\n").map(s=>s.trim()).filter(Boolean);let em=false;
  const mk=s=>s.split(/\s+/).filter(Boolean).map(w=>{const st=w[0]==="*",en=w.length>1&&w.endsWith("*");if(st)em=true;const e=em;if(en)em=false;return{t:w.replace(/\*/g,""),e}}).filter(o=>o.t);
  let L;
  if(raw.length>1)L=raw.slice(0,7).map(mk);
  else{const ws=mk(raw[0]||"");const n=ws.length;
    if(n<=1)L=[ws];
    else{const k=n===2?2:clamp(Math.round(n/1.7),1,5);x.font=`${f0[1]} 100px "${f0[0]}"`;
      const w=ws.map(o=>x.measureText(o.t).width),sp=x.measureText(" ").width,pre=[0];w.forEach((a,i)=>pre.push(pre[i]+a));
      const Wd=(j,i)=>pre[i]-pre[j]+sp*(i-j-1),T=(pre[n]+sp*(n-k))/k,INF=1e18;
      const dp=Array.from({length:k+1},()=>Array(n+1).fill(INF)),bk=Array.from({length:k+1},()=>Array(n+1).fill(0));dp[0][0]=0;
      for(let a=1;a<=k;a++)for(let i=a;i<=n;i++)for(let j=a-1;j<i;j++){if(dp[a-1][j]>=INF)continue;const d=Wd(j,i)-T,c=dp[a-1][j]+d*d;if(c<dp[a][i]){dp[a][i]=c;bk[a][i]=j}}
      L=[];let i=n;for(let a=k;a>=1;a--){const j=bk[a][i];L.unshift(ws.slice(j,i));i=j}}}
  if(!L.length)L=[[{t:" ",e:false}]];
  return L}
function compose(x,t,B,st,c,u,fo){
  const fl=fo&&fo.length?fo:st.fonts,fnt=i=>{const f=fl[i%fl.length];return Array.isArray(f)?f:FM[f]};
  const L=parseT(x,t,fnt(0)),n=L.length;
  if(n>=3&&st.auto!==false&&!L.some(l=>l.some(o=>o.e))){let bi=0,bw=1e9;L.forEach((l,i)=>{const w=l.map(o=>o.t).join(" ").length;if(w<bw){bw=w;bi=i}});L[bi].forEach(o=>o.e=true)}
  const em=L.map(l=>l.every(o=>o.e)),anyE=em.some(Boolean),SP=[1,.8,.92,.74,.96];
  const w100=L.map((l,i)=>{const[fa,wt]=fnt(i);x.font=`${wt} 100px "${fa}"`;return x.measureText(l.map(o=>o.t).join(" ")).width||1});
  const tw=L.map((l,i)=>B.W*(st.fill||1)*(anyE?(em[i]?1:(st.rest||.8)):1)*(st.stag?SP[i%5]:1));
  let s=tw.map((w,i)=>100*w/w100[i]);const med=[...s].sort((a,b)=>a-b)[Math.floor(n/2)],cap=(st.max||170)*u*S.sc;
  s=s.map(v=>Math.min(clamp(v,med*.72,med*(st.vary||1.5)),cap));
  let sx=s.map((v,i)=>st.lock===false?1:clamp(tw[i]/(w100[i]*v/100),.84,1.3)),lh=st.lh||.92;
  let tot=s.reduce((a,v)=>a+v*lh,0);if(tot>B.H){const k=B.H/tot;s=s.map(v=>v*k);tot=B.H}
  let y=st.va==="top"?B.Y:B.Y+(B.H-tot)/2;const y0=y,meta=[];
  L.forEach((l,i)=>{const[fa,wt]=fnt(i),sz=s[i];x.font=`${wt} ${sz}px "${fa}"`;
    const ws=l.map(o=>x.measureText(o.t).width),sp=x.measureText(" ").width,tw0=ws.reduce((a,b)=>a+b,0)+sp*(l.length-1),dw=tw0*sx[i];
    let cx=B.X+B.W/2;const al=st.al||"center";
    if(al==="stag")cx=i%2?B.X+B.W-dw/2:B.X+dw/2;else if(al==="stair")cx=B.X+dw/2+(B.W-dw)*(n>1?i/(n-1):.5);else if(al==="left")cx=B.X+dw/2;else if(al==="right")cx=B.X+B.W-dw/2;
    const cy=y+sz*lh/2,rot=((st.rot||0)*(i%2?1:-1)+Math.sin(i*12.9+1)*(st.jit||0))*Math.PI/180;
    x.save();x.translate(cx,cy);x.rotate(rot);x.scale(sx[i],1);x.textAlign="left";x.textBaseline="middle";x.font=`${wt} ${sz}px "${fa}"`;
    let px=-tw0/2;
    l.forEach((o,j)=>{const e=o.e&&st.emph!==false,col=e?(st.emphCol||c.ac):(st.col||c.fg),oul=st.alt&&i%2===1&&!e;
      if(st.hl&&e){x.fillStyle=c.ac;x.save();x.translate(px+ws[j]/2,0);x.rotate(-.025);x.fillRect(-ws[j]/2-14*u,-sz*.46,ws[j]+28*u,sz*.92);x.restore()}
      const fc=st.hl&&e?ink(c.ac):col;
      if(st.sh){for(let k=st.sh.n;k>0;k--){x.fillStyle=st.sh.col(k);x.fillText(o.t,px+k*st.sh.dx*u,k*st.sh.dy*u)}}
      if(oul){x.strokeStyle=fc;x.lineWidth=Math.max(2.5*u,sz*.03);x.lineJoin="round";x.strokeText(o.t,px,0)}
      else{let fs=fc;if(st.grad){const g=x.createLinearGradient(-tw0/2,0,tw0/2,0);g.addColorStop(0,st.grad[0]);g.addColorStop(1,st.grad[1]);fs=g}
        if(st.fat){x.strokeStyle=fs;x.lineWidth=sz*st.fat;x.lineJoin="round";x.strokeText(o.t,px,0)}x.fillStyle=fs;x.fillText(o.t,px,0)}
      px+=ws[j]+sp});
    x.restore();meta.push({cx,cy,dw,s:sz,e:em[i],rot});y+=sz*lh});
  return{y0,tot,meta,n}}
function swash(x,x1,x2,y,col,u,th){th=th||9*u;x.fillStyle=col;x.beginPath();x.moveTo(x1,y);x.quadraticCurveTo((x1+x2)/2,y-th*2.2,x2,y-th*.4);x.quadraticCurveTo((x1+x2)/2,y-th*1.1,x1,y);x.fill()}
function subTxt(x,t,X,Y,w,col,u,f,al,sz){if(!t)return;x.font=`700 ${(sz||34)*u}px "${f[1]}"`;x.fillStyle=col;x.textAlign=al||"center";x.textBaseline="middle";const ls=String(t).split("\n").slice(0,4);ls.forEach((l,i)=>x.fillText(l,X,Y+i*(sz||34)*1.3*u,w))}
const useF=f=>S.font&&S.font!=="auto"?[[S.font,700]]:null;
function wrap(x,t,w){const o=[];t.split("\n").forEach(p=>{let l="";p.split(/\s+/).filter(Boolean).forEach(wd=>{const s=l?l+" "+wd:wd;if(x.measureText(s).width>w&&l){o.push(l);l=wd}else l=s});o.push(l)});return o}
function put(x,t,font,X,Y,w,h,o){
  const mx=o.max*S.sc,mn=Math.min(o.min,mx),lh=o.lh||1.4;let fs=mx,l;
  for(;;){x.font=font(fs);l=wrap(x,t,w);if(l.length*fs*lh<=h||fs-2<mn)break;fs-=2}
  const L=fs*lh,tot=l.length*L,y=o.va==="top"?Y:o.va==="bot"?Y+h-tot:Y+(h-tot)/2;
  x.font=font(fs);x.fillStyle=o.col;x.textAlign=o.al||"left";x.textBaseline="middle";
  l.forEach((s,i)=>x.fillText(s,X,y+L*(i+.5)));return{y,tot,fs};
}
function cover(x,im,X,Y,w,h){const r=Math.max(w/im.width,h/im.height),iw=im.width*r,ih=im.height*r;x.save();x.beginPath();x.rect(X,Y,w,h);x.clip();x.drawImage(im,X+(w-iw)/2,Y+(h-ih)/2,iw,ih);x.restore()}
function chip(x,t,X,Y,u,bg,fg){x.font=`700 ${26*u}px "${F.hs}"`;const w=x.measureText(t).width+40*u,h=46*u;x.fillStyle=bg;x.beginPath();x.roundRect?x.roundRect(X,Y,w,h,8*u):x.rect(X,Y,w,h);x.fill();x.fillStyle=fg;x.textAlign="left";x.textBaseline="middle";x.fillText(t,X+20*u,Y+h/2+1);return w}
function foot(x,X,Y,al,col,u,au,nd){
  const a=S.page||"",b=[au?S.author:"",src(),nd?"":S.dt].filter(Boolean).join("  |  ");
  x.fillStyle=col;x.textAlign=al;x.textBaseline="middle";
  if(a){x.font=`700 ${30*u}px "${F.hs}"`;x.fillText(a,X,Y-(b?16*u:0))}
  if(b){x.globalAlpha=.8;x.font=`500 ${22*u}px "${F.hs}"`;x.fillText(b,X,Y+(a?18*u:0));x.globalAlpha=1}
}
function dots(x,X,Y,w,h,u,col,a){x.save();x.globalAlpha=a||.18;x.fillStyle=col;const s=36*u;for(let i=X+s/2;i<X+w;i+=s)for(let j=Y+s/2;j<Y+h;j+=s){x.beginPath();x.arc(i,j,3.2*u,0,7);x.fill()}x.restore()}
function star(x,cx,cy,r,fill,bg){x.save();x.translate(cx,cy);x.fillStyle=fill;x.fillRect(-r*.7,-r*.7,r*1.4,r*1.4);x.rotate(Math.PI/4);x.fillRect(-r*.7,-r*.7,r*1.4,r*1.4);x.fillStyle=bg;x.beginPath();x.arc(0,0,r*.25,0,7);x.fill();x.restore()}
function authorLine(x,t,X,Y,al,col,u,f){if(!S.author)return;x.font=`600 ${30*u}px "${f[1]}"`;x.fillStyle=col;x.textAlign=al;x.textBaseline="middle";x.fillText(t+S.author,X,Y)}

const TPL=[
{n:"নিউজ স্প্লিট",ty:["news"],f:[F.nb,F.nb],
 p:[["#0e1a2b","#ffffff","#e63946"],["#ffffff","#10151c","#0a7d5a"],["#161616","#f5f1e8","#f2b705"]],
 d(x,W,H,u,c,f){const m=64*u,sh=H*(W/H>1.5?.4:.5);
  if(S.img)cover(x,S.img,0,0,W,sh);else{x.fillStyle=c.ac;x.fillRect(0,0,W,sh);dots(x,0,0,W,sh,u,c.bg,.2)}
  x.fillStyle=c.ac;x.fillRect(0,sh,W,10*u);
  chip(x,S.cat||"সংবাদ",m,sh+m*.55,u,c.ac,ink(c.ac));
  put(x,S.text,hf(f),m,sh+m*1.4,W-2*m,H-sh-m*3.1,{max:76*u,min:30*u,col:c.fg,va:"top"});
  foot(x,m,H-m*.7,"left",c.fg,u,1)}},
{n:"নিউজ ওভারলে",ty:["news"],f:[F.nb,F.nb],
 p:[["#0b1220","#ffffff","#e63946"],["#1b2a41","#ffffff","#f2b705"],["#002d1f","#ffffff","#2fc08f"]],
 d(x,W,H,u,c,f){const m=64*u;
  if(S.img)cover(x,S.img,0,0,W,H);else{const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,c.bg);g.addColorStop(1,c.ac);x.fillStyle=g;x.fillRect(0,0,W,H)}
  const g=x.createLinearGradient(0,H*.25,0,H);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,.88)");x.fillStyle=g;x.fillRect(0,0,W,H);
  chip(x,S.cat||"সংবাদ",m,m,u,c.ac,ink(c.ac));
  put(x,S.text,hf(f),m,H*.3,W-2*m,H*.7-m*2.5,{max:80*u,min:30*u,col:"#fff",va:"bot"});
  x.fillStyle=c.ac;x.fillRect(m,H-m*1.55,90*u,8*u);
  foot(x,m,H-m*.7,"left","#fff",u,1)}},
{n:"ব্রেকিং",ty:["news"],f:[F.hs,F.nb],
 p:[["#111418","#ffffff","#d90429"],["#ffffff","#111418","#0057b8"],["#0a2342","#ffffff","#ffb703"]],
 d(x,W,H,u,c,f){const m=64*u,bh=96*u;
  x.fillStyle=c.ac;x.fillRect(0,0,W,bh);
  x.font=`700 ${40*u}px "${f[0]}"`;x.fillStyle=ink(c.ac);x.textAlign="left";x.textBaseline="middle";x.fillText(S.cat||"ব্রেকিং নিউজ",m,bh/2);x.textAlign="right";x.font=`500 ${28*u}px "${F.hs}"`;x.fillText(S.dt||"",W-m,bh/2);x.textAlign="left";
  let tw=W-2*m;
  if(S.img){const iw=W*.38;cover(x,S.img,W-iw,bh,iw,H-bh-14*u);tw=W-iw-m*1.6}
  put(x,S.text,hf(f),m,bh+m*.5,tw,H-bh-m*3,{max:84*u,min:30*u,col:c.fg});
  x.fillStyle=c.ac;x.fillRect(0,H-14*u,W,14*u);
  foot(x,m,H-m*1.05,"left",c.fg,u,1,1)}},
{n:"মিনিমাল উক্তি",ty:["quote"],f:[F.ns,F.nb],
 p:[["#f7f4ee","#1d1b19","#a4631d"],["#101820","#f2f2f2","#e8b04a"],["#eef3f1","#14302a","#0a7d5a"]],
 d(x,W,H,u,c,f){const m=64*u;
  x.save();x.globalAlpha=.3;x.fillStyle=c.ac;x.font=`700 ${300*u}px "${F.ns}"`;x.textAlign="center";x.textBaseline="middle";x.fillText("“",W/2,m+70*u);x.restore();
  put(x,S.text,hf(f),W/2,H*.2,W-2.6*m,H*.5,{max:68*u,min:28*u,col:c.fg,al:"center",lh:1.5});
  x.fillStyle=c.ac;x.fillRect(W/2-40*u,H*.72,80*u,5*u);
  authorLine(x,"— ",W/2,H*.72+50*u,"center",c.ac,u,f);
  foot(x,W/2,H-m*.7,"center",c.fg,u)}},
{n:"বোল্ড উক্তি",ty:["quote"],f:[F.ab,F.nb],
 p:[["#0a7d5a","#ffffff","#ffd166"],["#e63946","#ffffff","#1d1d1d"],["#1d3557","#f1faee","#ffb703"]],
 d(x,W,H,u,c,f){const m=64*u;
  dots(x,W*.55,0,W*.45,H*.4,u,c.fg,.16);
  put(x,S.text,hf(f),m,m*1.2,W-2*m,H-m*4.2,{max:92*u,min:30*u,col:c.fg});
  x.fillStyle=c.ac;x.fillRect(m,H-m*2.35,110*u,10*u);
  authorLine(x,"",m,H-m*1.55,"left",c.fg,u,f);
  foot(x,W-m,H-m*.7,"right",c.fg,u)}},
{n:"কবিতা",ty:["poetry"],f:[F.tb,F.nb],
 p:[["#fbf5e6","#2b2118","#8a5a2b"],["#f3ecf7","#2a1b3d","#7a3e9d"],["#14213d","#f4eedc","#d4a24c"]],
 d(x,W,H,u,c,f){const m=64*u,k=m*.45;
  x.strokeStyle=c.ac;x.lineWidth=4*u;x.strokeRect(k,k,W-2*k,H-2*k);x.lineWidth=1.5*u;x.strokeRect(k+14*u,k+14*u,W-2*k-28*u,H-2*k-28*u);
  put(x,S.text,hf(f),W/2,m*1.1,W-3*m,H-m*4.6,{max:64*u,min:26*u,col:c.fg,al:"center",lh:1.65});
  const dy=H-m*3.1;x.fillStyle=c.ac;x.fillRect(W/2-120*u,dy,90*u,2*u);x.fillRect(W/2+30*u,dy,90*u,2*u);
  x.save();x.translate(W/2,dy+1*u);x.rotate(Math.PI/4);x.fillRect(-7*u,-7*u,14*u,14*u);x.restore();
  authorLine(x,"— ",W/2,H-m*2.4,"center",c.ac,u,f);
  foot(x,W/2,H-m*1.3,"center",c.fg,u)}},
{n:"এডিটোরিয়াল",ty:["news"],f:[F.ns,F.nb],
 p:[["#ffffff","#15151a","#c1121f"],["#f4f1ea","#1a1a1a","#0a7d5a"],["#12161c","#f4f4f4","#e0a82e"]],
 d(x,W,H,u,c,f){const m=64*u,sw=150*u;
  x.fillStyle=c.ac;x.fillRect(0,0,sw,H);
  x.save();x.translate(sw/2,H/2);x.rotate(-Math.PI/2);x.fillStyle=ink(c.ac);x.font=`700 ${42*u}px "${F.hs}"`;x.textAlign="center";x.textBaseline="middle";x.fillText(S.cat||"সম্পাদকীয়",0,0);x.restore();
  const L=sw+m,w=W-L-m;
  const r=put(x,S.text,hf(f),L,m,w,H*(S.sub?.5:.62),{max:76*u,min:30*u,col:c.fg,va:"top"});
  const ry=r.y+r.tot+28*u;x.fillStyle=c.ac;x.fillRect(L,ry,100*u,6*u);
  if(S.sub)put(x,S.sub,bf(f),L,ry+28*u,w,Math.max(60*u,H-ry-28*u-m*2.4),{max:34*u,min:20*u,col:c.fg,va:"top",lh:1.55});
  foot(x,L,H-m*.7,"left",c.fg,u,1)}},
{n:"ইসলামিক এলিগ্যান্ট",ty:["islamic"],f:[F.ns,F.nb],
 p:[["#06382b","#f6efd9","#d9b44a"],["#0b1f33","#f3f0e6","#c9a24a"],["#1c1a2e","#f5efe2","#7fd1b9"]],
 d(x,W,H,u,c,f){const m=64*u,k=m*.5;
  x.strokeStyle=c.ac;x.lineWidth=3*u;x.strokeRect(k,k,W-2*k,H-2*k);
  [[k,k],[W-k,k],[k,H-k],[W-k,H-k]].forEach(p=>star(x,p[0],p[1],34*u,c.ac,c.bg));
  star(x,W/2,m*1.45,44*u,c.ac,c.bg);
  put(x,S.text,hf(f),W/2,m*2.3,W-3*m,H-m*5.4,{max:66*u,min:26*u,col:c.fg,al:"center",lh:1.55});
  authorLine(x,"— ",W/2,H-m*2.5,"center",c.ac,u,f);
  foot(x,W/2,H-m*1.3,"center",c.ac,u)}},
{n:"মডার্ন শেইপ",ty:["quote"],f:[F.ab,F.nb],
 p:[["#fff4e0","#201a14","#e76f51"],["#0f1720","#f5f5f5","#3ddc97"],["#eaf2ff","#0d1b3e","#3a6ff7"]],
 d(x,W,H,u,c,f){const m=64*u,R=Math.min(W,H)*.5*.55,cx=W*.84,cy=H*.18;
  x.save();x.beginPath();x.arc(cx,cy,R,0,7);
  if(S.img){x.clip();cover(x,S.img,cx-R,cy-R,R*2,R*2)}else{x.fillStyle=c.ac;x.fill()}
  x.restore();
  x.strokeStyle=c.ac;x.lineWidth=4*u;x.beginPath();x.arc(cx,cy,R+26*u,0,7);x.stroke();
  if(S.cat){x.font=`700 ${30*u}px "${F.hs}"`;x.fillStyle=c.ac;x.textAlign="left";x.textBaseline="middle";x.fillText(S.cat,m,H*.38)}
  put(x,S.text,hf(f),m,H*.42,W*.68,H*.4,{max:72*u,min:28*u,col:c.fg,va:"top"});
  authorLine(x,"— ",m,H-m*1.9,"left",c.ac,u,f);
  foot(x,m,H-m*.7,"left",c.fg,u)}},
{n:"বাংলাদেশ পতাকা",ty:["bangladesh"],f:[F.ab,F.nb],
 p:[["#006a4e","#ffffff","#f42a41"],["#0b3d2e","#fff7e6","#f42a41"],["#f42a41","#ffffff","#006a4e"]],
 d(x,W,H,u,c,f){const m=64*u,R=Math.min(W,H)*.34;
  x.fillStyle=c.ac;x.beginPath();x.arc(W*.45,H*.5,R,0,7);x.fill();
  put(x,S.text,hf(f),W/2,m*1.3,W-2*m,H-m*3.9,{max:84*u,min:30*u,col:c.fg,al:"center"});
  foot(x,W/2,H-m*.8,"center",c.fg,u,1)}},
{n:"আলপনা বর্ডার",ty:["bangladesh"],f:[F.ns,F.nb],
 p:[["#fbf3e0","#1b2b22","#c8102e"],["#0f3d2e","#f7efd9","#e7b94a"],["#ffffff","#14201a","#006a4e"]],
 d(x,W,H,u,c,f){const m=64*u,s=44*u,dia=(cx,cy,r,col)=>{x.fillStyle=col;x.beginPath();x.moveTo(cx,cy-r);x.lineTo(cx+r,cy);x.lineTo(cx,cy+r);x.lineTo(cx-r,cy);x.closePath();x.fill()};
  for(let i=0;i*s<W;i++){const col=i%2?c.fg:c.ac;dia(i*s+s/2,s/2+m*.3,s*.3,col);dia(i*s+s/2,H-s/2-m*.3,s*.3,col)}
  x.fillStyle=c.ac;x.fillRect(0,m*.3+s+8*u,W,3*u);x.fillRect(0,H-m*.3-s-11*u,W,3*u);
  put(x,S.text,hf(f),W/2,m*2.2,W-3*m,H-m*5.8,{max:66*u,min:28*u,col:c.fg,al:"center",lh:1.5});
  authorLine(x,"— ",W/2,H-m*2.9,"center",c.ac,u,f);
  foot(x,W/2,H-m*1.9,"center",c.fg,u)}},
{n:"সূর্যোদয় (বাংলাদেশ)",ty:["bangladesh"],f:[F.ab,F.nb],
 p:[["#12100f","#ffffff","#e63946"],["#0a2a1f","#f6efd9","#f42a41"],["#1a1423","#ffffff","#ff7a3d"]],
 d(x,W,H,u,c,f){const m=64*u,cx=W/2,R=Math.min(W*.3,H*.28),cy=H*1.02;
  x.save();x.strokeStyle=c.ac;x.globalAlpha=.35;x.lineWidth=3*u;
  for(let a=0;a<=12;a++){const t=Math.PI+a*Math.PI/12;x.beginPath();x.moveTo(cx+Math.cos(t)*R*1.15,cy+Math.sin(t)*R*1.15);x.lineTo(cx+Math.cos(t)*R*2.2,cy+Math.sin(t)*R*2.2);x.stroke()}
  x.restore();
  x.fillStyle=c.ac;x.beginPath();x.arc(cx,cy,R,0,7);x.fill();
  put(x,S.text,hf(f),cx,m*1.1,W-2*m,H*.5-m,{max:80*u,min:30*u,col:c.fg,al:"center"});
  foot(x,cx,H-m*.8,"center",ink(c.ac),u,1)}},
{n:"জাতীয় মিনিমাল",ty:["bangladesh"],f:[F.nb,F.nb],
 p:[["#ffffff","#10201a","#006a4e"],["#f6f9f7","#10201a","#f42a41"],["#10201a","#f4f7f5","#2fc08f"]],
 d(x,W,H,u,c,f){const m=64*u,fw=76*u,fh=46*u;
  x.fillStyle=c.ac;x.fillRect(0,0,W,16*u);
  x.fillStyle="#006a4e";x.fillRect(m,m,fw,fh);x.fillStyle="#f42a41";x.beginPath();x.arc(m+fw*.45,m+fh/2,fh*.28,0,7);x.fill();
  x.font=`700 ${28*u}px "${F.hs}"`;x.fillStyle=c.fg;x.textAlign="left";x.textBaseline="middle";x.fillText(S.cat||"বাংলাদেশ",m+fw+20*u,m+fh/2);
  put(x,S.text,hf(f),m,m*2.3,W-2*m,H-m*4.6,{max:78*u,min:30*u,col:c.fg,va:"top"});
  x.fillStyle=c.ac;x.fillRect(m,H-m*1.75,W-2*m,3*u);
  foot(x,m,H-m*.85,"left",c.fg,u,1)}},
// ===== স্বয়ংক্রিয় টাইপোগ্রাফি স্টাইল (কম্পোজার-চালিত) =====
{n:"ব্লক লকআপ",ty:["typography"],f:[F.bd,F.nb],
 p:[["#ffb914","#1a1210","#e8141c"],["#f2efe6","#111111","#d7191f"],["#e4d8c0","#1b1b1b","#b23a1e"]],
 d(x,W,H,u,c,f){const m=64*u,r=rnd(3);x.save();x.strokeStyle=c.fg;x.globalAlpha=.05;x.lineWidth=2*u;for(let j=0;j<H;j+=6*u){x.beginPath();x.moveTo(0,j);x.lineTo(W,j+r()*3*u)}x.stroke();x.restore();
  [[.2,.08,16],[.78,.1,12],[.88,.05,9]].forEach(b=>bird(x,W*b[0],H*b[1],b[2]*u,c.fg));
  const t=compose(x,S.text,{X:m,Y:H*.1,W:W-2*m,H:H*.68},{fonts:["heavy"],lh:.9,fat:.02,vary:1.35,max:210},c,u,useF(f));
  const ly=t.y0+t.tot;swash(x,W*.3,W*.7,ly+22*u,c.fg,u);
  subTxt(x,S.sub,W/2,ly+78*u,W-2*m,c.fg,u,f);
  authorLine(x,"— ",W/2,H-m*1.4,"center",c.fg,u,f);foot(x,W/2,H-m*.6,"center",c.fg,u)}},
{n:"স্টেগার্ড আলো",ty:["typography"],f:[F.mn,F.nb],
 p:[["#0f2a33","#ffffff","#f0a030"],["#1a1f3a","#f4f4ff","#ff7a59"],["#10261f","#f1fff6","#ffcf4a"]],
 d(x,W,H,u,c,f){const m=64*u,r=rnd(7);const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,mix(c.bg,"#ffffff",.08));g.addColorStop(1,mix(c.bg,"#000000",.5));x.fillStyle=g;x.fillRect(0,0,W,H);
  x.save();x.strokeStyle=c.fg;x.globalAlpha=.1;x.lineWidth=1.5*u;for(let i=0;i<200;i++){const a=r()*W,b=r()*H,l=(30+r()*50)*u;x.beginPath();x.moveTo(a,b);x.lineTo(a-l*.12,b+l);x.stroke()}x.restore();
  const gl=x.createRadialGradient(W*.76,H*.4,10*u,W*.76,H*.4,W*.5);gl.addColorStop(0,hexA(c.ac,.4));gl.addColorStop(1,hexA(c.ac,0));x.fillStyle=gl;x.fillRect(0,0,W,H);
  const t=compose(x,S.text,{X:m*1.3,Y:H*.14,W:W*.58,H:H*.64},{fonts:["mina"],al:"stag",stag:true,rest:.78,lh:.86,vary:1.7,max:190,fat:.012,jit:1.2},c,u,useF(f));
  const e=t.meta.find(q=>q.e);if(e){x.strokeStyle=c.ac;x.lineWidth=9*u;x.lineCap="round";x.beginPath();x.arc(e.cx+e.dw*.1,e.cy,e.s*.95,-1.2,.9);x.stroke()}
  subTxt(x,S.sub,m*1.3,t.y0+t.tot+60*u,W*.6,c.fg,u,f,"left");
  authorLine(x,"— ",m*1.3,H-m*1.3,"left",c.fg,u,f);foot(x,m*1.3,H-m*.6,"left",c.fg,u)}},
{n:"৩ডি ব্লক",ty:["typography"],f:[F.nb,F.nb],
 p:[["#0b0708","#ffffff","#8e1b2d"],["#050b1c","#ffffff","#1e4fd8"],["#08150f","#ffffff","#1a8a5a"]],
 d(x,W,H,u,c,f){const m=64*u;const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,c.bg);g.addColorStop(.35,c.bg);g.addColorStop(1,c.ac);x.fillStyle=g;x.fillRect(0,0,W,H);
  const t=compose(x,S.text,{X:W*.1,Y:H*.1,W:W*.8,H:H*.62},{fonts:["black"],lh:.84,vary:1.3,max:210,emph:false,auto:false,col:c.fg,fill:1,sh:{n:14,dx:1.9,dy:1.9,col:k=>`rgba(0,0,0,${.05+k*.012})`}},c,u,useF(f));
  subTxt(x,S.sub,W/2,t.y0+t.tot+64*u,W-2*m,c.fg,u,f,"center",32);
  authorLine(x,"— ",W/2,H-m*1.4,"center",c.fg,u,f);foot(x,W/2,H-m*.6,"center",c.fg,u)}},
{n:"গ্রেডিয়েন্ট ফুল",ty:["typography"],f:[F.bd,F.nb],
 p:[["#2a1458","#ffffff","#f5c26b"],["#0e2a47","#ffffff","#5ad1c4"],["#4a0f2e","#ffffff","#ff9f7a"]],
 d(x,W,H,u,c,f){const m=64*u,r=rnd(13);const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,mix(c.bg,"#000000",.25));g.addColorStop(.6,c.bg);g.addColorStop(1,mix(c.bg,"#ffffff",.18));x.fillStyle=g;x.fillRect(0,0,W,H);
  for(let i=0;i<30;i++){const bx=r()*W,by=r()*H,br=(8+r()*30)*u;x.fillStyle="rgba(255,255,255,.05)";x.beginPath();x.arc(bx,by,br,0,7);x.fill();x.strokeStyle="rgba(255,255,255,.18)";x.lineWidth=1.5*u;x.stroke()}
  x.save();x.translate(W*.12,H*.1);for(let i=0;i<9;i++){x.rotate(Math.PI*2/9);x.fillStyle="rgba(235,230,220,.92)";x.beginPath();x.ellipse(0,-40*u,13*u,38*u,0,0,7);x.fill()}x.fillStyle=c.ac;x.beginPath();x.arc(0,0,14*u,0,7);x.fill();x.restore();
  let top=H*.2;if(S.sub){x.font=`500 ${42*u}px "${f[1]}"`;x.fillStyle=c.fg;x.textAlign="center";x.textBaseline="middle";wrap(x,S.sub,W*.6).slice(0,2).forEach((l,i)=>x.fillText(l,W/2,H*.12+i*56*u));top=H*.25}
  compose(x,S.text,{X:W*.12,Y:top,W:W*.76,H:H*.74-top},{fonts:["heavy","brush"],lh:.9,vary:1.4,max:200,grad:[c.ac,mix(c.fg,"#4aa3e8",.55)],emph:false,auto:false,fat:.015},c,u,useF(f));
  authorLine(x,"— ",W/2,H-m*1.4,"center",c.fg,u,f);foot(x,W/2,H-m*.6,"center",c.fg,u)}},
{n:"ক্যালিগ্রাফি কালি",ty:["typography"],f:[F.gl,F.nb],
 p:[["#ecebe6","#ee4036","#2e2e2e"],["#f6f1e4","#ffd34d","#1d2a44"],["#e8efe9","#ffffff","#0a7d5a"]],
 d(x,W,H,u,c,f){const m=64*u,r=rnd(3),cx=W/2,cy=H*.44,R=Math.min(W,H)*.38,N=48;
  x.fillStyle=c.ac;x.beginPath();for(let i=0;i<N;i++){const a=i/N*Math.PI*2,k=(i%3===0?1.1:.9)+r()*.12;x.lineTo(cx+Math.cos(a)*R*k*1.1,cy+Math.sin(a)*R*k*.9)}x.closePath();x.fill();
  for(let i=0;i<14;i++){const a=r()*7,d=R*(1.15+r()*.3);x.beginPath();x.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d,(3+r()*8)*u,0,7);x.fill()}
  const t=compose(x,S.text,{X:cx-R*.78,Y:cy-R*.62,W:R*1.56,H:R*1.24},{fonts:["cal"],lh:.95,vary:1.45,max:170,jit:3,sh:{n:3,dx:1,dy:1.2,col:k=>"rgba(0,0,0,.6)"},auto:false,emphCol:c.fg,col:c.fg},c,u,useF(f));
  subTxt(x,S.sub,W/2,H*.86,W-2*m,c.ac,u,f);
  authorLine(x,"— ",W/2,H-m*1.4,"center",c.ac,u,f);foot(x,W/2,H-m*.6,"center",c.ac,u)}},
{n:"মিক্সড ফন্ট",ty:["typography"],f:[F.bd,F.nb],
 p:[["#ffffff","#111111","#d7191f"],["#f4efe3","#1b1b1b","#0a7d5a"],["#fff4d6","#2a1a0a","#e8590c"]],
 d(x,W,H,u,c,f){const m=64*u;
  const t=compose(x,S.text,{X:W*.12,Y:H*.1,W:W*.76,H:H*.62},{fonts:["heavy","brush","cal","mina","black"],lh:.92,vary:1.5,max:200,jit:1.6,fat:.012},c,u,useF(f));
  const ly=t.y0+t.tot;x.strokeStyle=c.fg;x.lineCap="round";x.lineWidth=9*u;x.beginPath();x.moveTo(W*.3,ly+30*u);x.quadraticCurveTo(W*.5,ly+8*u,W*.72,ly+28*u);x.stroke();
  subTxt(x,S.sub,W/2,ly+90*u,W-2*m,c.fg,u,f);
  authorLine(x,"— ",W/2,H-m*1.4,"center",c.ac,u,f);foot(x,W/2,H-m*.6,"center",c.fg,u)}},
{n:"সিঁড়ি সূর্য",ty:["typography"],f:[F.at,F.nb],
 p:[["#fbb727","#141010","#e8141c"],["#f4efe6","#141010","#d90429"],["#1b2b4b","#fff4d6","#ff4d4d"]],
 d(x,W,H,u,c,f){const m=64*u,r=rnd(11),dk=lum(c.bg)<.3?"#0a1020":"#111";
  x.fillStyle=c.ac;x.beginPath();x.arc(W*.36,H*.36,Math.min(W,H)*.26,0,7);x.fill();
  x.strokeStyle=dk;x.lineWidth=3*u;x.beginPath();x.moveTo(0,H*.26);x.lineTo(W,H*.26);x.stroke();x.fillStyle=dk;for(let i=0;i<13;i++){x.beginPath();x.ellipse(r()*W,H*.26+14*u,5*u,15*u,0,0,7);x.fill()}
  for(let i=0;i<6;i++)bird(x,r()*W,H*(.04+r()*.14),(12+r()*10)*u,dk);
  const t=compose(x,S.text,{X:m,Y:H*.3,W:W-2*m,H:H*.46},{fonts:["brush"],al:"stair",stag:true,rest:.7,lh:.95,vary:1.4,max:150,rot:2.5,fat:.03,emph:false,auto:false},c,u,useF(f));
  subTxt(x,S.sub,W/2,t.y0+t.tot+56*u,W-2*m,c.fg,u,f);
  authorLine(x,"— ",W/2,H-m*1.4,"center",c.fg,u,f);foot(x,W/2,H-m*.6,"center",c.fg,u)}},
{n:"আউটলাইন নিয়ন",ty:["typography"],f:[F.nb,F.nb],
 p:[["#0a0a0a","#f4efe0","#ffd23f"],["#0b1220","#e8f0ff","#6fd0ff"],["#120a0a","#fbe9e0","#ff6b4a"]],
 d(x,W,H,u,c,f){const m=64*u,r=rnd(17);x.fillStyle=c.fg;for(let i=0;i<60;i++){x.globalAlpha=.12+r()*.35;x.beginPath();x.arc(r()*W,r()*H,(1+r()*2)*u,0,7);x.fill()}x.globalAlpha=1;
  const t=compose(x,S.text,{X:W*.1,Y:H*.1,W:W*.8,H:H*.64},{fonts:["black","heavy"],lh:.9,vary:1.4,max:200,alt:true,fat:.0},c,u,useF(f));
  x.strokeStyle=c.ac;x.lineWidth=5*u;x.lineCap="round";x.beginPath();x.moveTo(W*.4,t.y0+t.tot+26*u);x.lineTo(W*.6,t.y0+t.tot+26*u);x.stroke();
  subTxt(x,S.sub,W/2,t.y0+t.tot+78*u,W-2*m,c.fg,u,f);
  authorLine(x,"— ",W/2,H-m*1.4,"center",c.fg,u,f);foot(x,W/2,H-m*.6,"center",c.fg,u)}},
{n:"বর্ণমালা",ty:["typography"],f:[F.ns,F.nb],
 p:[["#fdf6ea","#1c1713","#b3261e"],["#0e2a22","#f7f1de","#e6b84a"],["#f3f6ff","#10183a","#2f4cdd"]],
 d(x,W,H,u,c,f){const m=64*u,ch=(S.text.match(/[অ-হ]/)||["অ"])[0];
  x.save();x.globalAlpha=.14;x.fillStyle=c.ac;x.font=`700 ${Math.min(W,H)*1.15}px "${F.ns}"`;x.textAlign="center";x.textBaseline="middle";x.fillText(ch,W*.62,H*.55);x.restore();
  put(x,S.text,hf(f),m,m*1.2,W-2*m,H-m*3.8,{max:84*u,min:30*u,col:c.fg});
  authorLine(x,"— ",m,H-m*2,"left",c.ac,u,f);
  foot(x,m,H-m*.8,"left",c.fg,u)}},
{n:"বইয়ের মলাট",ty:["poetry"],f:[F.ns,F.nb],
 p:[["#f7f1e3","#241a12","#7a1f1f"],["#1b2a3a","#f4ead3","#c9a24a"],["#e9efe6","#1b2b1f","#2e6b4a"]],
 d(x,W,H,u,c,f){const m=64*u,sp=110*u,lx=sp+m,lw=W-lx-m,ly=m,lh=H-2*m;
  x.fillStyle=c.ac;x.fillRect(0,0,sp,H);x.fillStyle="rgba(0,0,0,.18)";x.fillRect(sp-8*u,0,8*u,H);
  x.strokeStyle=c.ac;x.lineWidth=3*u;x.strokeRect(lx,ly,lw,lh);x.lineWidth=1*u;x.strokeRect(lx+12*u,ly+12*u,lw-24*u,lh-24*u);
  put(x,S.text,hf(f),lx+lw/2,ly+m*.9,lw-1.8*m,lh-m*3.4,{max:62*u,min:26*u,col:c.fg,al:"center",lh:1.55});
  authorLine(x,"",lx+lw/2,ly+lh-m*1.75,"center",c.ac,u,f);
  foot(x,lx+lw/2,ly+lh-m*.85,"center",c.fg,u)}},
{n:"কীওয়ার্ড কার্ড",ty:["typography"],f:[F.ns,F.nb],
 p:[["#0b3d2e","#f6f0dd","#ffcf4a"],["#faf6ef","#1d1b19","#c1121f"],["#111827","#f3f4f6","#34d399"]],
 d(x,W,H,u,c,f){const m=64*u,ws=S.text.replace(/\s+/g," ").trim().split(" "),kw=(ws.length>1?ws.pop():ws[0]).replace(/[।,.!?]+$/,""),rest=ws.length&&ws.join(" ")!==kw?ws.join(" "):"";
  const r=put(x,kw,hf(f),W/2,m*1.2,W-2*m,H*.38,{max:170*u,min:60*u,col:c.ac,al:"center",lh:1.2});
  const ry=r.y+r.tot+24*u;x.fillStyle=c.fg;x.fillRect(W/2-50*u,ry,100*u,4*u);
  if(rest)put(x,rest,bf(f),W/2,ry+32*u,W-3*m,H-ry-32*u-m*2.6,{max:46*u,min:22*u,col:c.fg,al:"center",va:"top",lh:1.5});
  authorLine(x,"— ",W/2,H-m*1.75,"center",c.fg,u,f);
  foot(x,W/2,H-m*.8,"center",c.fg,u)}},
{n:"ম্যাগাজিন মাস্টহেড",ty:["news"],f:[F.ns,F.nb],
 p:[["#f5f1e8","#14110f","#b5121b"],["#ffffff","#101010","#0057b8"],["#15171c","#f4f1ea","#e2b13c"]],
 d(x,W,H,u,c,f){const m=64*u,t0=m*.7;
  x.fillStyle=c.fg;x.fillRect(m,t0,W-2*m,3*u);
  x.font=`700 ${Math.min(76*u,W*.1)}px "${F.ns}"`;x.textAlign="center";x.textBaseline="middle";x.fillText(S.page||S.cat||"সংবাদপত্র",W/2,t0+58*u);
  x.fillRect(m,t0+104*u,W-2*m,3*u);
  x.font=`500 ${22*u}px "${F.hs}"`;x.fillText([S.dt,S.cat].filter(Boolean).join("   |   "),W/2,t0+136*u);
  const iy=t0+170*u,ih=H*(W/H>1.5?.26:.34);
  if(S.img)cover(x,S.img,m,iy,W-2*m,ih);else{x.fillStyle=c.ac;x.fillRect(m,iy,W-2*m,ih);dots(x,m,iy,W-2*m,ih,u,c.bg,.22)}
  const ty=iy+ih+28*u;
  put(x,S.text,hf(f),m,ty,W-2*m,H-ty-m*1.7,{max:64*u,min:26*u,col:c.fg,va:"top"});
  authorLine(x,"লিখেছেন ",m,H-m*.85,"left",c.fg,u,f);
  if(src()){x.font=`500 ${22*u}px "${F.hs}"`;x.fillStyle=c.fg;x.textAlign="right";x.textBaseline="middle";x.fillText(src(),W-m,H-m*.85)}}},
{n:"ডেটলাইন",ty:["news"],f:[F.nb,F.nb],
 p:[["#ffffff","#111317","#e63946"],["#f4f1ea","#14110f","#0a7d5a"],["#0e1116","#f4f4f4","#ffb703"]],
 d(x,W,H,u,c,f){const m=64*u,bw=W*.3;
  x.fillStyle=c.ac;x.fillRect(0,0,bw,H);x.textAlign="center";x.textBaseline="middle";x.fillStyle=ink(c.ac);
  if(S.dt){const p=S.dt.split(" "),rest=p.slice(1).join(" ");x.font=`700 ${Math.min(bw*.55,160*u)}px "${F.ab}"`;x.fillText(p[0],bw/2,H*.38);x.font=`600 ${32*u}px "${F.hs}"`;wrap(x,rest,bw-m).forEach((l,i)=>x.fillText(l,bw/2,H*.38+90*u+i*44*u))}
  else{x.font=`700 ${40*u}px "${F.hs}"`;wrap(x,S.cat||"আপডেট",bw-m).forEach((l,i)=>x.fillText(l,bw/2,H*.4+i*52*u))}
  const L=bw+m*.9,w=W-L-m;
  if(S.dt&&S.cat)chip(x,S.cat,L,m,u,c.fg,ink(c.fg));
  put(x,S.text,hf(f),L,m*2.2,w,H-m*4.4,{max:76*u,min:30*u,col:c.fg});
  foot(x,L,H-m*.8,"left",c.fg,u,1,1)}},
{n:"কর্পোরেট ধাপ",ty:["business"],f:[F.nb,F.nb],
 p:[["#ffffff","#0b2545","#1d6fdc"],["#f4f6f8","#1f2933","#0f9d8a"],["#0b132b","#f1f5f9","#6c8cff"]],
 d(x,W,H,u,c,f){const m=64*u,bh=84*u;
  x.fillStyle=c.fg;x.fillRect(0,0,W,bh);x.textBaseline="middle";x.fillStyle=c.bg;
  x.textAlign="left";x.font=`700 ${30*u}px "${F.hs}"`;x.fillText(S.cat||"কর্পোরেট আপডেট",m,bh/2);
  x.textAlign="right";x.font=`500 ${24*u}px "${F.hs}"`;x.fillText(S.dt||"",W-m,bh/2);
  x.save();x.fillStyle=c.ac;for(let i=0;i<3;i++){x.globalAlpha=.25+.25*i;x.fillRect(W-(3-i)*W*.1,H-(3-i)*H*.14,(3-i)*W*.1,(3-i)*H*.14)}x.restore();
  put(x,S.text,hf(f),m,bh+m*.8,W*.66,H-bh-m*3.2,{max:72*u,min:28*u,col:c.fg,va:"top"});
  x.fillStyle=c.ac;x.fillRect(m,H-m*1.7,W*.12,6*u);
  foot(x,m,H-m*.8,"left",c.fg,u,1,1)}},
{n:"প্রোডাক্ট ঘোষণা",ty:["business"],f:[F.ab,F.nb],
 p:[["#ffffff","#101828","#ff5a36"],["#f3f0ff","#1e1b4b","#6d4aff"],["#fff7e6","#2a1d0a","#0a7d5a"]],
 d(x,W,H,u,c,f){const m=64*u,iw=W*.42;
  if(S.img)cover(x,S.img,0,0,iw,H);else{x.fillStyle=c.ac;x.fillRect(0,0,iw,H);dots(x,0,0,iw,H,u,c.bg,.25)}
  const L=iw+m*.9,w=W-L-m;
  chip(x,S.cat||"নতুন",L,m,u,c.ac,ink(c.ac));
  const r=put(x,S.text,hf(f),L,m*2.1,w,H*.42,{max:68*u,min:28*u,col:c.fg,va:"top"});
  if(S.sub)put(x,S.sub,bf(f),L,r.y+r.tot+18*u,w,H*.2,{max:32*u,min:20*u,col:c.fg,va:"top",lh:1.5});
  const t=src()||S.page||"";
  if(t){x.font=`700 ${28*u}px "${F.hs}"`;const tw=x.measureText(t).width+56*u,py=H-m*1.9;x.fillStyle=c.fg;x.beginPath();x.roundRect?x.roundRect(L,py,tw,60*u,30*u):x.rect(L,py,tw,60*u);x.fill();x.fillStyle=c.bg;x.textAlign="left";x.textBaseline="middle";x.fillText(t,L+28*u,py+31*u)}
  if(S.dt){x.font=`500 ${24*u}px "${F.hs}"`;x.fillStyle=c.fg;x.textAlign="left";x.textBaseline="middle";x.fillText(S.dt,L,H-m*.75)}}},
{n:"স্টার্টআপ গ্রিড",ty:["business"],f:[F.nb,F.nb],
 p:[["#0d1321","#f0ebd8","#ee6c4d"],["#101828","#f2f4f7","#ff7a59"],["#0f172a","#e2e8f0","#38bdf8"]],
 d(x,W,H,u,c,f){const m=64*u,s=72*u;
  x.save();x.strokeStyle=c.fg;x.globalAlpha=.1;x.lineWidth=1.5*u;
  for(let i=0;i<W;i+=s){x.beginPath();x.moveTo(i,0);x.lineTo(i,H);x.stroke()}
  for(let j=0;j<H;j+=s){x.beginPath();x.moveTo(0,j);x.lineTo(W,j);x.stroke()}x.restore();
  chip(x,S.cat||"আপডেট",m,m,u,c.ac,ink(c.ac));
  if(S.dt){x.font=`500 ${26*u}px "${F.hs}"`;x.fillStyle=c.fg;x.textAlign="right";x.textBaseline="middle";x.fillText(S.dt,W-m,m+23*u)}
  put(x,S.text,hf(f),m,H*.25,W-2*m,H*.5,{max:88*u,min:30*u,col:c.fg,va:"bot"});
  x.fillStyle=c.ac;x.fillRect(m,H*.77,W*.2,10*u);
  foot(x,m,H-m*.8,"left",c.fg,u,1,1)}},
{n:"নিও-কার্ড",ty:["quote"],f:[F.ab,F.nb],
 p:[["#ffd23f","#111111","#e63946"],["#ff8fa3","#111111","#3a2fe0"],["#7bdcb5","#111111","#ff6b35"]],
 d(x,W,H,u,c,f){const m=64*u,o=18*u,ix=m*1.7,iw=W-2*m-m*1.4;
  x.fillStyle="#111";x.fillRect(m+o,m+o,W-2*m,H-2*m);x.fillStyle="#fffaf0";x.fillRect(m,m,W-2*m,H-2*m);
  x.strokeStyle="#111";x.lineWidth=5*u;x.strokeRect(m,m,W-2*m,H-2*m);
  x.fillStyle=c.ac;x.fillRect(ix,m+m*.5,110*u,14*u);
  put(x,S.text,hf(f),ix,m+m*1.1,iw,H-2*m-m*3.2,{max:70*u,min:28*u,col:"#111"});
  authorLine(x,"— ",ix,H-m*2.45,"left","#111",u,f);
  foot(x,ix,H-m*1.6,"left","#111",u)}},
{n:"ভোরের গ্রেডিয়েন্ট",ty:["quote"],f:[F.ab,F.nb],
 p:[["#1b1464","#ffffff","#ff7e5f"],["#0f2027","#ffffff","#f7971e"],["#2b0a3d","#ffffff","#ff5e98"]],
 d(x,W,H,u,c,f){const m=64*u,R=Math.min(W,H)*.2,g=x.createLinearGradient(0,0,0,H);
  g.addColorStop(0,c.bg);g.addColorStop(1,c.ac);x.fillStyle=g;x.fillRect(0,0,W,H);
  x.fillStyle="rgba(255,255,255,.1)";x.beginPath();x.arc(W/2,H*.62,R*1.55,0,7);x.fill();
  x.fillStyle="rgba(255,255,255,.22)";x.beginPath();x.arc(W/2,H*.62,R,0,7);x.fill();
  put(x,S.text,hf(f),W/2,m,W-2.4*m,H*.5,{max:72*u,min:28*u,col:"#fff",al:"center"});
  authorLine(x,"— ",W/2,H-m*1.8,"center","#fff",u,f);
  foot(x,W/2,H-m*.8,"center","#fff",u)}},
// ===== রেফারেন্স পোস্টার-ধাঁচের টাইপোগ্রাফি টেমপ্লেট =====
{n:"বৃষ্টির লণ্ঠন",ty:["typography"],f:[F.gl,F.nb],
 p:[["#0f2a33","#ffffff","#f0a030"],["#1a1f3a","#f4f4ff","#ff7a59"],["#10261f","#f1fff6","#ffcf4a"]],
 d(x,W,H,u,c,f){const m=64*u,r=rnd(7),ff=hf(f),ls=lines(S.text);
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,mix(c.bg,"#ffffff",.08));g.addColorStop(1,mix(c.bg,"#000000",.55));x.fillStyle=g;x.fillRect(0,0,W,H);
  x.save();x.strokeStyle=c.fg;x.globalAlpha=.12;x.lineWidth=1.6*u;for(let i=0;i<260;i++){const a=r()*W,b=r()*H,l=(30+r()*50)*u;x.beginPath();x.moveTo(a,b);x.lineTo(a-l*.12,b+l);x.stroke()}x.restore();
  x.fillStyle=mix(c.bg,"#000000",.7);x.fillRect(0,H*.88,W,H*.12);
  const lx=W*.68,ly=H*.33,px=W*.86;
  x.fillStyle="#2b1d14";x.fillRect(px-20*u,H*.2,40*u,H*.7);
  x.strokeStyle="#2b1d14";x.lineWidth=10*u;x.beginPath();x.moveTo(px,H*.23);x.lineTo(lx,H*.23);x.stroke();
  x.lineWidth=3*u;x.strokeStyle="#9aa";x.beginPath();x.moveTo(lx,H*.23);x.lineTo(lx,ly-40*u);x.stroke();
  const gl=x.createRadialGradient(lx,ly+10*u,5*u,lx,ly+10*u,260*u);gl.addColorStop(0,hexA(c.ac,.55));gl.addColorStop(1,hexA(c.ac,0));x.fillStyle=gl;x.fillRect(0,0,W,H);
  x.fillStyle="#1d1712";x.fillRect(lx-34*u,ly-38*u,68*u,12*u);x.fillRect(lx-34*u,ly+52*u,68*u,12*u);
  x.fillStyle=c.ac;x.fillRect(lx-26*u,ly-26*u,52*u,78*u);
  x.fillStyle=hexA(c.ac,.35);x.beginPath();x.ellipse(W*.5,H*.93,W*.4,18*u,0,0,7);x.fill();
  let ai=0;ls.forEach((l,i)=>{if(l.length<ls[ai].length)ai=i});
  stack(x,ls,ff,m*1.2,H*.2,W*.52,H*.52,{al:"left",max:150*u,vary:1.7,lh:1.15,fn:(x,l,X,Y,s,i)=>{x.fillStyle=i===ai&&ls.length>1?c.ac:c.fg;x.fillText(l,X,Y)}});
  authorLine(x,"— ",m*1.2,H*.8,"left",c.fg,u,f);foot(x,m*1.2,H*.94,"left",c.fg,u)}},
{n:"হলুদ নির্জনতা",ty:["typography"],f:[F.bd,F.nb],
 p:[["#ffb914","#2a2220","#7b5545"],["#f2e3c6","#1f1a17","#b5532f"],["#9ed8db","#10303a","#0a4f66"]],
 d(x,W,H,u,c,f){const m=64*u,ls=lines(S.text);
  x.fillStyle=c.fg;[[.4,.1,16],[.52,.085,10],[.7,.15,12]].forEach(b=>bird(x,W*b[0],H*b[1],b[2]*u,c.fg));
  const r=stack(x,ls,hf(f),W*.2,H*.13,W*.6,H*.42,{max:130*u,vary:1.3,col:c.fg,lh:1.1});
  if(S.sub){x.font=`700 ${34*u}px "${f[1]}"`;x.fillStyle=c.fg;x.textAlign="center";x.textBaseline="middle";x.fillText(S.sub,W/2,r.y0+r.tot+44*u,W-2*m)}
  x.fillStyle=mix(c.bg,"#ffffff",.3);x.beginPath();x.ellipse(W/2,H*1.12,W*.85,H*.36,0,0,7);x.fill();
  const by=H*.9;x.fillStyle=c.ac;x.strokeStyle=c.ac;
  x.fillRect(W*.24,by-90*u,W*.44,10*u);x.fillRect(W*.24,by-60*u,W*.44,8*u);x.fillRect(W*.24,by-30*u,W*.44,8*u);x.fillRect(W*.25,by-90*u,8*u,120*u);x.fillRect(W*.67,by-90*u,8*u,120*u);
  x.beginPath();x.arc(W*.38,by-170*u,34*u,0,7);x.fill();x.beginPath();x.moveTo(W*.31,by-110*u);x.quadraticCurveTo(W*.38,by-155*u,W*.45,by-110*u);x.lineTo(W*.45,by);x.lineTo(W*.31,by);x.fill();
  x.lineWidth=5*u;[W*.62,W*.8].forEach(cx=>{x.beginPath();x.arc(cx,by-20*u,64*u,0,7);x.stroke()});x.beginPath();x.moveTo(W*.62,by-20*u);x.lineTo(W*.69,by-110*u);x.lineTo(W*.8,by-20*u);x.moveTo(W*.69,by-110*u);x.lineTo(W*.77,by-130*u);x.stroke();
  authorLine(x,"— ",W/2,H*.64,"center",c.fg,u,f);foot(x,W/2,H-m*.5,"center",c.fg,u)}},
{n:"লাল সূর্য",ty:["typography"],f:[F.at,F.nb],
 p:[["#fbb727","#141010","#e8141c"],["#f4efe6","#141010","#d90429"],["#1b2b4b","#fff4d6","#ff4d4d"]],
 d(x,W,H,u,c,f){const m=64*u,r=rnd(11),R=Math.min(W,H)*.25,cx=W/2,cy=H*.38,wy=H*.3,ls=lines(S.text);
  x.save();x.strokeStyle=c.fg;x.globalAlpha=.05;x.lineWidth=2*u;for(let j=0;j<H;j+=6*u){x.beginPath();x.moveTo(0,j);x.lineTo(W,j+r()*3*u);x.stroke()}x.restore();
  x.fillStyle=c.ac;x.beginPath();x.arc(cx,cy,R,0,7);x.fill();
  const dk=c.bg==="#1b2b4b"?"#0a1020":"#111";
  x.strokeStyle=dk;x.lineWidth=3*u;x.beginPath();x.moveTo(0,wy);x.lineTo(W,wy);x.stroke();
  x.fillStyle=dk;for(let i=0;i<14;i++){const bx=r()*W;x.beginPath();x.ellipse(bx,wy+14*u,5*u,15*u,0,0,7);x.fill()}
  for(let i=0;i<6;i++)bird(x,r()*W,H*(.04+r()*.15),(12+r()*10)*u,dk);
  const t=stack(x,ls,hf(f),W*.27,H*.36,W*.46,H*.4,{max:130*u,vary:1.3,col:c.fg,lh:1.12});
  if(S.sub){x.font=`700 ${36*u}px "${f[1]}"`;x.fillStyle=c.fg;x.textAlign="center";x.textBaseline="middle";x.fillText(S.sub,W/2,t.y0+t.tot+46*u,W-2*m)}
  authorLine(x,"— ",W/2,H-m*1.5,"center",c.fg,u,f);foot(x,W/2,H-m*.6,"center",c.fg,u)}},
{n:"কালির ছোপ",ty:["typography"],f:[F.gl,F.nb],
 p:[["#ecebe6","#ee4036","#2e2e2e"],["#f6f1e4","#ffd34d","#1d2a44"],["#e8efe9","#ffffff","#0a7d5a"]],
 d(x,W,H,u,c,f){const m=64*u,r=rnd(3),R=Math.min(W,H)*.26,cx=W/2,cy=H*.4,N=44,ls=lines(S.text);
  x.save();x.globalAlpha=.05;for(let i=0;i<500;i++){x.fillStyle=r()>.5?"#000":"#fff";x.fillRect(r()*W,r()*H,2*u,2*u)}x.restore();
  x.fillStyle=c.ac;x.beginPath();for(let i=0;i<N;i++){const a=i/N*Math.PI*2,k=(i%3===0?1.15:.88)+r()*.14;x.lineTo(cx+Math.cos(a)*R*k,cy+Math.sin(a)*R*k*.95)}x.closePath();x.fill();
  for(let i=0;i<14;i++){const a=r()*7,d=R*(1.1+r()*.3);x.beginPath();x.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d,(3+r()*8)*u,0,7);x.fill()}
  stack(x,ls,hf(f),cx-R*.6,cy-R*.5,R*1.2,R*1.0,{max:120*u,vary:1.3,lh:1.12,fn:(x,l,X,Y,s)=>{x.fillStyle="rgba(0,0,0,.75)";x.fillText(l,X+3*u,Y+3*u);x.fillStyle=c.fg;x.fillText(l,X,Y)}});
  x.save();x.translate(W*.5,H*.8);x.rotate(2.7);x.fillStyle=c.ac;x.strokeStyle=c.ac;x.lineCap="round";x.beginPath();x.ellipse(0,0,22*u,44*u,0,0,7);x.fill();x.beginPath();x.arc(0,-62*u,17*u,0,7);x.fill();x.lineWidth=11*u;
  [[-18,-20,-60,-45],[18,-20,52,-58],[-10,38,-30,95],[10,38,40,88]].forEach(l=>{x.beginPath();x.moveTo(l[0]*u,l[1]*u);x.lineTo(l[2]*u,l[3]*u);x.stroke()});x.restore();
  authorLine(x,"— ",W/2,H-m*1.4,"center",c.ac,u,f);foot(x,W/2,H-m*.6,"center",c.ac,u)}},
{n:"শেষ ট্রেন",ty:["typography"],f:[F.bd,F.nb],
 p:[["#9a9a9a","#111111","#e9e6dc"],["#6b4f3a","#1a120c","#f1e4cb"],["#4d5d6a","#101820","#e4ecee"]],
 d(x,W,H,u,c,f){const m=64*u,r=rnd(5),ls=lines(S.text);
  x.save();x.strokeStyle=c.fg;x.globalAlpha=.07;x.lineWidth=2*u;for(let i=0;i<W;i+=7*u){x.beginPath();x.moveTo(i,0);x.lineTo(i,H);x.stroke()}x.restore();
  const L=W*.16,T=H*.05,Rr=W*.84,B=H*.86;x.fillStyle=c.ac;x.beginPath();x.moveTo(L,T);
  for(let i=1;i<=12;i++)x.lineTo(L+(Rr-L)*i/12,T+(r()-.5)*14*u);for(let i=1;i<=14;i++)x.lineTo(Rr+(r()-.5)*14*u,T+(B-T)*i/14);
  for(let i=1;i<=12;i++)x.lineTo(Rr-(Rr-L)*i/12,B+(r()-.5)*14*u);for(let i=1;i<14;i++)x.lineTo(L+(r()-.5)*14*u,B-(B-T)*i/14);x.closePath();x.fill();
  const t=stack(x,ls,hf(f),W*.27,H*.1,W*.46,H*.46,{max:120*u,vary:1.3,col:c.fg,lh:1.1});
  if(S.sub){x.font=`700 ${32*u}px "${f[1]}"`;x.fillStyle=c.fg;x.textAlign="center";x.textBaseline="middle";x.fillText(S.sub,W/2,t.y0+t.tot+40*u,W*.6)}
  const by=H*.9,wh=(cx)=>{x.fillStyle="#2a1f1c";x.beginPath();x.arc(cx,by-26*u,28*u,0,7);x.fill();x.fillStyle="#b33a2f";x.beginPath();x.arc(cx,by-26*u,14*u,0,7);x.fill()};
  [0,1,2].forEach(i=>{const cx0=W*.42+i*W*.17;x.fillStyle="#e2c78e";x.fillRect(cx0,by-120*u,W*.16,92*u);x.fillStyle="#3a2a24";for(let k=0;k<4;k++)x.fillRect(cx0+14*u+k*(W*.16-28*u)/4,by-100*u,18*u,30*u);x.fillStyle="#9b3a2c";x.fillRect(cx0,by-126*u,W*.16,8*u);wh(cx0+W*.04);wh(cx0+W*.12)});
  x.fillStyle="#6f6f77";x.beginPath();x.roundRect?x.roundRect(W*.12,by-150*u,W*.3,95*u,20*u):x.rect(W*.12,by-150*u,W*.3,95*u);x.fill();
  x.fillStyle="#3b3b42";x.beginPath();x.moveTo(W*.14,by-250*u);x.lineTo(W*.22,by-250*u);x.lineTo(W*.205,by-150*u);x.lineTo(W*.155,by-150*u);x.fill();
  x.fillStyle="#d9b97a";x.fillRect(W*.3,by-200*u,W*.1,100*u);x.fillStyle="#3a2a24";x.fillRect(W*.32,by-185*u,W*.06,34*u);
  wh(W*.16);wh(W*.24);wh(W*.33);
  authorLine(x,"— ",W/2,H-m*.9,"center",c.fg,u,f);foot(x,W/2,H-m*.4,"center",c.fg,u)}},
{n:"স্বপ্নের শহর",ty:["typography"],f:[F.bd,F.nb],
 p:[["#ece7dc","#141414","#0b0b0b"],["#e6edf2","#0e1a26","#0e1a26"],["#f3e6d3","#2a1208","#2a1208"]],
 d(x,W,H,u,c,f){const m=64*u,r=rnd(9),ls=lines(S.text);
  x.save();x.strokeStyle=c.fg;x.lineWidth=1.4*u;x.globalAlpha=.09;for(let i=0;i<70;i++){const a=r()*W,b=r()*H*.8;x.beginPath();x.moveTo(a,b);x.lineTo(a+(r()-.5)*220*u,b+(r()-.5)*220*u);x.stroke()}x.restore();
  const t=stack(x,ls,hf(f),W*.22,H*.07,W*.56,H*.4,{max:130*u,vary:1.3,col:c.fg,lh:1.08});
  if(S.sub){x.font=`700 ${36*u}px "${f[1]}"`;x.fillStyle=c.fg;x.textAlign="center";x.textBaseline="middle";x.fillText(S.sub,W/2,t.y0+t.tot+46*u,W-2*m)}
  const gy=H*.82;x.fillStyle=c.ac;let X=-10*u;while(X<W){const bw=(36+r()*60)*u,mid=1-Math.abs(X/W-.5)*.7,bh=(70+r()*230)*u*mid*(H/1080*1.0+.0);x.fillStyle=c.ac;x.fillRect(X,gy-bh,bw,bh+4*u);x.fillStyle=hexA(c.bg,.35);for(let wy=gy-bh+12*u;wy<gy-10*u;wy+=22*u)for(let wx=X+8*u;wx<X+bw-8*u;wx+=16*u)if(r()>.45)x.fillRect(wx,wy,6*u,9*u);X+=bw+3*u}
  x.fillStyle=c.ac;x.fillRect(0,gy,W,H-gy);x.strokeStyle=hexA(c.bg,.55);x.lineWidth=3*u;x.beginPath();x.moveTo(0,H*.97);x.quadraticCurveTo(W*.6,H*.9,W,H*.84);x.stroke();
  authorLine(x,"— ",W*.5,H-m*.7,"center",c.bg,u,f);foot(x,W-m,H-m*.7,"right",c.bg,u)}},
{n:"৩ডি সাদা অক্ষর",ty:["typography"],f:[F.bd,F.nb],
 p:[["#0b0708","#ffffff","#8e1b2d"],["#050b1c","#ffffff","#1e4fd8"],["#08150f","#ffffff","#1a8a5a"]],
 d(x,W,H,u,c,f){const m=64*u,ls=lines(S.text),ff=hf(f);
  const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,c.bg);g.addColorStop(.35,c.bg);g.addColorStop(1,c.ac);x.fillStyle=g;x.fillRect(0,0,W,H);
  const t=stack(x,ls,ff,W*.14,H*.14,W*.72,H*.5,{max:170*u,vary:1.25,lh:1.05,fn:(x,l,X,Y,s)=>{for(let k=14;k>0;k--){x.fillStyle=`rgba(0,0,0,${.05+k*.012})`;x.fillText(l,X+k*1.8*u,Y+k*1.8*u)}x.fillStyle=c.fg;x.fillText(l,X,Y)}});
  if(S.sub){const sl=S.sub.split("\n").slice(0,5);x.font=`500 ${34*u}px "${f[1]}"`;x.fillStyle=c.fg;x.textAlign="center";x.textBaseline="middle";sl.forEach((s,i)=>x.fillText(s,W/2,t.y0+t.tot+60*u+i*46*u,W-2*m))}
  authorLine(x,"— ",W/2,H-m*1.5,"center",c.fg,u,f);foot(x,W/2,H-m*.6,"center",c.fg,u)}},
{n:"বেগুনি রঙিন",ty:["typography"],f:[F.bd,F.nb],
 p:[["#2a1458","#ffffff","#f5c26b"],["#0e2a47","#ffffff","#5ad1c4"],["#4a0f2e","#ffffff","#ff9f7a"]],
 d(x,W,H,u,c,f){const m=64*u,r=rnd(13),ls=lines(S.text);
  const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,mix(c.bg,"#000000",.25));g.addColorStop(.6,c.bg);g.addColorStop(1,mix(c.bg,"#ffffff",.18));x.fillStyle=g;x.fillRect(0,0,W,H);
  for(let i=0;i<34;i++){const bx=r()*W,by=r()*H,br=(8+r()*30)*u;x.fillStyle="rgba(255,255,255,.05)";x.beginPath();x.arc(bx,by,br,0,7);x.fill();x.strokeStyle="rgba(255,255,255,.18)";x.lineWidth=1.5*u;x.stroke()}
  x.save();x.translate(W*.14,H*.1);for(let i=0;i<9;i++){x.rotate(Math.PI*2/9);x.fillStyle="rgba(235,230,220,.92)";x.beginPath();x.ellipse(0,-46*u,15*u,44*u,0,0,7);x.fill()}x.fillStyle=c.ac;x.beginPath();x.arc(0,0,16*u,0,7);x.fill();x.restore();
  let top=H*.22;if(S.sub){x.font=`500 ${42*u}px "${f[1]}"`;x.fillStyle=c.fg;x.textAlign="center";x.textBaseline="middle";wrap(x,S.sub,W*.6).forEach((l,i)=>x.fillText(l,W/2,H*.12+i*56*u));top=H*.24}
  const c2=mix(c.fg,"#4aa3e8",.55);
  stack(x,ls,hf(f),W*.16,top,W*.68,H*.72-top,{max:170*u,vary:1.3,lh:1.1,fn:(x,l,X,Y,s)=>{const gr=x.createLinearGradient(X-s*2,Y-s/2,X+s*2,Y+s/2);gr.addColorStop(0,c.ac);gr.addColorStop(1,c2);x.fillStyle=gr;x.fillText(l,X,Y)}});
  authorLine(x,"— ",W/2,H-m*1.5,"center",c.fg,u,f);foot(x,W/2,H-m*.6,"center",c.fg,u)}},
// ===== দ্বিতীয় ব্যাচ: Pinterest রেফারেন্স-ধাঁচ =====
{n:"মাথার ভেতরে",ty:["typography"],f:[F.bd,F.nb],
 p:[["#1a1a1a","#ffffff","#ff8a1f"],["#f4c430","#ffffff","#161616"],["#0f2b3a","#ffffff","#ff6b4a"]],
 d(x,W,H,u,c,f){const m=64*u,cx=W/2,cy=H*.44,R=Math.min(W,H)*.34,s=R*.85,ls=lines(S.text);
  x.fillStyle=c.ac;x.beginPath();x.arc(cx,cy,R,0,7);x.fill();
  x.fillStyle="#0d0d0d";x.beginPath();const P=(a,b)=>[cx+a*s,cy+b*s];
  let q=P(-.55,1.1);x.moveTo(q[0],q[1]);q=P(-.5,.55);x.lineTo(q[0],q[1]);
  let a=P(-.95,.2),b=P(-.95,-.9),e=P(-.1,-1);x.bezierCurveTo(a[0],a[1],b[0],b[1],e[0],e[1]);
  a=P(.5,-1.05);b=P(.75,-.5);e=P(.72,-.2);x.bezierCurveTo(a[0],a[1],b[0],b[1],e[0],e[1]);
  [[.9,.1],[.72,.17],[.74,.3],[.62,.38],[.66,.55],[.4,.72],[.42,1.1]].forEach(p=>{const z=P(p[0],p[1]);x.lineTo(z[0],z[1])});x.closePath();x.fill();
  x.save();x.beginPath();x.rect(0,0,W,cy+R);x.clip();x.restore();
  stack(x,ls,hf(f),cx-s*.5,cy-s*.62,s*1.05,s*1.0,{max:90*u,vary:1.25,col:c.fg,lh:1.15});
  authorLine(x,"— ",W/2,H-m*1.5,"center",c.fg,u,f);foot(x,W/2,H-m*.6,"center",c.fg,u)}},
{n:"হৃদয়ের কথা",ty:["typography"],f:[F.gl,F.nb],
 p:[["#cdb199","#ffffff","#7a4b2a"],["#f7e1e4","#8a1c34","#d6456a"],["#1c1a2b","#f6efe0","#e0a64b"]],
 d(x,W,H,u,c,f){const m=64*u,cx=W/2,cy=H*.48,s=Math.min(W,H)*.3,ls=lines(S.text);
  const heart=(k)=>{x.beginPath();x.moveTo(cx,cy+s*.95*k);x.bezierCurveTo(cx-s*1.6*k,cy-s*.1*k,cx-s*.75*k,cy-s*1.15*k,cx,cy-s*.4*k);x.bezierCurveTo(cx+s*.75*k,cy-s*1.15*k,cx+s*1.6*k,cy-s*.1*k,cx,cy+s*.95*k)};
  x.strokeStyle=c.ac;x.lineWidth=7*u;heart(1);x.stroke();x.lineWidth=2.5*u;heart(1.08);x.stroke();
  x.lineWidth=7*u;x.lineCap="round";x.beginPath();x.moveTo(cx-s*1.5,cy+s*.35);x.lineTo(cx-s*.6,cy-s*.05);x.stroke();
  x.fillStyle=c.ac;x.beginPath();x.moveTo(cx-s*1.62,cy+s*.42);x.lineTo(cx-s*1.38,cy+s*.2);x.lineTo(cx-s*1.3,cy+s*.5);x.closePath();x.fill();
  stack(x,ls,hf(f),cx-s*.6,cy-s*.28,s*1.2,s*.95,{max:100*u,vary:1.3,col:c.fg===""?c.ac:c.ac,lh:1.1});
  authorLine(x,"— ",W/2,H-m*1.5,"center",c.ac,u,f);foot(x,W/2,H-m*.6,"center",c.ac,u)}},
{n:"দুই রঙের শব্দ",ty:["typography"],f:[F.at,F.nb],
 p:[["#ffffff","#111111","#d7191f"],["#f4efe3","#1b1b1b","#0a7d5a"],["#fff4d6","#2a1a0a","#e8590c"]],
 d(x,W,H,u,c,f){const m=64*u,ls=lines(S.text),L=ls.length-1;
  const t=stack(x,ls,hf(f),W*.18,H*.14,W*.64,H*.54,{max:150*u,vary:1.3,lh:1.1,fn:(x,l,X,Y,s,i)=>{x.fillStyle=i===L&&ls.length>1?c.ac:c.fg;x.fillText(l,X,Y);x.fillText(l,X+1.2*u,Y)}});
  x.strokeStyle=c.fg;x.lineCap="round";x.lineWidth=10*u;x.beginPath();x.moveTo(W*.3,t.y0+t.tot+36*u);x.quadraticCurveTo(W*.5,t.y0+t.tot+10*u,W*.72,t.y0+t.tot+34*u);x.stroke();
  if(S.sub){x.font=`700 ${34*u}px "${f[1]}"`;x.fillStyle=c.fg;x.textAlign="center";x.textBaseline="middle";x.fillText(S.sub,W/2,t.y0+t.tot+96*u,W-2*m)}
  authorLine(x,"— ",W/2,H-m*1.5,"center",c.ac,u,f);foot(x,W/2,H-m*.6,"center",c.fg,u)}},
{n:"লাল স্টিকার",ty:["typography"],f:[F.bd,F.nb],
 p:[["#ffffff","#ffffff","#c8102e"],["#fff3d6","#ffffff","#0a7d5a"],["#e9eefc","#ffffff","#2b45d6"]],
 d(x,W,H,u,c,f){const m=64*u,cx=W/2,cy=H*.42,R=Math.min(W,H)*.27,ls=lines(S.text);
  x.save();x.setLineDash([10*u,10*u]);x.strokeStyle=c.ac;x.lineWidth=3*u;x.beginPath();x.arc(cx,cy,R*1.3,0,7);x.stroke();x.restore();
  x.fillStyle="rgba(0,0,0,.12)";x.beginPath();for(let i=0;i<=120;i++){const a=i/120*Math.PI*2,k=1+.07*Math.sin(a*9);x.lineTo(cx+4*u+Math.cos(a)*R*k,cy+8*u+Math.sin(a)*R*k)}x.fill();
  x.fillStyle="#ffffff";x.beginPath();for(let i=0;i<=120;i++){const a=i/120*Math.PI*2,k=1.08+.07*Math.sin(a*9);x.lineTo(cx+Math.cos(a)*R*k,cy+Math.sin(a)*R*k)}x.fill();
  x.fillStyle=c.ac;x.beginPath();for(let i=0;i<=120;i++){const a=i/120*Math.PI*2,k=1+.07*Math.sin(a*9);x.lineTo(cx+Math.cos(a)*R*k,cy+Math.sin(a)*R*k)}x.fill();
  stack(x,ls,hf(f),cx-R*.75,cy-R*.6,R*1.5,R*1.2,{max:130*u,vary:1.3,lh:1.1,fn:(x,l,X,Y)=>{x.fillStyle="rgba(0,0,0,.3)";x.fillText(l,X+3*u,Y+4*u);x.fillStyle="#fff";x.fillText(l,X,Y)}});
  if(S.sub){x.font=`700 ${34*u}px "${f[1]}"`;x.fillStyle="#222";x.textAlign="center";x.textBaseline="middle";x.fillText(S.sub,W/2,cy+R*1.55,W-2*m)}
  authorLine(x,"— ",W/2,H-m*1.5,"center","#222",u,f);foot(x,W/2,H-m*.6,"center","#222",u)}},
{n:"লাল দণ্ড",ty:["typography"],f:[F.at,F.nb],
 p:[["#f3eee0","#161616","#a61b1b"],["#eef3ee","#10241a","#0a7d5a"],["#1a1a22","#f4f1e8","#e24a4a"]],
 d(x,W,H,u,c,f){const m=64*u,ls=lines(S.text);
  x.fillStyle=c.ac;x.fillRect(W*.86,0,16*u,H*.78);x.fillRect(W*.08,H*.62,W*.56,18*u);
  x.fillStyle=c.bg;for(let i=0;i<5;i++)x.fillRect(W*.86+4*u,H*.05+i*14*u,8*u,5*u);
  const t=stack(x,ls,hf(f),W*.1,H*.2,W*.62,H*.34,{al:"left",max:110*u,vary:1.3,lh:1.15,fn:(x,l,X,Y,s,i)=>{x.fillStyle=i%2?c.ac:c.fg;x.fillText(l,X,Y)}});
  x.strokeStyle=c.fg;x.lineWidth=3*u;x.beginPath();x.moveTo(W*.34,H*.65);x.quadraticCurveTo(W*.55,H*.78,W*.72,H*.84);x.stroke();
  for(let i=0;i<6;i++){x.fillStyle=c.ac;x.beginPath();x.ellipse(W*.73+Math.cos(i)*14*u,H*.85+Math.sin(i)*14*u,9*u,5*u,i,0,7);x.fill()}
  if(S.sub){x.font=`600 ${30*u}px "${f[1]}"`;x.fillStyle=c.fg;x.textAlign="left";x.textBaseline="middle";x.fillText(S.sub,W*.1,t.y0+t.tot+50*u,W*.7)}
  authorLine(x,"— ",W*.1,H-m*1.3,"left",c.ac,u,f);foot(x,W*.1,H-m*.55,"left",c.fg,u)}},
{n:"গোলাপি শহর",ty:["typography"],f:[F.bd,F.nb],
 p:[["#f6a6b5","#c4122f","#e8607a"],["#bfe3f2","#0c3a63","#5aa5d1"],["#ffd9a8","#8a2a0b","#f08a4b"]],
 d(x,W,H,u,c,f){const m=64*u,r=rnd(21),ls=lines(S.text);
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,mix(c.bg,"#ffffff",.25));g.addColorStop(1,c.bg);x.fillStyle=g;x.fillRect(0,0,W,H);
  const gy=H*.9;let X=0;while(X<W){const bw=(40+r()*70)*u,bh=(80+r()*260)*u*(H/1080);x.fillStyle=mix(c.ac,"#ffffff",.15+r()*.25);x.fillRect(X,gy-bh,bw,bh);x.fillStyle="rgba(255,255,255,.35)";for(let wy=gy-bh+14*u;wy<gy-12*u;wy+=24*u)for(let wx=X+8*u;wx<X+bw-10*u;wx+=18*u)if(r()>.5)x.fillRect(wx,wy,8*u,11*u);X+=bw+2*u}
  x.fillStyle=c.ac;x.fillRect(0,gy,W,H-gy);
  const t=stack(x,ls,hf(f),W*.42,H*.1,W*.5,H*.42,{al:"right",max:130*u,vary:1.3,col:c.fg,lh:1.12});
  if(S.sub){x.font=`700 ${32*u}px "${f[1]}"`;x.fillStyle=c.fg;x.textAlign="right";x.textBaseline="middle";x.fillText(S.sub,W*.92,t.y0+t.tot+44*u,W*.5)}
  authorLine(x,"— ",W*.92,H-m*.7,"right","#ffffff",u,f);foot(x,m,H-m*.7,"left","#ffffff",u)}},
{n:"কালো রাত",ty:["typography"],f:[F.at,F.nb],
 p:[["#0a0a0a","#f4efe0","#ffd23f"],["#0b1220","#e8f0ff","#6fd0ff"],["#120a0a","#fbe9e0","#ff6b4a"]],
 d(x,W,H,u,c,f){const m=64*u,r=rnd(17),ls=lines(S.text);
  x.fillStyle=c.fg;for(let i=0;i<60;i++){x.globalAlpha=.15+r()*.4;x.beginPath();x.arc(r()*W,r()*H*.7,(1+r()*2)*u,0,7);x.fill()}x.globalAlpha=1;
  x.fillStyle=c.ac;[-1,0,1].forEach(k=>{x.beginPath();x.arc(W/2+k*34*u,H*.1,4*u,0,7);x.fill()});
  const t=stack(x,ls,hf(f),W*.2,H*.14,W*.6,H*.4,{max:140*u,vary:1.3,lh:1.1,fn:(x,l,X,Y,s,i)=>{x.fillStyle=i===0?c.ac:c.fg;x.fillText(l,X,Y)}});
  if(S.sub){x.font=`500 ${32*u}px "${f[1]}"`;x.fillStyle=c.fg;x.textAlign="center";x.textBaseline="middle";wrap(x,S.sub,W*.7).forEach((l,i)=>x.fillText(l,W/2,t.y0+t.tot+46*u+i*44*u))}
  const wy=H*.8;const g=x.createLinearGradient(0,wy,0,H);g.addColorStop(0,hexA(c.ac,.12));g.addColorStop(1,hexA(c.ac,0));x.fillStyle=g;x.fillRect(0,wy,W,H-wy);
  x.fillStyle=c.fg;x.beginPath();x.moveTo(W*.4,wy);x.quadraticCurveTo(W*.5,wy+40*u,W*.6,wy);x.closePath();x.fill();
  x.beginPath();x.arc(W*.52,wy-26*u,18*u,0,7);x.fill();x.fillRect(W*.5,wy-14*u,4*u,0);
  authorLine(x,"— ",W/2,H-m*1.1,"center",c.fg,u,f);foot(x,W/2,H-m*.5,"center",c.fg,u)}}
];

function drawCard(c,d,W,H){
  c.width=W;c.height=H;const x=c.getContext("2d"),u=Math.sqrt(W*H)/1080,t=TPL[d.i],p=t.p[d.p%3];
  const col={bg:p[0],fg:p[1],ac:p[2]};
  if(S.pc){col.bg=S.pc;col.fg=ink(S.pc)}if(S.ac)col.ac=S.ac;
  x.fillStyle=col.bg;x.fillRect(0,0,W,H);
  t.d(x,W,H,u,col,[S.font&&S.font!=="auto"?S.font:t.f[0],t.f[1]]);
  if(S.logo){const h=90*u,w=Math.min(S.logo.width/S.logo.height*h,300*u),mg=36*u,X=S.lp[1]==="l"?mg:W-w-mg,Y=S.lp[0]==="t"?mg:H-h-mg;x.save();x.globalAlpha=S.lo;x.drawImage(S.logo,X,Y,w,h);x.restore()}
}
function detect(t){
  if(/আল্লাহ|ইসলাম|রাসুল|কুরআন|দোয়া|রমজান|ঈদ/.test(t))return"islamic";
  if(t.split("\n").filter(Boolean).length>=3&&t.length<600)return"poetry";
  if(/ব্রেকিং|সংবাদ|প্রধানমন্ত্রী|সরকার|নির্বাচন|পুলিশ|প্রতিবেদক/.test(t)||t.length>220)return"news";
  return"quote";
}

export {F,S,TPL,PLAT,drawCard,detect};

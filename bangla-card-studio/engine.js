// কার্ড রেন্ডারিং ইঞ্জিন: টেমপ্লেট (TPL) এখানে। নতুন টেমপ্লেট যোগ করার নিয়ম README-তে।
const F={ns:"Noto Serif Bengali",nb:"Noto Sans Bengali",hs:"Hind Siliguri",tb:"Tiro Bangla",ab:"Anek Bangla",bd:"Baloo Da 2"};
const $=i=>document.getElementById(i);
const S={img:null,logo:null,logoData:null,pc:null,ac:null};
const PLAT={fb:[1200,630],ig:[1080,1080],igp:[1080,1350],story:[1080,1920],yt:[1280,720],x:[1600,900]};
let designs=[],sel=0,ready=false;
const lum=h=>{const n=parseInt(h.slice(1),16);return(.299*(n>>16)+.587*(n>>8&255)+.114*(n&255))/255};
const ink=h=>lum(h)>.58?"#141414":"#ffffff";
const src=()=>(S.url||S.web||"").trim().replace(/^https?:\/\//i,"").replace(/^www\./i,"").replace(/\/.*$/,"").slice(0,40);
const hf=f=>fs=>`${f[0]===F.tb?400:700} ${fs}px "${f[0]}"`;
const bf=f=>fs=>`400 ${fs}px "${f[1]}"`;

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
  foot(x,W/2,H-m*.8,"center","#fff",u)}}

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

"use strict";
const games=[
{ id:"hades",title:"Hades",store:"Steam"},{id:"cyberpunk-2077",title:"Cyberpunk 2077",store:"Steam"},{id:"baldurs-gate-3",title:"Baldur's Gate 3",store:"GOG"},{id:"stardew-valley",title:"Stardew Valley",store:"Steam"},{id:"the-witcher-3",title:"The Witcher 3: Wild Hunt",store:"GOG"},{id:"portal-2",title:"Portal 2",store:"Steam"},{id:"elden-ring",title:"Elden Ring",store:"Steam"},{id:"control",title:"Control",store:"Epic Games Store"},{id:"no-mans-sky",title:"No Man's Sky",store:"Steam"},{id:"disco-elysium",title:"Disco Elysium",store:"GOG"}
].map(g=>({...g,status:"Not tested",note:"Wishlist entry. No test has been performed."}));
const view=document.querySelector("#view");
let activeView="continue",selected=0,lastPadState={},lastFocused=null;
document.querySelector("#count").textContent=String(games.length);
const tabs=()=>Array.from(document.querySelectorAll(".tab"));
const focusables=()=>Array.from(document.querySelectorAll(".tab, #view button, #view a, #view [tabindex='0']")).filter(el=>!el.disabled&&el.getClientRects().length);
function moveFocus(delta){
 const els=focusables();if(!els.length)return;
 let i=els.indexOf(document.activeElement);if(i<0)i=delta>0?-1:0;
 const next=els[(i+delta+els.length)%els.length];next.focus();lastFocused=next;
}
function card(g,i){return `<article class="game" tabindex="0" data-index="${i}" aria-label="${g.title}, not tested"><div class="meta">${g.store}</div><h3>${g.title}</h3><span class="status">NOT TESTED</span><p>Compatibility has not been measured on a Yugatn Box reference system.</p><div class="actions"><button class="secondary" data-details="${g.id}">Details</button></div></article>`}
function render(){
 tabs().forEach(b=>{b.classList.toggle("active",b.dataset.view===activeView);b.setAttribute("aria-current",b.dataset.view===activeView?"page":"false")});
 if(activeView==="settings"){
  view.innerHTML=`<section class="panel"><h2>Settings</h2><p class="muted">Prototype settings are informational; hardware and OS reference profile have not been selected.</p><div class="settings-list"><div class="setting"><strong>Reference hardware</strong><span>Not selected · selection is the next project gate</span></div><div class="setting"><strong>Operating system</strong><span>Linux-first decision proposed; image not built</span></div><div class="setting"><strong>Controller</strong><span id="controller-status">Browser Gamepad API support added; physical controller test pending</span></div><div class="setting"><strong>Companion / streaming</strong><span>Not implemented</span></div></div><div class="notice">No store accounts, network pairing, telemetry, or executable launch are used by this prototype. Browser gamepad input requires a compatible browser and secure context (HTTPS or localhost).</div></section>`;
  updateControllerStatus();return
 }
 if(activeView==="continue"){
  const g=games[selected%games.length];
  view.innerHTML=`<div class="section-head"><div><p class="eyebrow">PICK UP WHERE YOU LEFT OFF</p><h2>Continue</h2><p class="muted">A preview of the intended flow, not a launchable game session.</p></div></div><section class="panel"><p class="eyebrow">SELECTED TITLE · ${selected+1} OF ${games.length}</p><h2>${g.title}</h2><p class="muted">${g.store} · Compatibility: Not tested</p><div class="notice">Launch is disabled because this prototype has no launcher integration, reference hardware, or verified test report.</div><div class="actions"><button class="action" id="next">Next title</button><button class="secondary" id="to-library">Browse library</button></div></section><div style="height:16px"></div><div class="section-head"><h2>Library preview</h2><span class="muted">All entries untested</span></div><div class="grid">${games.slice(0,3).map(card).join("")}</div>`;
  document.querySelector("#next").onclick=()=>{selected=(selected+1)%games.length;render();document.querySelector("#next")?.focus()};
  document.querySelector("#to-library").onclick=()=>{activeView="library";render();document.querySelector('[data-view="library"]')?.focus()};
  wireCards();return
 }
 view.innerHTML=`<div class="section-head"><div><h2>Library</h2><p class="muted">Sample wishlist metadata, not proof of compatibility.</p></div><a href="../compatibility/catalog.json">View JSON catalog</a></div><div class="grid">${games.map(card).join("")}</div>`;
 wireCards();
}
function wireCards(){
 document.querySelectorAll("[data-index]").forEach(el=>{
  el.addEventListener("click",e=>{if(e.target.closest("button"))return;selected=Number(el.dataset.index);activeView="continue";render();document.querySelector("#next")?.focus()});
  el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();selected=Number(el.dataset.index);activeView="continue";render();document.querySelector("#next")?.focus()}});
 });
 document.querySelectorAll("[data-details]").forEach(b=>b.addEventListener("click",()=>{
  const g=games.find(x=>x.id===b.dataset.details);
  view.innerHTML=`<section class="panel"><button class="secondary" id="back">Back to library</button><p class="eyebrow">COMPATIBILITY RECORD</p><h2>${g.title}</h2><p>Store: ${g.store}</p><p>Status: <strong>Not tested</strong></p><div class="notice">No FPS, driver, OS, or gameplay result is available. This record must not be interpreted as a compatibility claim.</div><p class="muted">Next evidence needed: selected reference profile, test date, launch result, controller/audio checks, and a reproducible report.</p></section>`;
  document.querySelector("#back").onclick=()=>{activeView="library";render();document.querySelector('[data-view="library"]')?.focus()};
  document.querySelector("#back").focus();
 }));
}
tabs().forEach(b=>b.addEventListener("click",()=>{activeView=b.dataset.view;render();b.focus()}));
document.addEventListener("keydown",e=>{
 if(["ArrowRight","ArrowDown"].includes(e.key)){e.preventDefault();moveFocus(1)}
 else if(["ArrowLeft","ArrowUp"].includes(e.key)){e.preventDefault();moveFocus(-1)}
 else if(e.key==="Escape"){
  const back=document.querySelector("#back");
  if(back){back.click();return}
  if(activeView!=="continue"){activeView="continue";render();document.querySelector("#next")?.focus()}
 }
});
function updateControllerStatus(){
 const target=document.querySelector("#controller-status");if(!target)return;
 const pads=Array.from(navigator.getGamepads?.()??[]).filter(Boolean);
 target.textContent=pads.length?`Detected: ${pads.map(p=>p.id||"Unnamed controller").join(", ")}. Physical navigation mapping still requires testing.`:"No controller currently detected. Physical controller test pending.";
}
window.addEventListener("gamepadconnected",updateControllerStatus);
window.addEventListener("gamepaddisconnected",updateControllerStatus);
function pressed(pad,index){return Boolean(pad.buttons[index]?.pressed)}
function gamepadLoop(){
 const pads=Array.from(navigator.getGamepads?.()??[]).filter(Boolean);
 const pad=pads[0];
 if(pad){
  const current={
   up:pressed(pad,12)||(pad.axes[1]??0)<-.65,
   down:pressed(pad,13)||(pad.axes[1]??0)>.65,
   left:pressed(pad,14)||(pad.axes[0]??0)<-.65,
   right:pressed(pad,15)||(pad.axes[0]??0)>.65,
   accept:pressed(pad,0),back:pressed(pad,1),prevTab:pressed(pad,4),nextTab:pressed(pad,5)
  };
  for(const key of ["up","left","down","right","accept","back","prevTab","nextTab"]){
   if(current[key]&&!lastPadState[key]){
    if(key==="up"||key==="left")moveFocus(-1);
    if(key==="down"||key==="right")moveFocus(1);
    if(key==="accept")document.activeElement?.click?.();
    if(key==="back")document.dispatchEvent(new KeyboardEvent("keydown",{key:"Escape",bubbles:true}));
    if(key==="prevTab"||key==="nextTab"){
     const list=tabs(),i=list.findIndex(t=>t.dataset.view===activeView),delta=key==="nextTab"?1:-1;
     list[(i+delta+list.length)%list.length]?.click();
    }
   }
  }
  lastPadState=current;
 }else{lastPadState={}}
 requestAnimationFrame(gamepadLoop);
}
render();
updateControllerStatus();
requestAnimationFrame(gamepadLoop);

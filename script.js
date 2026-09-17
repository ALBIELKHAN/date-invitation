document.addEventListener("DOMContentLoaded",()=>{
const $=id=>document.getElementById(id);
const screens=[$("opening"),$("question"),$("yesScreen"),$("planScreen"),$("splitScreen"),$("finalScreen")];
const show=s=>{screens.forEach(x=>x.classList.add("hidden"));s.classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"});makePetals(7)};

function makePetals(count=5){
  const layer=$("petals");
  for(let i=0;i<count;i++){
    const p=document.createElement("span");
    p.className="petal";
    p.textContent=Math.random()>.45?"♡":"✿";
    p.style.left=Math.random()*100+"vw";
    p.style.setProperty("--x",(Math.random()*140-70)+"px");
    p.style.animationDuration=(5+Math.random()*4)+"s";
    p.style.animationDelay=Math.random()*2+"s";
    layer.appendChild(p);
    setTimeout(()=>p.remove(),10000);
  }
}
makePetals(10);

$("start").onclick=()=>show($("question"));
const no=$("no"),zone=$("choice"),hint=$("hint");let moves=0;
function escapeNo(){
  const z=zone.getBoundingClientRect(),b=no.getBoundingClientRect();
  const x=8+Math.random()*Math.max(8,z.width-b.width-16),y=8+Math.random()*Math.max(8,z.height-b.height-16);
  no.style.left=x+"px";no.style.top=y+"px";no.style.transform=`rotate(${Math.random()*12-6}deg)`;
  moves++;
  hint.textContent=moves<2?"hmm... suspicious button...":moves<4?"nice try 😭":"sayang, the answer is obviously YES ♡";
}
no.onpointerenter=escapeNo;
no.onpointerdown=e=>{e.preventDefault();escapeNo()};
no.onclick=e=>{e.preventDefault();escapeNo()};
no.style.left="58%";no.style.top="35%";

$("yes").onclick=()=>{show($("yesScreen"));countdown()};
const eventDate=Date.UTC(2026,8,19,3,45,0);let started=false;
function countdown(){
  if(started)return;started=true;
  function tick(){let d=eventDate-Date.now();if(d<0)d=0;
    $("days").textContent=String(Math.floor(d/86400000)).padStart(2,"0");
    $("hours").textContent=String(Math.floor(d%86400000/3600000)).padStart(2,"0");
    $("minutes").textContent=String(Math.floor(d%3600000/60000)).padStart(2,"0");
    $("seconds").textContent=String(Math.floor(d%60000/1000)).padStart(2,"0");
  }
  tick();setInterval(tick,1000);
}

$("plan").onclick=()=>show($("planScreen"));
$("split").onclick=()=>show($("splitScreen"));
$("final").onclick=()=>{show($("finalScreen"));hearts()};

function hearts(){
  for(let i=0;i<20;i++){
    let h=document.createElement("span");h.textContent=Math.random()>.35?"♡":"✦";
    h.style.cssText=`position:fixed;left:${Math.random()*100}vw;bottom:-20px;z-index:15;pointer-events:none;color:${i%3?"#b98b61":"#c64d68"};font-size:${12+Math.random()*15}px;animation:rise ${3+Math.random()*3}s ease-out forwards`;
    document.body.appendChild(h);setTimeout(()=>h.remove(),6500)
  }
}
const st=document.createElement("style");st.textContent='@keyframes rise{from{opacity:0;transform:translateY(0)}15%{opacity:.9}to{opacity:0;transform:translateY(-105vh) translateX(35px) rotate(180deg)}}';document.head.appendChild(st);

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyU_DS3vDMId12cg-h8ooWx2JA77gTotkR0YM5jOStfW5tnCmrjseLiCy1UkmrW8nAI/exec";

$("shareThoughts").onclick=()=>{
  const thoughts=$("thoughts").value.trim();
  const status=$("shareStatus");
  const button=$("shareThoughts");

  if(!thoughts){
    status.textContent="tell me at least a little something first ♡";
    $("thoughts").focus();
    return;
  }

  if(!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.includes("PASTE_YOUR")){
    status.textContent="the secret mailbox still needs to be connected ♡";
    return;
  }

  // Use a hidden iframe + normal POST so this works with Google Apps Script
  // without exposing the response to the browser or requiring CORS.
  let frame=$("feedbackFrame");
  if(!frame){
    frame=document.createElement("iframe");
    frame.name="feedbackFrame";
    frame.id="feedbackFrame";
    frame.style.display="none";
    document.body.appendChild(frame);
  }

  const form=document.createElement("form");
  form.method="POST";
  form.action=GOOGLE_SCRIPT_URL;
  form.target="feedbackFrame";
  form.style.display="none";

  const fields={
    action:"date_feedback",
    thoughts:thoughts,
    submittedAt:new Date().toISOString()
  };

  Object.entries(fields).forEach(([name,value])=>{
    const input=document.createElement("input");
    input.type="hidden";
    input.name=name;
    input.value=value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  button.disabled=true;
  button.textContent="sending to my heart... ♡";
  status.textContent="";
  form.submit();

  setTimeout(()=>{
    status.textContent="it's on its way to me ♡ thank you, sayang.";
    button.textContent="sent to my heart ♡";
    form.remove();
  },900);
};

$("replay").onclick=()=>{
  moves=0;hint.textContent="choose wisely hehe";no.style.left="58%";no.style.top="35%";no.style.transform="rotate(0deg)";$("thoughts").value="";$("shareStatus").textContent="";show($("opening"));
};
});

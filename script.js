/* JAGIVERSE — editable friendship universe
   Change ACCESS_CODE and the sample text below to personalise the site.
   This is a client-side entrance only; do not store confidential information here. */
(() => {
  "use strict";
  const ACCESS_CODE = "JAGIYA";
  const STORE = "jagiverse-v1";
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const readStore = () => { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; } };
  const saveStore = data => localStorage.setItem(STORE, JSON.stringify(data));
  let data = readStore();

  // Entrance
  $("#gateForm").addEventListener("submit", e => {
    e.preventDefault();
    if ($("#passcode").value.trim().toUpperCase() === ACCESS_CODE) {
      $("#gate").hidden = true; $("#universe").hidden = false;
      sessionStorage.setItem("jagiverse-entered","yes");
      window.scrollTo(0,0); launchConfetti(55);
    } else {
      $("#gateError").textContent = "Oopsie! That's not our secret word. Try again, bestie ♡";
      $("#passcode").focus();
    }
  });
  if (sessionStorage.getItem("jagiverse-entered") === "yes") { $("#gate").hidden=true; $("#universe").hidden=false; }

  // Navigation
  $("#menuToggle").addEventListener("click", () => {
    const open = $("#mainNav").classList.toggle("open");
    $("#menuToggle").setAttribute("aria-expanded", String(open));
  });
  $$("#mainNav a").forEach(a => a.addEventListener("click", () => $("#mainNav").classList.remove("open")));

  // Audio slots: drop files into assets/audio and set their names here.
  const audioFiles = { birthday: "", sad: "", happy: "", lonely: "", hug: "", proud: "", sleep: "", need: "" };
  $$("[data-audio]").forEach(player => {
    const key = player.dataset.audio, status = $(`[data-audio-status="${key}"]`);
    if (audioFiles[key]) { player.src = audioFiles[key]; if(status) status.textContent = "your voice note ♡"; }
    else { player.hidden = true; if(status) status.textContent = "Add a recording in script.js when ready"; }
  });

  // Confetti
  function launchConfetti(amount=70) {
    const layer=$("#confettiLayer"), colors=["#f2a9c7","#c4b5ee","#ffe19b","#e9c6e7","#a9d9ce"];
    for(let i=0;i<amount;i++){
      const bit=document.createElement("i"); bit.className="confetti-piece";
      bit.style.left=Math.random()*100+"%"; bit.style.background=colors[i%colors.length];
      bit.style.animationDelay=(Math.random()*1.1)+"s"; bit.style.animationDuration=(2.3+Math.random()*2)+"s";
      bit.style.transform=`rotate(${Math.random()*180}deg)`; layer.append(bit);
      setTimeout(()=>bit.remove(),5000);
    }
  }
  $("#confettiBtn").addEventListener("click",()=>launchConfetti(110));

  // Scrapbook memories; localStorage keeps edits on this browser.
  const starterMemories = [
    {id:"m1",caption:"The beginning of our story",date:"Our school days",photo:"",sticker:"🎒"},
    {id:"m2",caption:"A memory waiting for a photo",date:"Add a date",photo:"",sticker:"🌷"},
    {id:"m3",caption:"One of our many silly moments",date:"Three years of us",photo:"",sticker:"🐻"}
  ];
  if(!Array.isArray(data.memories)) data.memories=starterMemories;
  function renderMemories(){
    $("#memoryGrid").innerHTML=data.memories.map(m=>`
      <article class="polaroid" data-id="${escapeHTML(m.id)}"><span class="tape"></span>
        <div class="photo-placeholder">${m.photo?`<img src="${escapeHTML(m.photo)}" alt="Memory photo">`:`<div><span>${escapeHTML(m.sticker||"♡")}</span><small>photo spot · add yours later</small></div>`}</div>
        <p class="caption">${escapeHTML(m.caption)}</p><p class="date">${escapeHTML(m.date)}</p>
        <div class="memory-actions"><button class="text-button edit-memory" type="button">Edit memory</button><button class="text-button delete-memory" type="button">Remove</button></div>
      </article>`).join("");
  }
  function escapeHTML(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  renderMemories();
  $("#addMemory").addEventListener("click",()=>openMemoryEditor());
  $("#memoryGrid").addEventListener("click",e=>{
    const card=e.target.closest(".polaroid"); if(!card)return;
    const i=data.memories.findIndex(m=>m.id===card.dataset.id); if(i<0)return;
    if(e.target.closest(".edit-memory")) openMemoryEditor(i);
    if(e.target.closest(".delete-memory")){if(confirm("Remove this scrapbook page?")){data.memories.splice(i,1);saveStore(data);renderMemories();}}
  });
  function openMemoryEditor(index=-1){
    const old=index>=0?data.memories[index]:{caption:"",date:"",photo:"",sticker:"🌷"};
    $("#modalBody").innerHTML=`<h3>${index>=0?"Edit this memory":"Add a scrapbook page"}</h3>
      <label for="memCaption">Caption</label><input id="memCaption" maxlength="90" value="${escapeHTML(old.caption)}" placeholder="Our funniest day...">
      <label for="memDate">Date or little label</label><input id="memDate" maxlength="55" value="${escapeHTML(old.date)}" placeholder="Summer 2026 / School days">
      <label for="memPhoto">Photo (optional)</label><input id="memPhoto" type="file" accept="image/*">
      <p class="form-note">You can save this page without a photo. Photos are stored in this browser.</p>
      <button id="saveMemory" class="button primary" type="button">Save memory ♡</button>`;
    showModal();
    $("#saveMemory").addEventListener("click",()=>{
      const caption=$("#memCaption").value.trim()||"A little moment worth keeping";
      const date=$("#memDate").value.trim()||"A day to remember";
      const file=$("#memPhoto").files[0];
      const commit=photo=>{
        const item={id:old.id||"m"+Date.now(),caption,date,photo:photo||old.photo||"",sticker:old.sticker||"♡"};
        if(index>=0)data.memories[index]=item;else data.memories.unshift(item);
        saveStore(data);renderMemories();hideModal();
      };
      if(file){const reader=new FileReader();reader.onload=()=>commit(reader.result);reader.readAsDataURL(file);}else commit(old.photo);
    });
  }

  // Rooms
  const rooms = {
    sad:{title:"It's okay to have a heavy day.",emoji:"🌧️",text:"You don't have to turn every bad day into a lesson. Rest. Cry if you need to. Eat something, drink some water and be gentle with yourself. This feeling is real, but it isn't the whole story. I'm cheering for you, even from wherever I am.",voice:"sad"},
    happy:{title:"WAIT, YOU'RE HAPPY?! TELL ME EVERYTHING!",emoji:"🌈",text:"I hope you enjoy this moment without shrinking it or feeling guilty for being happy. You deserve days that feel light. Take pictures, laugh loudly, celebrate the tiny things and save a little of this sunshine for later.",voice:"happy"},
    lonely:{title:"You are not an afterthought.",emoji:"🪐",text:"Even when the chat is quiet and everyone seems busy, you still matter. You don't have to earn a place in someone's life by being useful or entertaining. You have a place in mine. Sending you a little reminder that you're loved.",voice:"lonely"},
    hug:{title:"Hug delivery incoming!",emoji:"🧸",text:"Two little bestie creatures are crossing the universe just to squeeze you. Hold on to this for as long as you need.",voice:"hug"},
    proud:{title:"Look at you, doing the thing!",emoji:"🏆",text:"Every little achievement of yours deserves to be celebrated. Even when you don't realise how amazing you are, I do.",voice:"proud"},
    sleep:{title:"Let's make the world quieter.",emoji:"🌙",text:"Unclench your jaw. Drop your shoulders. Take one slow breath in, and let it go. You do not have to solve tomorrow tonight. Let the stars hold the unfinished thoughts for a while. Rest, Jagiya.",voice:"sleep"},
    need:{title:"One tap closer to your bestie.",emoji:"💌",text:"If you need me, send me a message or call when you can. You don't need a perfect reason or a perfectly worded explanation. A simple 'hey, I need you' is enough. I'm on your team.",voice:"need"}
  };
  $$(".room-card").forEach(btn=>btn.addEventListener("click",()=>renderRoom(btn.dataset.room)));
  function renderRoom(key){
    const r=rooms[key], display=$("#roomDisplay");
    const extra=key==="hug"?`<div class="hug-stage" id="hugStage"><span class="hug-character hug-left">🐱</span><span class="hug-character hug-right">🐰</span></div><button id="hugButton" class="button primary" type="button">Send me a hug ♡</button><p id="hugLine" class="form-note">Tap to bring the besties together.</p>`:
      key==="proud"?`<div class="proud-trophy">🏆</div><div class="proud-banner">I'M PROUD OF YOU TOO, JAGIYA!</div><p>${r.text}</p><button id="proudCelebrate" class="button primary" type="button">Celebrate my win ✨</button>`:"";
    const audio=`<div class="room-audio"><audio controls preload="none" data-audio="${r.voice}" hidden></audio><small class="audio-status" data-audio-status="${r.voice}"></small></div>`;
    display.innerHTML=`<div class="room-panel"><div class="room-emoji">${r.emoji}</div><h3>${r.title}</h3>${key==="proud"?"":`<p>${r.text}</p>`}${extra}${audio}</div>`;
    const player=$(`[data-audio="${r.voice}"]`), status=$(`[data-audio-status="${r.voice}"]`);
    if(audioFiles[r.voice]){player.src=audioFiles[r.voice];player.hidden=false;status.textContent="A voice note from me ♡";}else status.textContent="Your voice recording can be added here later.";
    if(key==="hug")$("#hugButton").addEventListener("click",()=>{
      const stage=$("#hugStage");stage.classList.remove("hugging");void stage.offsetWidth;stage.classList.add("hugging");
      $("#hugLine").textContent="Consider this your biggest virtual hug from me, Jagiya! ♡";launchConfetti(45);
    });
    if(key==="proud")$("#proudCelebrate").addEventListener("click",()=>launchConfetti(100));
    display.scrollIntoView({behavior:"smooth",block:"center"});
  }

  // Open-when letters
  const letters=[
    ["When you're sad","🌧️","I wish I could sit beside you right now. You don't have to explain everything or pretend you're okay. Take your time. One difficult day doesn't erase all the good waiting ahead. You are loved on the messy days too."],
    ["When you're happy","🌈","I hope you are smiling that big smile of yours. Please celebrate properly! I want all the details, the tiny ones too. Your happiness is never silly or too much."],
    ["When you miss me","💌","Consider this a tiny paper hug. Three years of friendship, countless little moments, and still so much story left. Distance or busy days don't get to delete what we have."],
    ["When you doubt yourself","⭐","You are capable of more than your worried brain lets you believe. You don't have to be perfect to be brilliant. Keep going, one small brave step at a time."],
    ["When you need a laugh","🐸","Official reminder: you are legally required to drink water, stop overthinking for at least 4 minutes, and remember that your bestie thinks you're a certified little weirdo. Affectionately."],
    ["On your next birthday","🎂","Another chapter, another version of you to love. I hope you look back and see how far you've come. Here's to all the birthdays we haven't celebrated yet."]
  ];
  $("#envelopeGrid").innerHTML=letters.map((l,i)=>`<button class="envelope" data-letter="${i}" type="button"><span class="env-icon">💌</span><b>${l[0]}</b><small>tap to open</small></button>`).join("");
  $("#envelopeGrid").addEventListener("click",e=>{
    const b=e.target.closest("[data-letter]");if(!b)return;
    const l=letters[Number(b.dataset.letter)];
    $$(".envelope").forEach(x=>x.classList.toggle("opened",x===b));
    $("#letterContent").innerHTML=`<div class="handwritten">${l[1]} a letter for you</div><h3>${escapeHTML(l[0])}</h3><p>${escapeHTML(l[2])}</p><div class="signature">Always your bestie ♡</div>`;
  });

  // Play zone
  $("#quizArea").addEventListener("click",e=>{
    const b=e.target.closest("[data-answer]");if(!b)return;
    $("#quizResult").textContent=b.dataset.answer==="school"?"Correct! Our school-days origin story ♡":"Nope! It all began at school, bestie. 😌";
    if(b.dataset.answer==="school")launchConfetti(25);
  });
  const gifts=["A pocket-sized reminder: you are someone's favourite person. ♡","A lifetime supply of imaginary cupcakes. 🧁","A bestie coupon: redeem for one emergency pep talk. 💌"];
  $$("[data-gift]").forEach(b=>b.addEventListener("click",()=>{$("#giftResult").textContent=gifts[Number(b.dataset.gift)];b.disabled=true;b.style.opacity=".5";}));
  const missions=["Send your bestie a random selfie.","Drink a glass of water, superstar.","Name three things you did well today.","Play your favourite song and dance for 20 seconds.","Take a tiny break. You deserve one.","Send someone a little kindness."];
  let spins=0;
  $("#spinBtn").addEventListener("click",()=>{
    spins++;$("#wheel").style.transform=`rotate(${spins*720+Math.random()*360}deg)`;
    $("#wheelResult").textContent=missions[Math.floor(Math.random()*missions.length)];
  });
  const notes=["You make ordinary days feel like stories worth keeping. ♡","You are not behind. You are becoming.","I hope you speak to yourself as kindly as you speak to people you love.","Your existence is already a reason to celebrate.","If today was hard, I'm still proud of you for getting through it.","Somewhere, your bestie is smiling because you exist."];
  $("#noteBtn").addEventListener("click",()=>$("#randomNote").textContent=notes[Math.floor(Math.random()*notes.length)]);
  let secretTaps=0;
  $("#secretStar").addEventListener("click",()=>{secretTaps++;if(secretTaps>=5){$("#secretMessage").textContent="SECRET UNLOCKED: You are stuck with me. Bestie contract: lifetime edition. ♡";launchConfetti(70);secretTaps=0;}else $("#secretMessage").textContent=`A little sparkle... ${5-secretTaps} more to go.`;});

  // Annual birthday chapters. Entries are keyed by year and never replace other years.
  const currentYear=2026, years=[2026,2027,2028];
  for(let y=2029;y<=2050;y++)years.push(y);
  let activeYear=currentYear;
  if(!data.yearbook)data.yearbook={};
  function renderYearTabs(){
    $("#yearTabs").innerHTML=years.map(y=>`<button class="year-tab ${y===activeYear?"active":""}" data-year="${y}" type="button">${y}</button>`).join("");
  }
  function renderYear(){
    const entries=data.yearbook[activeYear]||[];
    $("#yearChapter").innerHTML=`<p class="chapter-date">NOVEMBER 25 · CHAPTER ${activeYear-2025}</p><h3>${activeYear===2026?"The beginning of our birthday book":`Madhu's ${activeYear} chapter`}</h3><p>${activeYear===2026?"The first page of a tradition: one birthday, one new chapter, and a friendship that keeps growing.":"A fresh page for another year of Madhu being wonderfully herself. Add this year's moments below."}</p>${entries.length?entries.map(x=>`<div class="year-entry"><b>♡ ${escapeHTML(x.date)}</b><p>${escapeHTML(x.text)}</p></div>`).join(""):"<p class='form-note'>No entries yet. This page is waiting for its memories.</p>"}`;
    $("#yearSaveStatus").textContent="";
  }
  renderYearTabs();renderYear();
  $("#yearTabs").addEventListener("click",e=>{
    const b=e.target.closest("[data-year]");if(!b)return;
    activeYear=Number(b.dataset.year);renderYearTabs();renderYear();
  });
  $("#saveYearMemory").addEventListener("click",()=>{
    const text=$("#yearMemory").value.trim();if(!text){$("#yearSaveStatus").textContent="Write a little memory first ♡";return;}
    data.yearbook[activeYear]=data.yearbook[activeYear]||[];
    data.yearbook[activeYear].push({date:new Date().toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"}),text});
    saveStore(data);$("#yearMemory").value="";renderYear();$("#yearSaveStatus").textContent=`Saved to the ${activeYear} chapter ♡`;
  });

  // Modal
  function showModal(){$("#modal").hidden=false;document.body.style.overflow="hidden";}
  function hideModal(){$("#modal").hidden=true;document.body.style.overflow="";}
  $("#modalClose").addEventListener("click",hideModal);
  $("#modal").addEventListener("click",e=>{if(e.target===$("#modal"))hideModal();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#modal").hidden)hideModal();});
})();
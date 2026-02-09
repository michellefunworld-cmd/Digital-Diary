// THEME & DARK MODE
const body = document.body;
document.querySelectorAll(".themes button[data-theme]").forEach(btn => {
  btn.onclick = () => { 
    body.className = btn.dataset.theme; 
    localStorage.setItem("theme", btn.dataset.theme); 
  };
});
const savedTheme = localStorage.getItem("theme");
if(savedTheme) body.className = savedTheme;

// Dark/Light toggle
document.getElementById("toggleDark").onclick = () => {
  body.classList.toggle("dark-mode");
};

// DIARY STORAGE
let diary = JSON.parse(localStorage.getItem("diary")) || {};
let selectedDate = null;
let selectedMood = "😊";
const textarea = document.getElementById("entryText");

// MOOD BUTTON BOUNCE
document.querySelectorAll(".moods button").forEach(btn => {
  btn.onclick = () => {
    selectedMood = btn.dataset.mood;
    btn.style.transform = "scale(1.3)";
    setTimeout(()=> btn.style.transform="scale(1)",200);
  };
});

// CALENDAR
const daysEl = document.getElementById("calendarDays");
const monthYearEl = document.getElementById("monthYear");
let currentDate = new Date();

function renderCalendar() {
  daysEl.innerHTML = "";
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  monthYearEl.textContent = currentDate.toLocaleString("default",{month:"long",year:"numeric"});

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) daysEl.appendChild(document.createElement("div"));

  for (let day = 1; day <= lastDate; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const div = document.createElement("div");
    div.className = "day";

    const num = document.createElement("div");
    num.className = "day-number";
    num.textContent = day;
    div.appendChild(num);

    if(diary[dateStr]?.mood){
      const mood = diary[dateStr].mood;
      const moodDiv = document.createElement("div");
      moodDiv.className = "day-mood";
      moodDiv.textContent = mood;
      div.appendChild(moodDiv);

      // background color
      if(mood==="😊") div.style.backgroundColor="#ffb6c1";
      else if(mood==="💕") div.style.backgroundColor="#ff6f91";
      else if(mood==="😐") div.style.backgroundColor="#ffe4e1";
      else if(mood==="😢") div.style.backgroundColor="#d3d3d3";

      // hover preview
      div.setAttribute("data-preview", diary[dateStr].text.slice(0,20)+"...");
    }

    div.onclick = () => openEntry(dateStr);
    daysEl.appendChild(div);
  }
}
document.getElementById("prevMonth").onclick=()=>{ currentDate.setMonth(currentDate.getMonth()-1); renderCalendar(); };
document.getElementById("nextMonth").onclick=()=>{ currentDate.setMonth(currentDate.getMonth()+1); renderCalendar(); };

// OPEN & SAVE ENTRY WITH ANIMATIONS + CONFETTI
function openEntry(date){
  selectedDate=date;
  textarea.value=diary[date]?.text||"";
  selectedMood=diary[date]?.mood||"😊";
}

document.getElementById("saveEntry").onclick = ()=>{
  if(!selectedDate) return alert("Select a day first!");
  diary[selectedDate]={text:textarea.value,mood:selectedMood};
  localStorage.setItem("diary",JSON.stringify(diary));
  renderCalendar();

  // day pulse + confetti for happy moods
  const dayDivs = document.querySelectorAll(".day");
  dayDivs.forEach(d=>{
    const dayNum = d.querySelector(".day-number").textContent;
    const month = currentDate.getMonth()+1;
    const year = currentDate.getFullYear();
    const dateStr = `${year}-${String(month).padStart(2,"0")}-${dayNum.padStart(2,"0")}`;
    if(dateStr===selectedDate){
      d.style.transform="scale(1.2)";
      setTimeout(()=>d.style.transform="scale(1)",200);

      if(["😊","💕"].includes(selectedMood)){
        createConfetti(d);
      }
    }
  });
};

// CONFETTI FUNCTION
function createConfetti(parent){
  for(let i=0;i<10;i++){
    const conf = document.createElement("div");
    conf.className="confetti";
    conf.style.left=Math.random()*100+"%";
    conf.style.backgroundColor=["#ff6f91","#ffb6c1","#ffe4e1"][Math.floor(Math.random()*3)];
    parent.appendChild(conf);
    setTimeout(()=>conf.remove(),500);
  }
}

renderCalendar();

// PWA SERVICE WORKER
if("serviceWorker" in navigator){ navigator.serviceWorker.register("service-worker.js"); }

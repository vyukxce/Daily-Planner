// DOM elements
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");


let tasks = [];

// naya task object banane wali factory
function createTask(title) {
  const id = Date.now();
  return {
    id: id,
    title: title,
    done: false,
  };
}

// UI render
function renderTasks() {
  // purana content clear
  taskList.innerHTML = "";

  // har task ke liye ek <li> row banao
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className =
      "flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/70 border border-slate-800";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.className = "h-4 w-4 rounded border-slate-600";

    const span = document.createElement("span");
    span.textContent = task.title;
    span.className =
      "flex-1 text-sm " +
      (task.done ? "text-slate-500 line-through" : "text-slate-200/90");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className =
      "text-[11px] px-2 py-1 rounded-md bg-slate-700 text-slate-100 hover:bg-slate-600 transition";

    // checkbox: done toggle
    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      renderTasks();
    });

    // delete button: task array se nikal
    deleteBtn.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      renderTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

// naya task add karne ka flow
function addTask() {
  const title = taskInput.value.trim();
  if (!title) return;

  const newTask = createTask(title);
  tasks.push(newTask);
  taskInput.value = "";
  renderTasks();
}
// events
addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});
// initial render
renderTasks();

// ===== INSPIRATION / RANDOM QUOTE =====

// DOM elements
const inspoTextEl = document.getElementById("inspo-text");
const inspoSourceEl = document.getElementById("inspo-source");
const newInspoBtn = document.getElementById("new-inspo-btn");

// quotes data
const quotes = [
  { text: "Focus on the process, not the outcome.", author: "Unknown" },
  { text: "Code, sleep, repeat.", author: "Dev Life" },
  { text: "Be the best, you get the best.", author: "Ronaldo" }
];

// random quote chooser
function getRandomQuote() {
  const index = Math.floor(Math.random() * quotes.length);
  const quote = quotes[index];
  return quote;
}

// UI update
function showQuote(quote) {
  // main quote text
  inspoTextEl.textContent = quote.text;

  // author line
  if (quote.author) {
    inspoSourceEl.textContent = "— " + quote.author;
  } else {
    inspoSourceEl.textContent = "— Unknown";
  }
}

// button click → new inspo
newInspoBtn.addEventListener("click", () => {
  const randomQuote = getRandomQuote();
  showQuote(randomQuote);
});

// initial quote on page load
showQuote(getRandomQuote());

// ===== POMODORO TIMER =====

// DOM elements
const timerLabel = document.getElementById("timer-label");
const timerProgress = document.getElementById("timer-progress-bar");
const timerStart = document.getElementById("timer-start");
const timerPause = document.getElementById("timer-pause");
const timerReset = document.getElementById("timer-reset");

// state
let focusDuration = 25 * 60;   // total seconds (25 min)
let remaining = focusDuration;
let timerId = null;            // setInterval ka id
let isRunning = false;

// seconds -> "MM:SS"
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  function padToTwoDigits(number) {
    if (number < 10) {
      return "0" + number;
    } else {
      return number.toString();
    }
  }

  const m = padToTwoDigits(minutes);
  const s = padToTwoDigits(secs);

  return m + ":" + s;
}

// label + progress bar update
function updateTimerUI() {
  // text
  timerLabel.textContent = formatTime(remaining);

  // progress
  const elapsed = focusDuration - remaining;
  let percent = (elapsed / focusDuration) * 100;

  if (percent < 0) {
    percent = 0;
  } else if (percent > 100) {
    percent = 100;
  }

  timerProgress.style.width = percent + "%";
}

// start
function startTimer() {
  if (isRunning) return;        // already running

  isRunning = true;

  timerId = setInterval(() => {
    if (remaining > 0) {
      remaining -= 1;
      updateTimerUI();
    } else {
      clearInterval(timerId);
      timerId = null;
      isRunning = false;
      // optional: alert / sound / change label
      // timerLabel.textContent = "Done!";
    }
  }, 1000);
}

// pause
function pauseTimer() {
  if (!isRunning || timerId === null) return;

  clearInterval(timerId);
  timerId = null;
  isRunning = false;
}

// reset
function resetTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
  }
  timerId = null;
  isRunning = false;
  remaining = focusDuration;
  updateTimerUI();
}

// button events
timerStart.addEventListener("click", startTimer);
timerPause.addEventListener("click", pauseTimer);
timerReset.addEventListener("click", resetTimer);

// initial render
updateTimerUI();

// ========== WEATHER SECTION ==========

// DOM elements
const weatherCity = document.getElementById("weather-city");
const weatherTemp = document.getElementById("weather-temp");
const weatherCondition = document.getElementById("weather-condition");
const weatherUpdate = document.getElementById("weather-updated");
const weatherImage = document.getElementById("weather-image");

// API config
const apiKey = "08e788ea1be5bea3aa833afa3a47a872"; // api key
const city = "Rewa";
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`; // [web:140]


function getWeatherImage(condition) {
  const main = condition.toLowerCase(); // e.g. "clear", "clouds", "rain" [web:146]

  if (main.includes("rain") || main.includes("drizzle")) {
    return "https://i.pinimg.com/1200x/08/b3/90/08b390852866ed9c430aa458c7cf536f.jpg"; // rainy
  }

  if (main.includes("snow")) {
    return "https://i.pinimg.com/1200x/25/16/f3/2516f3f5d84bdd95c9a1a2fe9957a593.jpg"; // snow
  }

  if (main.includes("cloud")) {
    return "https://i.pinimg.com/1200x/19/f8/7b/19f87bd46606fab1d51bbd2c99760091.jpg"; // cloudy
  }

  if (main.includes("thunder") || main.includes("storm")) {
    return "https://i.pinimg.com/1200x/95/94/7f/95947f1c426fa15534f6f9712b97b1c2.jpg"; // thunder
  }

  if (main.includes("mist") || main.includes("fog") || main.includes("haze")) {
    return "https://i.pinimg.com/1200x/4b/27/44/4b274467f090cd918e05fe6a0b8ca8fc.jpg"; // fog
  }

  // default: clear / sunny
  return "https://i.pinimg.com/736x/0a/8c/34/0a8c34f5a10e0fc64d11c069285287c9.jpg"; // sunny
}

// main function
function fetchWeather() {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      // values from API [web:140][web:146]
      const cityName = data.name;              // e.g. "Rewa" [web:140]
      const temp = data.main.temp;             // °C (units=metric) [web:140]
      const condition = data.weather[0].main;  // "Clear", "Clouds", "Rain"... [web:146]

      // update text
      weatherCity.textContent = cityName;
      weatherTemp.textContent = Math.round(temp) + "°C";
      weatherCondition.textContent = condition;

      // update background image
      const imgSrc = getWeatherImage(condition);
      weatherImage.src = imgSrc;
      weatherImage.alt = condition + " weather";

      // updated time
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      weatherUpdate.textContent = `Updated: ${hours}:${minutes}`;
    })
    .catch(error => {
      console.error("Error fetching weather:", error);
      weatherCity.textContent = "Error";
      weatherTemp.textContent = "--";
      weatherCondition.textContent = "Unable to load";
      weatherUpdate.textContent = "Update failed";
      weatherImage.src = "";
      weatherImage.alt = "";
    });
}

fetchWeather();

// ========== WATER INTAKE SECTION ==========

const waterGoalEl = document.getElementById("water-goal");
const waterCurrentEl = document.getElementById("water-current");
const waterPercentEl = document.getElementById("water-percent");
const waterProgressBar = document.getElementById("water-progress-bar");
const waterAddButtons = document.querySelectorAll(".water-add");
const waterResetBtn = document.getElementById("water-reset");

// numbers me convert
let waterGoal = parseInt(waterGoalEl.textContent, 10) || 4000;
let waterCurrent = 0;

// localStorage se load
function loadWaterFromStorage() {
  const saved = localStorage.getItem("daily-water");
  const savedDate = localStorage.getItem("daily-water-date");

  const today = new Date().toDateString();

  if (saved && savedDate === today) {
    waterCurrent = parseInt(saved, 10) || 0;
  } else {
    waterCurrent = 0;
    localStorage.removeItem("daily-water");
    localStorage.setItem("daily-water-date", today);
  }
}

// save
function saveWaterToStorage() {
  localStorage.setItem("daily-water", waterCurrent.toString());
  localStorage.setItem("daily-water-date", new Date().toDateString());
}

// UI update
function updateWaterUI() {
  if (waterCurrent < 0) waterCurrent = 0;
  if (waterCurrent > waterGoal) waterCurrent = waterGoal;

  waterCurrentEl.textContent = waterCurrent;

  const percent = Math.min(100, Math.round((waterCurrent / waterGoal) * 100));
  waterPercentEl.textContent = percent + "%";
  waterProgressBar.style.width = percent + "%";
}

// add water (goal se upar restrict)
function addWater(amount) {
  // already goal pe ho to aage mat badha
  if (waterCurrent >= waterGoal) {
    waterCurrent = waterGoal;
    updateWaterUI();
    return;
  }

  const nextValue = waterCurrent + amount;

  if (nextValue >= waterGoal) {
    waterCurrent = waterGoal;
  } else {
    waterCurrent = nextValue;
  }

  saveWaterToStorage();
  updateWaterUI();
}

// reset
function resetWater() {
  waterCurrent = 0;
  saveWaterToStorage();
  updateWaterUI();
}

// button listeners
waterAddButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const amount = parseInt(btn.dataset.amount, 10) || 0;
    if (amount > 0) {
      addWater(amount);
    }
  });
});

if (waterResetBtn) {
  waterResetBtn.addEventListener("click", resetWater);
}

// init
loadWaterFromStorage();
updateWaterUI();

// ========== NOTES SECTION ==========

const notesText = document.getElementById("notes-text");
const NOTES_STORAGE_KEY = "daily-planner-notes";

// load note from localStorage
function loadNotes() {
  const saved = localStorage.getItem(NOTES_STORAGE_KEY);
  if (saved !== null) {
    notesText.value = saved;
  }
}

// save note to localStorage
function saveNotes() {
  localStorage.setItem(NOTES_STORAGE_KEY, notesText.value);
}

// har input pe auto-save
if (notesText) {
  notesText.addEventListener("input", () => {
    // light debounce nahi bhi lagayega to bhi theek hai; localStorage isi tarah use hota hai [web:286][web:289]
    saveNotes();
  });
}

// init
loadNotes();

// =====DATE=====
const date = document.querySelector('.date');

import "./style.css";

let countdown;
const timerDisplay = document.querySelector(".display__time-left");
const endTime = document.querySelector(".display__end-time");
const buttons = document.querySelectorAll("[data-time]");
const resetButton = document.querySelector(".reset");

function timer(seconds) {
  // clear any existing timers
  clearInterval(countdown);

  const now = Date.now();
  const then = now + seconds * 1000;
  displayTimeLeft(seconds);
  displayEndTime(then);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    localStorage.setItem("seconds", secondsLeft);
    // check if we should stop it!
    if (secondsLeft < 0) {
      localStorage.removeItem("seconds");
      clearInterval(countdown);
      return;
    }
    // display it
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainderSeconds = seconds % 60;
  const remainderMinutes = minutes % 60;

  const display = `${hours < 10 ? "0" : ""}${hours}:${
    remainderMinutes < 10 ? "0" : ""
  }${remainderMinutes}:${remainderSeconds < 10 ? "0" : ""}${remainderSeconds}`;

  document.title = display;
  timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  const adjustedHour = hour > 12 ? hour - 12 : hour;
  const minutes = end.getMinutes();
  endTime.textContent = `Be Back At ${adjustedHour}:${
    minutes < 10 ? "0" : ""
  }${minutes}`;
}

function startTimer() {
  const seconds = parseInt(this.dataset.time);
  localStorage.setItem("seconds", seconds);
  timer(seconds);
}

function resumeTimer() {
  // This function will run only when page is refreshed.
  // This will start the timer when there is timer set before.
  if (localStorage.getItem("seconds")) {
    timer(+localStorage.getItem("seconds"));
  }
}

function resetTimer() {
  timer(0);
}

window.onload = resumeTimer;
resetButton.addEventListener("click", resetTimer);
buttons.forEach((button) => button.addEventListener("click", startTimer));
document.customForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const mins = this.minutes.value;

  localStorage.setItem("seconds", mins * 60);
  timer(mins * 60);
  this.reset();
});

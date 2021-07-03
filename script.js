const inputContainer = document.getElementById("input-container");
const countdownForm = document.getElementById("countdown-form");
const dateEl = document.getElementById("date-picker");
const inputForm = document.getElementById("title");
const datePicker = document.getElementById("date-picker");

const countDownContainer = document.getElementById("countdown");
countDownContainer.innerHTML = "";

const completeContainer = document.getElementById("complete");
completeContainer.innerHTML = "";

let countDownTitle = "";
let countDownDate = "";
let countdownValue = new Date();
let savedCountDown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

//set date input min:
const dateToday = new Date().toISOString().split("T")[0];
console.log(dateToday);

dateEl.setAttribute("min", dateToday);

//take values from from input
function updateCountdown(e) {
  e.preventDefault();
  // console.log(e);

  countDownTitle = e.srcElement[0].value.toUpperCase();
  countDownDate = e.srcElement[1].value;
  console.log(countDownTitle, countDownDate);

  //saving in localstorage
  savedCountDown = {
    title: countDownTitle,
    date: countDownDate,
  };

  console.log(savedCountDown);
  localStorage.setItem("countdown", JSON.stringify(savedCountDown));

  //get number version of current date:
  countdownValue = new Date(countDownDate).getTime();

  //checking for valid date
  if (isNaN(countdownValue) || countDownTitle === " ") {
    alert("insert a date");
  } else {
    updateCountDownUI();
  }
}

//hiddding the form UI and upating the countdown ui
const updateCountDownUI = function () {
  countDownActive = setInterval(() => {
    const now = new Date().getTime();
    // console.log("now", now);
    const timeLeft = countdownValue - now;
    // console.log(timeLeft);

    const days = Math.floor(timeLeft / day);
    const hours = Math.floor((timeLeft % day) / hour);
    const minutes = Math.floor((timeLeft % hour) / minute);
    const seconds = Math.floor((timeLeft % minute) / second);

    // console.log(days, hours, minutes, seconds);

    //if countdown is ended--------------------------------------------------------
    if (timeLeft < 0) {
      inputContainer.hidden = true;
      clearInterval(countDownActive);

      const html = `<h1 class="complete-title countdown-animation">
      Countdown Complete 🎉
    </h1>
    <h1 id="complete-info" class="complete-title countdow-finish">
      Countdown Finished on ${countDownDate}
    </h1>
    <div class="button-center button-complete">
      <button id="complete-button">New countdown</button>
    </div>`;

      countDownContainer.hidden = true;
      completeContainer.hidden = false;
      completeContainer.insertAdjacentHTML("afterbegin", html);

      //buttonfunctionality:
      const newCountdownBtn = document.getElementById("complete-button");
      newCountdownBtn.addEventListener("click", setNewCountDown);
    }

    const html = `<h1 id="countdown-title">${countDownTitle}</h1>
    <ul>
      <li><span>${days}</span>days</li>
      <li><span>${hours}</span>hours</li>
      <li><span>${minutes}</span>minutes</li>
      <li><span>${seconds}</span>seconds</li>
    </ul>
    <div class="button-center button-reset">
      <button id="countdown-button">Reset</button>
    </div>`;

    //clearing input fields:
    clearInputFields();

    countDownContainer.hidden = false;

    inputContainer.hidden = true;
    countDownContainer.innerHTML = "";
    countDownContainer.insertAdjacentHTML("afterbegin", html);

    //reset button event listener
    const resetbtn = document.getElementById("countdown-button");
    resetbtn.addEventListener("click", resetFormContainerUI);
  }, 1000);
};

//reseting the form UI and updating the form UI
function resetFormContainerUI() {
  console.log("reset");
  inputContainer.removeAttribute("hidden");
  countDownContainer.setAttribute("hidden", true);

  //removing value from local storage
  localStorage.removeItem("countdown");

  //stopping set interval
  clearInterval(countDownActive);
}

//setting new countdown:
function setNewCountDown() {
  console.log("hi");
  inputContainer.hidden = false;
  completeContainer.hidden = true;

  //clearing input fields:
  clearInputFields();
}

//clearing input fields
function clearInputFields() {
  inputForm.value = "";
  inputForm.blur();
  datePicker.value = "";
  datePicker.blur();
}

//restore previous countdown:
function restorePreviousCountDown() {
  if (localStorage.getItem("countdown")) {
    inputContainer.hidden = true;
    savedCountDown = JSON.parse(localStorage.getItem("countdown"));
    countDownTitle = savedCountDown.title;
    countDownDate = savedCountDown.date;

    //get number version of current date:
    countdownValue = new Date(countDownDate).getTime();
    updateCountDownUI();
  }
}

//event listener
countdownForm.addEventListener("submit", updateCountdown);

//on load
restorePreviousCountDown();

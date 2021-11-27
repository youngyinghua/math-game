const gameOptionsEl = Array.from(
  document.getElementsByClassName("game-options")
);
const bestScoreEl = Array.from(document.getElementsByClassName("score"));
const startRoundEl = document.querySelector(".startRound");
const answerEl = document.getElementById("answer");
const gameContainerEl = document.querySelector(".game-options-container");
const countDownEl = document.querySelector(".count-down");
const btnContainer = document.querySelector(".btn-container");
const questionsEl = document.getElementById("questions");
const table = document.querySelector("table");
const resultEl = document.querySelector(".result");
const durationEl = document.getElementById("duration");
const baseTimeEl = document.getElementById("base-time");
const penaltyEl = document.getElementById("penalty");
const playAgainEl = document.querySelector(".play-again");

let selected = new Number();
let gameIndex = new Number();
let countDown;
let questions = [];
let answers = [];
let playerAnswers = [];
let result = { right: 0, wrong: 0, duration: 0, penalty: 0 };
let questionNum = 1;
let timeStart = false;
let startTime = new Date();
let completeTime = new Date();
let durationTime = 0;
let bestScores = {
  Q10: "0.0",
  Q25: "0.0",
  Q50: "0.0",
  Q99: "0.0",
};

function loadLocalScores() {
  if (!localStorage.getItem("bestScores")) return;
  const localStoredScore = JSON.parse(localStorage.getItem("bestScores"));
  const indexArray = ["Q10", "Q25", "Q50", "Q99"];
  for (let i = 0; i < bestScoreEl.length; i++) {
    bestScoreEl[i].textContent = localStoredScore[indexArray[i]];
  }
}

function selectGame(number, index) {
  gameOptionsEl.forEach((option) => option.classList.remove("selected"));
  gameOptionsEl[index].classList.add("selected");
  selected = number;
  gameIndex = index;
}

function startRound() {
  if (![10, 25, 50, 99].includes(selected)) return;
  gameContainerEl.classList.add("hidden");
  btnContainer.classList.add("hidden");
  countDownEl.classList.remove("hidden");
  let countDownNumber = 3;
  countDown = setInterval(() => {
    countDownNumber--;
    if (countDownNumber < 0) {
      countDownEl.classList.add("hidden");
      showTable();
      clearInterval(countDown);
    }
    countDownEl.textContent = countDownNumber > 0 ? countDownNumber : "GO!";
  }, 1000);
}

const showTable = () => {
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
  btnContainer.classList.remove("hidden");
  startRoundEl.classList.add("hidden");
  answerEl.classList.remove("hidden");
  questionsEl.classList.remove("hidden");
  const tbody = document.createElement("tbody");
  if (questionNum === 1) {
    createQuestions(selected);
  }
  const shownQuestions = questions.slice(questionNum - 1, questionNum + 6);
  shownQuestions.forEach((question) => {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.textContent = question;
    tr.appendChild(td);
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
};

const selectAnswer = (string) => {
  if (!timeStart) {
    timeStart = true;
    startTime = new Date();
  }
  if (string === "wrong") {
    playerAnswers.push(false);
  } else {
    playerAnswers.push(true);
  }
  if (questionNum > selected - 1) {
    timeOver = true;
    completeTime = new Date();
    durationTime = (completeTime - startTime) / 1000;
    for (let i = 0; i < answers.length; i++) {
      answers[i] === playerAnswers[i] ? result.right++ : result.wrong++;
    }
    answerEl.classList.add("hidden");
    btnContainer.classList.add("hidden");
    questionsEl.classList.add("hidden");
    resultEl.classList.remove("hidden");

    result.duration = durationTime;
    result.penalty = result.wrong * 2;
    const totalDuration = durationTime + result.penalty;
    durationEl.textContent = `${totalDuration.toFixed(1)}s`;
    baseTimeEl.textContent = `Base Time: ${durationTime.toFixed(1)}s`;
    penalty.textContent = `Penalty: +${result.penalty.toFixed(1)}s`;

    const bestScoresIndex = "Q" + selected;
    let localBestScores = JSON.parse(localStorage.getItem("bestScores"));
    if (
      !localBestScores ||
      Number(localBestScores[bestScoresIndex]) > totalDuration ||
      localBestScores[bestScoresIndex] === "0.0"
    ) {
      localBestScores = localBestScores ? localBestScores : bestScores;
      localBestScores[bestScoresIndex] = totalDuration.toFixed(1);
      localStorage.setItem("bestScores", JSON.stringify(localBestScores));
      bestScoreEl[gameIndex].textContent = `${totalDuration.toFixed(1)}s`;
    }
    setTimeout(() => {
      btnContainer.classList.remove("hidden");
      btnContainer.classList.add("no-background");
      playAgainEl.classList.remove("hidden");
    }, 2000);
    return;
  }
  questionNum++;
  showTable();
};

const swiftNum = (number) => {
  if (number < 10) {
    return "1" + number;
  }
  let numString = number.toString();
  if (numString.includes("0")) {
    return "0";
  } else {
    return numString[1] + numString[0];
  }
};

const createQuestions = (number) => {
  let questionArray = [];
  let answerArray = [];
  for (let i = 0; i < number; i++) {
    const a = Math.floor(10 * Math.random());
    const b = Math.floor(10 * Math.random());
    const multipy = a * b;
    let string = "";
    switch (Math.floor(10 * Math.random())) {
      //set question ture;
      case 0:
      case 1:
      case 2:
      case 3:
        answerArray.push(true);
        questionArray.push(`${a} x ${b} = ${multipy}`);
        break;
      //set question wrong
      case 4:
      case 5:
        answerArray.push(false);
        string =
          multipy > 10 ? (multipy - a).toString() : (multipy + a).toString();
        questionArray.push(`${a} x ${b} = ${string}`);
        break;
      case 6:
      case 7:
        answerArray.push(false);
        string =
          multipy > 10 ? (multipy - b).toString() : (multipy + b).toString();
        questionArray.push(`${a} x ${b} = ${string}`);
        break;
      case 8:
      case 9:
        answerArray.push(false);
        string = swiftNum(multipy);
        questionArray.push(`${a} x ${b} = ${string}`);
        break;
    }
  }
  questionArray.unshift("", "", "");
  questionArray.push("", "", "");
  questions = questionArray;
  answers = answerArray;
};

const playAgain = () => {
  btnContainer.classList.remove("no-background");
  playAgainEl.classList.add("hidden");
  resultEl.classList.add("hidden");
  startRoundEl.classList.remove("hidden");
  gameContainerEl.classList.remove("hidden");
  questions = [];
  answers = [];
  playerAnswers = [];
  result = { right: 0, wrong: 0, duration: 0, penalty: 0 };
  questionNum = 1;
  timeStart = false;
  startTime = new Date();
  completeTime = new Date();
  durationTime = 0;
  countDownEl.textContent = 3;
};

startRoundEl.addEventListener("click", startRound);
playAgainEl.addEventListener("click", playAgain);

loadLocalScores();

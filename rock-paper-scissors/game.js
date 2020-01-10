// Logic for a simple rock-paper-scissors game
//Global variables
const plays = ["rock", "paper", "scissors"];
const winningScore = 5;

//Scores
let playerPoints = 0;
let computerPoints = 0;
let winner = "";

//Choices
let playerSelection = "";
let computerSelection = computerPlay();

//Assign selectors to variables
let playerChoseText = document.querySelector(".playerChose");
let computerChoseText = document.querySelector(".computerChose");
let roundResultText = document.querySelector(".roundResult");
let winnerText = document.querySelector(".winner");
let playerPointsText = document.querySelector(".playerPoints");
let computerPointsText = document.querySelector(".computerPoints");

//Randomise the computer's choice
function computerPlay() {
  return plays[Math.round(Math.random() * plays.length)];
}

//Clicking the Images calls these
let rockImg = document.querySelector(".rock");
rockImg.addEventListener("click", () => playerSelectedMove("rock"));

let paperImg = document.querySelector(".paper");
paperImg.addEventListener("click", () => playerSelectedMove("paper"));

let scissorsImg = document.querySelector(".scissors");
scissorsImg.addEventListener("click", () => playerSelectedMove("scissors"));

//Every Move Counts :)
function playerSelectedMove(playerInput) {
  playerSelection = playerInput;
  playRound(playerSelection, computerPlay());
}

function playRound(playerSelection, computerSelection) {
  if (winner) return;

  playerChoseText.textContent = "You Chose  " + playerSelection.toUpperCase();
  computerChoseText.textContent =
    "Computer Chose " + computerSelection.toUpperCase();

  switch (playerSelection) {
    case "rock":
      {
        if (computerSelection == "paper") {
          computerPoints++;
          roundResultText.textContent = "Computer gets a point.";
        } else if (computerSelection == "scissors") {
          playerPoints++;
          roundResultText.textContent = "Player gets a point.";
        } else {
          roundResultText.textContent = "TIED!";
        }
      }
      break;
    case "paper":
      {
        if (computerSelection == "scissors") {
          computerPoints++;
          roundResultText.textContent = "Computer gets a point.";
        } else if (computerSelection == "rock") {
          playerPoints++;
          roundResultText.textContent = "Player gets a point.";
        } else {
          roundResultText.textContent = "TIED!";
        }
      }
      break;
    case "scissors": {
      if (computerSelection == "rock") {
        computerPoints++;
        roundResultText.textContent = "Computer gets a point.";
      } else if (computerSelection == "paper") {
        playerPoints++;
        roundResultText.textContent = "Player gets a point.";
      } else {
        roundResultText.textContent = "TIED!";
      }
    }
  }
  playerPointsText.textContent = playerPoints;
  computerPointsText.textContent = computerPoints;
  checkWinner();
}

//Check for Winner and create a Play Again Button for replayability

function checkWinner() {
  if (playerPoints >= winningScore || computerPoints >= winningScore) {
    playerPoints > computerPoints ? (winner = "Player") : (winner = "Computer");
    winnerText.textContent = winner + " WINS!";

    var btn = document.createElement("BUTTON");
    btn.innerHTML = "Play Again?";
    btn.classList.add("playAgain");
    let roundShowcase = document.querySelector(".roundShowcase");
    roundShowcase.appendChild(btn);

    btn.addEventListener("click", () => document.location.reload());
  }
}

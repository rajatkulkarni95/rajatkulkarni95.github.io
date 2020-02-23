//Element Declarations
const container = document.querySelector(".container");
const seating = document.querySelector(".seating");
const seat = document.querySelector(".seat");
const total = document.querySelector("#total");
const bronzePrice = document.querySelector("#bronze-price");
const silverPrice = document.querySelector("#silver-price");
const goldPrice = document.querySelector("#gold-price");
const paraText = document.querySelector(".text");
const movieTitle = document.getElementById("movie-title");
const bronze_seats = document.getElementById("bronze-seats");
const silver_seats = document.getElementById("silver-seats");
const gold_seats = document.getElementById("gold-seats");

//Random BaseTicket Price
let baseTicketPrice = Math.floor(Math.random() * (13 - 8 + 1)) + 8;
updateTicketPrice(baseTicketPrice);

//Retrieve Title and Image Stored in Local Storage from index.html
let title = sessionStorage.getItem("title");
movieTitle.innerHTML = title;

let moviePoster = sessionStorage.getItem("imageSrc");
document.getElementById("movie-poster").src = moviePoster;

//Selected Seats
function updateSelectedCount() {
  const seats = document.querySelectorAll(".seat");
  let ticketPrice = 0;
  const selectedSeats = document.querySelectorAll(".row .seat.selected");
  let bronzeSeats = 0,
    silverSeats = 0,
    goldSeats = 0;
  const selectedSeatCount = selectedSeats.length;

  //Different Pricing for Bronze,Silver or Gold Seats
  const seatIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));
  seatIndex.forEach(value => {
    if (value < 20) {
      bronzeSeats++;
      ticketPrice += baseTicketPrice;
    } else if (value < 44) {
      silverSeats++;
      ticketPrice += Math.round(baseTicketPrice * 1.2, 2);
    } else {
      goldSeats++;
      ticketPrice += Math.round(baseTicketPrice * 1.5, 2);
    }
  });

  //Total Contains Breakdown of Seats (Bronze, Silver or Gold and Number)
  if (bronzeSeats !== 0) {
    bronze_seats.innerText = `${bronzeSeats} Bronze`;
  } else {
    while (bronze_seats.firstChild) {
      bronze_seats.removeChild(bronze_seats.firstChild);
    }
  }
  if (silverSeats !== 0) {
    silver_seats.innerHTML = `${silverSeats} Silver`;
  } else {
    while (silver_seats.firstChild) {
      silver_seats.removeChild(silver_seats.firstChild);
    }
  }
  if (goldSeats !== 0) {
    gold_seats.innerHTML = `${goldSeats} Gold`;
  } else {
    while (gold_seats.firstChild) {
      gold_seats.removeChild(gold_seats.firstChild);
    }
  }

  total.innerHTML = ticketPrice;
}

//BaseTicket Price for Movie-Container
function updateTicketPrice(baseTicketPrice) {
  bronzePrice.innerHTML = `($${baseTicketPrice})`;
  silverPrice.innerHTML = `($${Math.round(baseTicketPrice * 1.2)})`;
  goldPrice.innerHTML = `($${Math.round(baseTicketPrice * 1.5)})`;
}

//Color Code Seats
const colorCode = document.addEventListener("DOMContentLoaded", () => {
  createSeating();
  const seats = document.querySelectorAll(".seat");
  seats.forEach(value => {
    if (value.parentElement.classList.contains("bronze-row")) {
      value.className += " bronze";
    } else if (value.parentElement.className.match("silver-row")) {
      value.className += " silver";
    } else if (value.parentElement.className.match("gold-row")) {
      value.className += " gold";
    }
  });
  randomOccupiedSeats();
});

function createSeating() {
  //Create Individual Rows
  for (let rowCount = 0; rowCount < 7; rowCount++) {
    var createRow = document.createElement("div");
    createRow.className = "row";
    if (rowCount < 2) {
      createRow.className += " bronze-row";
      createRow.id = rowCount;
    } else if (rowCount < 5) {
      createRow.className += " silver-row";
      createRow.id = rowCount;
    } else {
      createRow.className += " gold-row";
      createRow.id = rowCount;
    }
    //Spacing between Bronze, Silver and Gold Rows
    if (rowCount == 2) {
      var createBlankRow = document.createElement("div");
      createBlankRow.className = "bronze-blank-row";
      createBlankRow.innerHTML = "&nbsp;";
      document.getElementById("seating").appendChild(createBlankRow);
    } else if (rowCount == 5) {
      var createBlankRow = document.createElement("div");
      createBlankRow.className = "silver-blank-row";
      createBlankRow.innerHTML = "&nbsp;";
      document.getElementById("seating").appendChild(createBlankRow);
    }

    document.getElementById("seating").appendChild(createRow);
    //Create Individual Seat in Rows
    for (let seatCount = 0; seatCount < 8; seatCount++) {
      var createSeat = document.createElement("div");
      createSeat.className = "seat";
      createSeat.id = rowCount + "-" + seatCount;
      document.getElementById(rowCount).appendChild(createSeat);
    }
  }
}

//Select Random Seats to be occupied
function randomOccupiedSeats() {
  for (i = 0; i < 6; i++) {
    let randomRow = Math.floor(Math.random() * (6 - 0 + 1)) + 0;
    let randomSeat = Math.floor(Math.random() * (7 - 0 + 1)) + 0;
    var randomOccupiedSeat = document.getElementById(
      randomRow + "-" + randomSeat
    );
    if (!randomOccupiedSeat.classList.contains("occupied")) {
      randomOccupiedSeat.className += " occupied";
    }
  }
}

/* //Change Option Event Listener
movie.addEventListener("change", e => {
  baseTicketPrice = +e.target.value;
  updateTicketPrice(baseTicketPrice);
  updateSelectedCount();
}); */

//Click Event Listener
container.addEventListener("click", e => {
  if (
    e.target.classList.contains("seat") &&
    !e.target.classList.contains("occupied")
  ) {
    e.target.classList.toggle("selected");
  }
  updateSelectedCount();
});

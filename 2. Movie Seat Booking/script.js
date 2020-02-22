//Element Declarations
const container = document.querySelector(".container");
const seats = document.querySelectorAll(".seat");
const seat = document.querySelector(".seat");
const count = document.querySelector("#count");
const total = document.querySelector("#total");
const bronzePrice = document.querySelector("#bronze-price");
const silverPrice = document.querySelector("#silver-price");
const goldPrice = document.querySelector("#gold-price");
const paraText = document.querySelector(".text");
const movieTitle = document.getElementById("movie-title");

let baseTicketPrice = Math.floor(Math.random() * (13 - 8 + 1)) + 8;
updateTicketPrice(baseTicketPrice);

let title = sessionStorage.getItem("title");
movieTitle.innerHTML = title;

//Selected Seats
function updateSelectedCount() {
  let ticketPrice = 0;
  const selectedSeats = document.querySelectorAll(".row .seat.selected");

  const selectedSeatCount = selectedSeats.length;

  const seatIndex = [...selectedSeats].map(seat => [...seats].indexOf(seat));
  console.log(seatIndex);
  seatIndex.forEach(value => {
    if (value < 20) {
      ticketPrice += baseTicketPrice;
    } else if (value < 44) {
      ticketPrice += Math.round(baseTicketPrice * 1.2, 2);
    } else {
      ticketPrice += Math.round(baseTicketPrice * 1.5, 2);
    }
  });

  count.innerHTML = selectedSeatCount;
  total.innerHTML = ticketPrice;
}

function updateTicketPrice(baseTicketPrice) {
  bronzePrice.innerHTML = `($${baseTicketPrice})`;
  silverPrice.innerHTML = `($${Math.round(baseTicketPrice * 1.2)})`;
  goldPrice.innerHTML = `($${Math.round(baseTicketPrice * 1.5)})`;
}

function updateTotal() {
  paraText.innerHTML = "Selected Seats:";
  let list = paraText.createElement("ul");
}

//Color Code Seats
const colorCode = document.addEventListener("DOMContentLoaded", () => {
  seats.forEach(value => {
    if (value.parentElement.id.match("bronze-row")) {
      value.className += " bronze";
    } else if (value.parentElement.id.match("silver-row")) {
      value.className += " silver";
    } else if (value.parentElement.id.match("gold-row")) {
      value.className += " gold";
    }
  });
});

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

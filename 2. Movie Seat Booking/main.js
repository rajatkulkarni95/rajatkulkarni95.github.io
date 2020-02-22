const auth_key = "054ee225d1a58a5676de19ed33695875";
const trending_url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${auth_key}`;
const containerClass = document.querySelector("#container");
const baseURL = "https://image.tmdb.org/t/p/w200";

document.addEventListener("DOMContentLoaded", () => {
  fetch(trending_url).then(parseJSON);
});

function parseJSON(request, i) {
  return request.json().then(function(parsedData) {
    for (i = 0; i < parsedData.results.length / 2; i++) {
      updateTitleScreen(parsedData.results[i]);
    }
  });
}

function updateTitleScreen(info) {
  var title = info.title;
  var image = baseURL + info.poster_path;
  var overview = info.overview;

  var imageClass = document.createElement("a");
  imageClass.id = "poster-image " + info.id;
  imageClass.href = "./seating.html";
  document.getElementById("container").appendChild(imageClass);

  var imgDiv = document.createElement("img");
  imgDiv.src = image;
  imgDiv.id = info.id;
  imgDiv.alt = title;

  document.getElementById("poster-image " + info.id).append(imgDiv);
  /* 
  var titleInfo = document.createElement("span");
  titleInfo.innerHTML = title;
  document.getElementById("container").appendChild(titleInfo); */
}

containerClass.addEventListener(
  "click",
  function(e) {
    e = e || window.event;
    var target = e.target;
    if (target.tagName == "IMG") {
      sessionStorage.setItem("title", target.alt);
    }
  },
  false
);

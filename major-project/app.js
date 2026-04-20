// inserting api key and base url for movies, animes, and tv shows

let API_KEY = "cde1749586d2a3fb9fb009e0a840170a";

// movie and tv api details
let BASE_URL = "https://api.themoviedb.org/3";
let IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

// anime api details
let ANIME_HOST = "anime-db.p.rapidapi.com";
let ANIME_KEY = "3be5c42222msh87ba54a21a304e3p13f5f9jsn13227e04e32e";

let currentPage = 1;
let currentQuery = "";


//search through movies, tv shows, and anime based on the query and page number
async function searchAllMedia(query, page = 1) {
  try {
    // fetch movies, tv, and anime
    let movieRes = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`);
    let tvRes = await fetch(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${query}&page=${page}`);

    let movieData = await movieRes.json();
    let tvData = await tvRes.json();

    let animeData = await searchAnime(query);

    // format movies
    let formattedMovies = movieData.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      type: "movie"
    }));

    // format TV shows
    let formattedTV = tvData.results.map(show => ({
      id: show.id,
      title: show.name,
      overview: show.overview,
      poster_path: show.poster_path,
      vote_average: show.vote_average,
      release_date: show.first_air_date,
      type: "tv"
    }));

    // format anime
    let formattedAnime = animeData.map(anime => ({
      id: anime._id,
      title: anime.title,
      overview: anime.synopsis,
      poster_path: anime.image,
      type: "anime"
    }));

    // combine ALL
    let combined = [
      ...formattedMovies,
      ...formattedTV,
      ...formattedAnime
    ];

    displaySearchResults(combined, page === 1);

  } catch (error) {
    console.error("Search error:", error);
  }
}


//  SEARCH ANIME

async function searchAnime(query) {
  let url = `https://${ANIME_HOST}/anime?page=1&size=10&search=${query}`;

  let options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": ANIME_KEY,
      "x-rapidapi-host": ANIME_HOST
    }
  };

  try {
    let response = await fetch(url, options);
    let data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Anime error:", error);
    return [];
  }
}



//  RESULTS

function displaySearchResults(results, clear = false) {
  let container = document.getElementById("results");

  if (clear) container.innerHTML = "";

  if (!results || results.length === 0) {
    container.innerHTML = "<p>No results found.</p>";
    return;
  }

  results.forEach(item => {
    let imageUrl;

    if (item.type === "movie" || item.type === "tv") {
      imageUrl = item.poster_path
        ? `${IMAGE_BASE}${item.poster_path}`
        : "/Images/no-image.png";
    } else {
      imageUrl = item.poster_path || "/Images/no-image.png";
    }

    let div = document.createElement("div");

    div.innerHTML = `
      <div class="movie-card">
        <button class="details-btn" data-id="${item.id}" data-type="${item.type}">
          <img src="/Images/dots.png">
        </button>
        <img src="${imageUrl}">
        <h3>${item.title}</h3>
        <p>${item.type.toUpperCase()}</p>
      </div>
    `;

    container.appendChild(div);

    
    });
    //applies event listener to each details button after results are displayed
    document.querySelectorAll(".details-btn").forEach(button => {
      button.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        const type = this.getAttribute("data-type");

        handleDetails(id, type);
      
      });
  });
}


//  DETAILS HANDLER

function handleDetails(id, type) {
  if (type === "movie") {
    getMovieDetails(id);
  } else if (type === "tv") {
    getTVDetails(id);
  } else {
    getAnimeDetails(id);
  }
}


// MOVIE DETAILS

async function getMovieDetails(id) {
  let url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}`;

  let response = await fetch(url);
  let data = await response.json();

  displayMovieDetails(data);
}

// TV DETAILS

async function getTVDetails(id) {
  let url = `${BASE_URL}/tv/${id}?api_key=${API_KEY}`;

  let response = await fetch(url);
  let data = await response.json();

  displayTVDetails(data);
}


//  ANIME DETAILS

async function getAnimeDetails(id) {
  let url = `https://${ANIME_HOST}/anime/by-id/${id}`;

  let options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": ANIME_KEY,
      "x-rapidapi-host": ANIME_HOST
    }
  };

  let response = await fetch(url, options);
  let data = await response.json();

  displayAnimeDetails(data);
}


//  DISPLAY MOVIE DETAILS

function displayMovieDetails(movie) {
  let container = document.getElementById("modalDetails");

  let imageUrl = movie.poster_path
    ? `${IMAGE_BASE}${movie.poster_path}`
    : "/Images/no-image.png";

  container.innerHTML = `
    <h2>${movie.title}</h2>
    <img src="${imageUrl}">
    <p>${movie.overview}</p>
    <p>⭐ ${movie.vote_average}</p>
    <p>${movie.release_date}</p>
  `;
  openModal();
}

//  DISPLAY TV DETAILS
function displayTVDetails(show) {
  let container = document.getElementById("modalDetails");

  let imageUrl =
    show.poster_path && show.poster_path.startsWith("/")
      ? `${IMAGE_BASE}${show.poster_path}`
      : show.poster_path || "/Images/no-image.png";

  container.innerHTML = `
    <h2>${show.name}</h2>
    <img src="${imageUrl}">
    <p>${show.overview}</p>
    <p>⭐ ${show.vote_average}</p>
    <p>First Air Date: ${show.first_air_date}</p>
  `;
  openModal();
}

//  DISPLAY ANIME DETAILS

function displayAnimeDetails(anime) {
  let container = document.getElementById("modalDetails");

  container.innerHTML = `
    <h2>${anime.title}</h2>
    <img src="${anime.image}">
    <p>${anime.synopsis}</p>
    <p>⭐ Rank: ${anime.ranking}</p>
    <p>Episodes: ${anime.episodes}</p>
  `;
  openModal();
}


//modal open and close

function openModal() {
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

//close modal when clicking outside of it
window.onclick = function (e) {
  let modal = document.getElementById("modal");
  if (e.target === modal) {
    closeModal();
  }
};

//  search handler

window.handleSearch = function () {
  let input = document.getElementById("searchInput").value;

  if (!input.trim()) return;

  currentQuery = input;
  currentPage = 1;

  searchAllMedia(currentQuery, currentPage);
};

// enter key results in search

document.addEventListener("DOMContentLoaded", () => {
  let input = document.getElementById("searchInput");

  document.getElementById("closeModal").addEventListener("click", closeModal);

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });
});


// load more results when button is clicked

function loadMore() {
  currentPage++;
  searchAllMedia(currentQuery, currentPage);
}
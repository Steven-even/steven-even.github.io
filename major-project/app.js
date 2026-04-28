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
let currentItem = null;

// Save item to list in localStorage
function saveToList(listName, item) {
  let list = JSON.parse(localStorage.getItem(listName)) || [];
  let exists = list.some(i => i.id === item.id && i.type === item.type);
  if (!exists) {
    list.push(item);
    localStorage.setItem(listName, JSON.stringify(list));
  }
}


// Display items from a list in a grid
function displayList(listName, gridId) {
  let list = JSON.parse(localStorage.getItem(listName)) || [];
  let grid = document.getElementById(gridId);

  if (!grid) return; // Element doesn't exist on this page

  if (list.length === 0) {
    grid.innerHTML = '<div class="empty-message">No items yet. Search and add from the main page!</div>';
    return;
  }

  grid.innerHTML = '';

  list.forEach((item, index) => {
    let imageUrl;

    if (item.type === "movie" || item.type === "tv") {
      imageUrl = item.poster_path
        ? IMAGE_BASE + item.poster_path
        : "/Images/no-image.png";
    } else {
      imageUrl = item.poster_path || "/Images/no-image.png";
    }

    let itemDiv = document.createElement("div");
    itemDiv.className = "library-item";
    itemDiv.innerHTML = `
      <button class="remove-btn" onclick="removeItem('${listName}', ${index})">X</button>
      <img src="${imageUrl}">
      <h3>${item.title}</h3>
      <p>${item.type.toUpperCase()}</p>
    `;

    grid.appendChild(itemDiv);
  });
}


function removeItem(listName, index) {
  let list = JSON.parse(localStorage.getItem(listName)) || [];
  list.splice(index, 1);
  localStorage.setItem(listName, JSON.stringify(list));

  // Refresh the display
  let gridId = listName === 'favorites' ? 'favoritesGrid' : listName === 'watchLater' ? 'watchLaterGrid' : 'watchedGrid';
  displayList(listName, gridId);
}

// library load
function initLibrary() {
  let favoritesGrid = document.getElementById('favoritesGrid');

  // Only run this if we're on the library page
  if (favoritesGrid) {
    displayList('favorites', 'favoritesGrid');
    displayList('watchLater', 'watchLaterGrid');
    displayList('watched', 'watchedGrid');
  }
}

//search through movies, tv shows, and anime
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


//  animes

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



//  results from search
function displaySearchResults(results, clear = false) {
  let container = document.getElementById("results");

  if (clear) container.innerHTML = "";

  if (!results || results.length === 0) {
    container.innerHTML = "<p>No results found.</p>";// checking if there are results to display
    return;
  }

  results.forEach(item => {
    let imageUrl;

    if (item.type === "movie" || item.type === "tv") {//has different image handling for movies/tv vs anime 
      imageUrl = item.poster_path
        ? `${IMAGE_BASE}${item.poster_path}`
        : "/Images/no-image.png";
    } else {
      imageUrl = item.poster_path || "/Images/no-image.png";
    }

    let div = document.createElement("div");

    div.innerHTML = `
      <div class="movie-card">

        <img src="${imageUrl}">
        <h3>${item.title}</h3>

        <div class="media-types">
        <p>${item.type.toUpperCase()}</p>
        <button class="details-btn" data-id="${item.id}" data-type="${item.type}">
            <img src="/Images/dots.png">
        </button>
        </div>
      </div>
    `;//inserts a new div to display

    container.appendChild(div);


  });
  //applies event listener to each details button
  document.querySelectorAll(".details-btn").forEach(button => {
    button.addEventListener("click", function () {
      let id = this.getAttribute("data-id");
      let type = this.getAttribute("data-type");

      handleDetails(id, type);

    });
  });
}


//  decide which details

function handleDetails(id, type) {
  if (type === "movie") {
    getMovieDetails(id);
  } else if (type === "tv") {
    getTVDetails(id);
  } else {
    getAnimeDetails(id);
  }
}


// movie details

async function getMovieDetails(id) {
  let url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}`;

  let response = await fetch(url);
  let data = await response.json();

  displayMovieDetails(data);
}

// tv details

async function getTVDetails(id) {
  let url = `${BASE_URL}/tv/${id}?api_key=${API_KEY}`;

  let response = await fetch(url);
  let data = await response.json();

  displayTVDetails(data);
}


//  anime details

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


//  display movie
function displayMovieDetails(movie) {
  let container = document.getElementById("modalDetails");

  let imageUrl = movie.poster_path
    ? `${IMAGE_BASE}${movie.poster_path}`
    : "/Images/no-image.png";

  currentItem = {
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
    type: "movie"
  };

  container.innerHTML = `
    <h2>${movie.title}</h2>
    <img src="${imageUrl}">
    <p>${movie.overview}</p>
    <span>
    <p class="rating">⭐ ${movie.vote_average}</p>
    <p class="release-date">Release Date:${movie.release_date}</p>
    </span>
    <div>
      <button onclick="saveToList('favorites', currentItem)">Add to Favorites</button>
      <button onclick="saveToList('watchLater', currentItem)">Add to Watch Later</button>
      <button onclick="saveToList('watched', currentItem)">Mark as Watched</button>
    </div>
  `;
  openModal();
  document.body.style.overflow = 'hidden';

}

//  TV details
function displayTVDetails(show) {
  let container = document.getElementById("modalDetails");

  let imageUrl =
    show.poster_path && show.poster_path.startsWith("/")
      ? `${IMAGE_BASE}${show.poster_path}`
      : show.poster_path || "/Images/no-image.png";

  currentItem = {
    id: show.id,
    title: show.name,
    overview: show.overview,
    poster_path: show.poster_path,
    vote_average: show.vote_average,
    release_date: show.first_air_date,
    type: "tv"
  };

  container.innerHTML = `
    <h2>${show.name}</h2>
    <img src="${imageUrl}">
    <p>${show.overview}</p>
    <span>
    <p class="rating">⭐ ${show.vote_average}</p>
    <p class="release-date">Release Date: ${show.first_air_date}</p>
    </span>
    <div>
      <button onclick="saveToList('favorites', currentItem)">Add to Favorites</button>
      <button onclick="saveToList('watchLater', currentItem)">Add to Watch Later</button>
      <button onclick="saveToList('watched', currentItem)">Mark as Watched</button>
    </div>
  `;
  openModal();
  document.body.style.overflow = 'hidden';

}

//  anime details

function displayAnimeDetails(anime) {
  let container = document.getElementById("modalDetails");

  currentItem = {
    id: anime._id,
    title: anime.title,
    overview: anime.synopsis,
    poster_path: anime.image,
    ranking: anime.ranking,
    episodes: anime.episodes,
    type: "anime"
  };

  container.innerHTML = `
    <h2>${anime.title}</h2>
    <img src="${anime.image}">
    <p>${anime.synopsis}</p>
    <span>
    <p class="rating">⭐ Rank: ${anime.ranking}</p>
    <p class="release-date">Release Date: ${anime.episodes}</p>
    </span>
    <div>
      <button onclick="saveToList('favorites', currentItem)">Add to Favorites</button>
      <button onclick="saveToList('watchLater', currentItem)">Add to Watch Later</button>
      <button onclick="saveToList('watched', currentItem)">Mark as Watched</button>
    </div>
  `;
  openModal();
  document.body.style.overflow = 'hidden';

}


//modal open and close

function openModal() {
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
  document.body.style.overflow = 'auto';

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
  let closeButton = document.getElementById("closeModal");

  // Setup search page
  if (input && closeButton) {
    closeButton.addEventListener("click", closeModal);
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    });
  }

  // Setup library page if needed
  initLibrary();
});


// load more results when button is clicked

function loadMore() {
  currentPage++;
  searchAllMedia(currentQuery, currentPage);
}


// ===============================
// 🎬 TMDB MEDIA APP
// ===============================

// 🔑 API KEY
let API_KEY = "cde1749586d2a3fb9fb009e0a840170a";

// 🌐 BASE URLS
let BASE_URL = "https://api.themoviedb.org/3";
let IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

// 📄 STATE (for pagination)
let currentPage = 1;
let currentQuery = "";


// ===============================
// 🔍 SEARCH MEDIA (WITH PAGES)
// ===============================
async function searchMedia(query, page = 1) {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log("Search Data:", data);

    // If first page → clear results
    if (page === 1) {
      displaySearchResults(data.results, true);
    } else {
      displaySearchResults(data.results, false);
    }

  } catch (error) {
    console.error("Search error:", error);
  }
}


// ===============================
// 🎬 DISPLAY SEARCH RESULTS
// ===============================
function displaySearchResults(results, clear = false) {
  const container = document.getElementById("results");

  // Clear only on first load
  if (clear) {
    container.innerHTML = "";
  }

  if (!results || results.length === 0) {
    if (clear) {
      container.innerHTML = "<p>No results found.</p>";
    }
    return;
  }

  // BY POPULARITY
 results.sort((a, b) => {
  const query = currentQuery.toLowerCase();

  const aMatch = a.title.toLowerCase().includes(query);
  const bMatch = b.title.toLowerCase().includes(query);

  if (aMatch && !bMatch) return -1;
  if (!aMatch && bMatch) return 1;

  const scoreA = a.popularity + (a.vote_count * a.vote_average);
  const scoreB = b.popularity + (b.vote_count * b.vote_average);

  return scoreB - scoreA;
});

  results.forEach(movie => {
    const title = movie.title;
    const posterPath = movie.poster_path;

    const imageUrl = posterPath
      ? `${IMAGE_BASE}${posterPath}`
      : "/Images/no-image.png";

    const div = document.createElement("div");
    div.classList.add("grid-container");

    div.innerHTML = `
      <div class="movie-card">
        <button onclick="getMediaDetails(${movie.id})">
          <img src="/Images/dots.png" alt="Details">
        </button>
        <img src="${imageUrl}" alt="${title}">
        <h3>${title}</h3>
      </div>
    `;

    container.appendChild(div);
  });
}



//  GET MEDIA DETAILS (FIXED)

async function getMediaDetails(id) {
  const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}`;

  try {
    // ❌ YOU HAD options HERE (REMOVE IT)
    const response = await fetch(url);
    const data = await response.json();

    console.log("Details Data:", data);

    displayMediaDetails(data);

  } catch (error) {
    console.error("Error fetching details:", error);
  }
}

//  DISPLAY MEDIA DETAILS

function displayMediaDetails(movie) {
  const container = document.getElementById("details");

  const imageUrl = movie.poster_path
    ? `${IMAGE_BASE}${movie.poster_path}`
    : "https://via.placeholder.com/200x300?text=No+Image";

  container.innerHTML = `
    <h2>${movie.title}</h2>
    <img src="${imageUrl}" alt="${movie.title}">
    <p>${movie.overview}</p>
    <p>⭐ Rating: ${movie.vote_average}</p>
    <p>📅 Release Date: ${movie.release_date}</p>
  `;
}



//  SEARCH HANDLER

window.handleSearch = function () {
  const input = document.getElementById("searchInput").value;

  if (!input.trim()) return;

  currentQuery = input;
  currentPage = 1;

  searchMedia(currentQuery, currentPage);
};



/// ENTER KEY

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput");

  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });
});



//  LOAD MORE 

function loadMore() {
  currentPage++;
  searchMedia(currentQuery, currentPage);
}


/////////////////////////End of importing API////////////////////////





// SEARCH INPUT HANDLER

window.handleSearch = function () {
  const input = document.getElementById("searchInput").value;

  if (!input.trim()) return;

  searchMedia(input);
};

//  ENTER KEY

document.getElementById("searchInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    handleSearch();
  }
});


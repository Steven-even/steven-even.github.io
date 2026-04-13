
// TMDB MEDIA APP 


// 🔑 API KEY
const API_KEY = "cde1749586d2a3fb9fb009e0a840170a";

// 🌐 BASE URLS
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";


// ===============================
// 🎬 DISPLAY SEARCH RESULTS
// ===============================
function displaySearchResults(results) {
  const container = document.getElementById("results");
  container.innerHTML = ""; // clear previous results

  if (!results || results.length === 0) {
    container.innerHTML = "<p>No results found.</p>";
    return;
  }

  results.forEach(movie => {
    const title = movie.title;
    const description = movie.overview;
    const posterPath = movie.poster_path;

    // ✅ Handle missing image
    const imageUrl = posterPath
      ? `${IMAGE_BASE}${posterPath}`
      : "https://via.placeholder.com/200x300?text=No+Image";

    const div = document.createElement("div");
    div.classList.add("movie-card");

    div.innerHTML = `
      <h3>${title}</h3>
      <img src="${imageUrl}" alt="${title}">
      <p>${description}</p>
      <button onclick="getMediaDetails(${movie.id})">
        View Details
      </button>
    `;

    container.appendChild(div);
  });
}



//  GET MEDIA DETAILS

async function getMediaDetails(id) {
  const url = `${BASE_URL}/movie/${id}?api_key=${API_KEY}`;

  try {
    const response = await fetch(url, options);
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

async function searchMedia(query) {
  const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    displaySearchResults(data.results);

  } catch (error) {
    console.error("Search error:", error);
  }
}



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


// Scroll to top button functionality
const myButton = document.getElementById("gotopBtn");
window.onscroll = () => myButton.style.display = (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) ? "block" : "none";
function topFunction() { document.documentElement.scrollTop = 0; }

// TMDb API variables
const API_KEY = 'api_key=988e17afa010ca134f38ace964916dd5';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = `${BASE_URL}/discover/movie?sort_by=popularity.desc&${API_KEY}`;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const genresURL = `${BASE_URL}/genre/movie/list?${API_KEY}`;

// Fetch movie genres
function fetchGenres() {
    fetch(genresURL)
    .then(response => response.json())
    .then(data => {
        const genres = data.genres;
        const tagsEl = document.getElementById("tags");
        tagsEl.innerHTML = genres.map(genre => `<div class="tag" id="${genre.id}">${genre.name}</div>`).join('');
        // Add event listeners to genre tags
        tagsEl.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener("click", () => {
                const selectedGenre = tag.id;
                const url = `${API_URL}&with_genres=${selectedGenre}`;
                fetchAndDisplayMovies(url);
            });
        });
    });
}

// Fetch movies and display them
function fetchAndDisplayMovies(url) {
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const movies = data.results;
        const main = document.getElementById("main");
        main.innerHTML = movies.map(movie => `
            <div class="movie">
                <img src="${movie.poster_path ? IMG_URL + movie.poster_path : 'https://media.tenor.com/OyUVgQi-l-QAAAAC/404.gif'}" alt="${movie.title}">
                <div class="movie-info">
                    <h3>${movie.title}</h3>
                    <span class="${setColor(movie.vote_average)}">${movie.vote_average}</span>
                </div>
                <div class="overview">
                    <h3>Overview</h3>
                    ${movie.overview}
                </div>
            </div>`).join('');
    });
}

// Set up initial movie display and genres
fetchAndDisplayMovies(API_URL);
fetchGenres();

// Function to set color based on rating
function setColor(vote) {
    if (vote >= 7.5) return "green";
    else if (vote >= 5) return "orange";
    else return 'red';
}

// Form submission handling for search
document.getElementById("form").addEventListener("submit", event => {
    event.preventDefault();
    const searchTerm = document.getElementById("search").value.trim();
    const searchURL = `${BASE_URL}/search/movie?${API_KEY}&query=${searchTerm}`;
    fetchAndDisplayMovies(searchTerm ? searchURL : API_URL);
});

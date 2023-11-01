const API_KEY = `f6707fe48c0e27df16600fa9efd12133`
const image_path = `https://image.tmdb.org/t/p/w1280/`

// SEARCH
const searchButton = document.querySelector('.search button');
const searchInput = document.querySelector('.search input');
const searchResults = document.querySelector('.search-results');
const customCurrentPage = 1;
const customLoadMoreButton = document.getElementById('load-more-search');
const banners1 = document.querySelectorAll('.banner1, .trending, .favorites, .watchlist, .explore');
let customPage = customCurrentPage;
let currentSearchTerm = "";

searchButton.addEventListener('click', async () => {
    const searchTerm = searchInput.value;
    if (searchTerm) {
        currentSearchTerm = searchTerm;
        banners1.forEach(banner => banner.style.display = 'none');
        searchResults.style.display = 'block';
        customPage = customCurrentPage;
        customLoadMoreButton.disabled = false;
        customLoadMoreButton.textContent = "Load More";
        const searchResultsData = await searchMovies(currentSearchTerm, customPage);
        displaySearchResults(searchResultsData);
    }
});

customLoadMoreButton.addEventListener('click', async () => {
    customPage++;
    const searchResultsData = await searchMovies(currentSearchTerm, customPage);
    displaySearchResults(searchResultsData, true);
});

async function searchMovies(searchTerm, page) {
    try {
        const resp = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}&page=${page}`);
        const respData = await resp.json();
        return respData.results;
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
}

function displaySearchResults(results, append = false) {
    const searchResultsGrid = searchResults.querySelector('.movies-grid');

    if (!append) {
        searchResultsGrid.innerHTML = '';
    }

    results.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = movie.id;
        card.innerHTML = `
            <div class="img">
                <img src="${image_path + movie.poster_path}" alt="${movie.title}">
            </div>
            <div class="info">
                <h2>${movie.title}</h2>
                <div class="single-info">
                    <span>Rate: </span>
                    <span>${movie.vote_average} / 10</span>
                </div>
                <div class="single-info">
                    <span>Release Date: </span>
                    <span>${movie.release_date}</span>
                </div>
            </div>
        `;
        searchResultsGrid.appendChild(card);
    });

    if (results.length === 0) {
        customLoadMoreButton.disabled = true;
        customLoadMoreButton.textContent = "No more results";
    }

    const cards = document.querySelectorAll('.card')
    add_click_effect_to_card(cards)
}


// Explore Movies

const tagsEl = document.getElementById('tags');

const genres = [
  {
    "id": 28,
    "name": "Action"
  },
  {
    "id": 12,
    "name": "Adventure"
  },
  {
    "id": 16,
    "name": "Animation"
  },
  {
    "id": 35,
    "name": "Comedy"
  },
  {
    "id": 80,
    "name": "Crime"
  },
  {
    "id": 99,
    "name": "Documentary"
  },
  {
    "id": 18,
    "name": "Drama"
  },
  {
    "id": 10751,
    "name": "Family"
  },
  {
    "id": 14,
    "name": "Fantasy"
  },
  {
    "id": 36,
    "name": "History"
  },
  {
    "id": 27,
    "name": "Horror"
  },
  {
    "id": 10402,
    "name": "Music"
  },
  {
    "id": 9648,
    "name": "Mystery"
  },
  {
    "id": 10749,
    "name": "Romance"
  },
  {
    "id": 878,
    "name": "Science Fiction"
  },
  {
    "id": 10770,
    "name": "TV Movie"
  },
  {
    "id": 53,
    "name": "Thriller"
  },
  {
    "id": 10752,
    "name": "War"
  },
  {
    "id": 37,
    "name": "Western"
  }
];

let selectedGenre = [];
setGenre();

function setGenre() {
  tagsEl.innerHTML = '';
  genres.forEach(genre => {
    const t = document.createElement('div');
    t.classList.add('tag');
    t.id = genre.id;
    t.innerText = genre.name;
    t.addEventListener('click', () => {
      if (selectedGenre.includes(genre.id)) {
        selectedGenre = selectedGenre.filter(id => id !== genre.id);
      } else {
        selectedGenre.push(genre.id);
      }
      console.log(selectedGenre);

      highlightSelection();

      clearMoviesGrid();
      loadMovies();
    });
    tagsEl.append(t);
  });
}

function highlightSelection() {
  const tags = document.querySelectorAll('.tag');
  tags.forEach(tag => {
    if (selectedGenre.includes(parseInt(tag.id))) {
      tag.classList.add('highlight');
    } else {
      tag.classList.remove('highlight');
    }
  });
}

function clearMoviesGrid() {
  const exploreMoviesGrid = explore_el.querySelector('.movies-grid');
  exploreMoviesGrid.innerHTML = '';
}

const banners2 = document.querySelectorAll('.banner1, .trending, .favorites, .watchlist, .search-results');
const exploreButton = document.querySelector('.explore-movie span');
const explore_el = document.querySelector('.explore');
const loadMoreButton = document.getElementById('load-more-button');

let currentPage = 1;

loadMovies();

exploreButton.addEventListener('click', () => {
  banners2.forEach(banner => banner.style.display = 'none');
  explore_el.style.display = 'block';

  clearMoviesGrid();
  loadMovies();
});

loadMoreButton.addEventListener('click', () => {
  currentPage++;
  loadMovies();
});

async function loadMovies() {
  try {
    const genreQuery = selectedGenre.length === 0 ? '' : `&with_genres=${selectedGenre.join(',')}`;
    const resp = await fetch(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=${currentPage}${genreQuery}`);
    const respData = await resp.json();
    const movies = respData.results;

    if (movies.length === 0) {
      loadMoreButton.disabled = true;
      loadMoreButton.textContent = "No more movies";
    }

    add_to_dom_explore(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
}

function add_to_dom_explore(data) {
  const exploreMoviesGrid = explore_el.querySelector('.movies-grid');

  const html = data.map(e => `
    <div class="card" data-id="${e.id}">
      <div class="img">
        <img src="${image_path + e.poster_path}">
      </div>
      <div class="info">
        <h2>${e.title}</h2>
        <div class="single-info">
          <span>Rate: </span>
          <span>${e.vote_average} / 10</span>
        </div>
        <div class="single-info">
          <span>Release Date: </span>
          <span>${e.release_date}</span>
        </div>
      </div>
    </div>
  `).join('');

  exploreMoviesGrid.innerHTML += html;

  const cards = explore_el.querySelectorAll('.card');
  add_click_effect_to_card(cards);
}

const trending_el = document.querySelector('.trending .movies-grid')

// Trending Movies
get_trending_movies()
async function get_trending_movies () {
    const resp = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`)
    const respData = await resp.json()
    return respData.results
}

add_to_dom_trending()
async function add_to_dom_trending () {

    const data = await get_trending_movies()
    console.log(data);

    trending_el.innerHTML = data.slice(0, 10).map(e => {
        return `
            <div class="card" data-id="${e.id}">
                <div class="img">
                    <img src="${image_path + e.poster_path}">
                </div>
                <div class="info">
                    <h2>${e.title}</h2>
                    <div class="single-info">
                        <span>Rate: </span>
                        <span>${e.vote_average} / 10</span>
                    </div>
                    <div class="single-info">
                        <span>Release Date: </span>
                        <span>${e.release_date}</span>
                    </div>
                </div>
            </div>
        `
    }).join('')

    const cards = document.querySelectorAll('.card')
    add_click_effect_to_card(cards)
}


// Local Storage
function get_LS () {
    const movie_ids = JSON.parse(localStorage.getItem('movie-id'))
    return movie_ids === null ? [] : movie_ids
}
function add_to_LS (id) {
    const movie_ids = get_LS()
    localStorage.setItem('movie-id', JSON.stringify([...movie_ids, id]))
}
function remove_LS (id) {
    const movie_ids = get_LS()
    localStorage.setItem('movie-id', JSON.stringify(movie_ids.filter(e => e !== id)))
}

// Favorite Movies
const main_grid = document.querySelector('.favorites .movies-grid')

fetch_favorite_movies()
async function fetch_favorite_movies () {
    main_grid.innerHTML = ''

    const movies_LS = await get_LS()
    const movies = []
    for(let i = 0; i <= movies_LS.length - 1; i++) {
        const movie_id = movies_LS[i]
        let movie = await get_movie_by_id(movie_id)
        add_favorites_to_dom_from_LS(movie)
        movies.push(movie)
    }
}

function add_favorites_to_dom_from_LS (movie_data) {
    main_grid.innerHTML += `
        <div class="card" data-id="${movie_data.id}">
            <div class="img">
                <img src="${image_path + movie_data.poster_path}">
            </div>
            <div class="info">
                <h2>${movie_data.title}</h2>
                <div class="single-info">
                    <span>Rate: </span>
                    <span>${movie_data.vote_average} / 10</span>
                </div>
                <div class="single-info">
                    <span>Release Date: </span>
                    <span>${movie_data.release_date}</span>
                </div>
            </div>
        </div>
    `

    const cards = document.querySelectorAll('.card')
    add_click_effect_to_card(cards)
}

// Local Storage Watchlist
function get_watchlist_LS() {
    const watchlist_ids = JSON.parse(localStorage.getItem('watchlist-movie-id'));
    return watchlist_ids === null ? [] : watchlist_ids;
}

function add_to_watchlist_LS(id) {
    const watchlist_ids = get_watchlist_LS();
    localStorage.setItem('watchlist-movie-id', JSON.stringify([...watchlist_ids, id]));
}

function remove_from_watchlist_LS(id) {
    const watchlist_ids = get_watchlist_LS();
    localStorage.setItem('watchlist-movie-id', JSON.stringify(watchlist_ids.filter(e => e !== id)));
}

// Watchlist movies

fetch_watchlist_movies();

async function fetch_watchlist_movies() {
    
    const watchlist_grid = document.querySelector('.watchlist .movies-grid');
    watchlist_grid.innerHTML = '';

    const watchlist_ids = get_watchlist_LS();
    const watchlist_movies = [];

    for (let i = 0; i <= watchlist_ids.length -1; i++) {
        const movie_id = watchlist_ids[i];
        const movie = await get_movie_by_id(movie_id);
        add_watchlist_to_dom_from_LS(movie, watchlist_grid);
        watchlist_movies.push(movie);
    }
}

function add_watchlist_to_dom_from_LS(movie_data, watchlist_grid) {
    
    watchlist_grid.innerHTML += `
        <div class="card" data-id="${movie_data.id}">
            <div class="img">
                <img src="${image_path + movie_data.poster_path}">
            </div>
            <div class="info">
                <h2>${movie_data.title}</h2>
                <div class="single-info">
                    <span>Rate: </span>
                    <span>${movie_data.vote_average} / 10</span>
                </div>
                <div class="single-info">
                    <span>Release Date: </span>
                    <span>${movie_data.release_date}</span>
                </div>
            </div>
        </div>
    `;

    const cards = watchlist_grid.querySelectorAll('.card');
    add_click_effect_to_card(cards);
}

// POPUP

const popup_container = document.querySelector('.popup-container')

function add_click_effect_to_card (cards) {
    cards.forEach(card => {
        card.addEventListener('click', () => show_popup(card))
    })
}

async function get_movie_by_id (id) {
    const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
    const respData = await resp.json()
    return respData
}
async function get_movie_trailer(id) {
    try {
        const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`);
        const respData = await resp.json();

        if (respData.results.length > 0) {
            return respData.results[0].key;
        } else {
            return null; 
        }
    } catch (error) {
        console.error('Error fetching trailer:', error);
        return null;
    }
}


async function show_popup(card) {
    popup_container.classList.add('show-popup');

    const movie_id = card.getAttribute('data-id');
    const movie = await get_movie_by_id(movie_id);
    const movie_trailer = await get_movie_trailer(movie_id);

    popup_container.style.background = `linear-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 1)), url(${image_path + movie.poster_path})`;

    const trailerSection = movie_trailer
        ? `<div class="trailer">
                <h2>Trailer</h2>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${movie_trailer}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
           </div>`
        : '';

    popup_container.innerHTML = `
    <span class="x-icon">&#10006;</span>
    <div class="content">
        <div class="left">
            <div class="poster-img">
                <img src="${image_path + movie.poster_path}" alt="">
            </div>
            <div class="single-info">
                <span>Add to favorites:</span>
                <span class="heart-icon">
                    <i class="material-symbols-outlined">
                        favorite
                    </i>
                </span>
                <span>Add to watchlist:</span>
                <span class="watchlist-icon">
                    <i class="material-symbols-outlined">
                        bookmark
                    </i>
                </span>
            </div>
        </div>
        <div class="right">
            <h1>${movie.title}</h1>
            <h3>${movie.tagline}</h3>
            <div class="single-info-container">
                <div class="single-info">
                    <span>Language:</span>
                    <span>${movie.spoken_languages[0].name}</span>
                </div>
                <div class="single-info">
                    <span>Length:</span>
                    <span>${movie.runtime} minutes</span>
                </div>
                <div class="single-info">
                    <span>Rate:</span>
                    <span>${movie.vote_average} / 10</span>
                </div>
                <div class="single-info">
                    <span>Budget:</span>
                    <span>$ ${movie.budget}</span>
                </div>
                <div class="single-info">
                    <span>Release Date:</span>
                    <span>${movie.release_date}</span>
                </div>
            </div>
            <div class="genres">
                <h2>Genres</h2>
                <ul>
                    ${movie.genres.map(e => `<li>${e.name}</li>`).join('')}
                </ul>
            </div>
         
            <div class="overview">
                <h2>Overview</h2>
                <p>${movie.overview}</p>
            </div>
            ${trailerSection}
        </div>
    </div>
    `;

    const x_icon = document.querySelector('.x-icon');
    x_icon.addEventListener('click', () => popup_container.classList.remove('show-popup'));

    const heart_icon = popup_container.querySelector('.heart-icon');

    const movie_ids = get_LS();
    for (let i = 0; i <= movie_ids.length; i++) {
        if (movie_ids[i] == movie_id) heart_icon.classList.add('change-color');
    }

    heart_icon.addEventListener('click', () => {
        if (heart_icon.classList.contains('change-color')) {
            remove_LS(movie_id);
            heart_icon.classList.remove('change-color');
        } else {
            add_to_LS(movie_id);
            heart_icon.classList.add('change-color');
        }
        fetch_favorite_movies();
    });

    const watchlist_icon = popup_container.querySelector('.watchlist-icon');

    const watchlist_ids = get_watchlist_LS();
    for (let i = 0; i <= watchlist_ids.length; i++) {
        if (watchlist_ids[i] === movie_id) watchlist_icon.classList.add('change-color');
    }

    watchlist_icon.addEventListener('click', () => {
        if (watchlist_icon.classList.contains('change-color')) {
            remove_from_watchlist_LS(movie_id);
            watchlist_icon.classList.remove('change-color');
        } else {
            add_to_watchlist_LS(movie_id);
            watchlist_icon.classList.add('change-color');
        }
        fetch_watchlist_movies();
    });
}


const scrollUpButton = document.getElementById('scroll-up-button');

scrollUpButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

const scrollUpButton2 = document.getElementById('scroll-up-button2');

scrollUpButton2.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

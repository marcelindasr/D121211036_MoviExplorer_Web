const API_KEY = `f6707fe48c0e27df16600fa9efd12133`
const image_path = `https://image.tmdb.org/t/p/w1280/`

const slider = document.querySelector('.slider');
const leftArrow = document.querySelector('.left');
const rightArrow = document.querySelector('.right');
const indicatorParents = document.querySelector('.controls ul');

var sectionIndex = 0;

function setIndex() {
    document.querySelector('.controls .selected').classList.remove('selected');
    slider.style.transform = 'translate(' + (sectionIndex * -25) + '%)';
    indicatorParents.children[sectionIndex].classList.add('selected');
}

document.querySelector('.controls li').classList.add('selected');

document.querySelectorAll('.controls li').forEach(function(indicator, ind) {
    indicator.addEventListener('click', function() {
        sectionIndex = ind;
        setIndex();
    });
});



// Start the auto-slider
function startAutoSlider() {
    autoSlideInterval = setInterval(nextSlide, 8000); // Change the interval duration as needed (e.g., 3000ms = 3 seconds)
}

// Stop the auto-slider
function stopAutoSlider() {
    clearInterval(autoSlideInterval);
}

document.querySelector('.controls li').classList.add('selected');

document.querySelectorAll('.controls li').forEach(function(indicator, ind) {
    indicator.addEventListener('click', function() {
        sectionIndex = ind;
        setIndex();
        stopAutoSlider(); // Stop auto-slider when user interacts with indicators
    });
});

leftArrow.addEventListener('click', function() {
    sectionIndex = (sectionIndex > 0) ? sectionIndex - 1 : 3;
    setIndex();
    stopAutoSlider();
});

rightArrow.addEventListener('click', function() {
    sectionIndex = (sectionIndex < 3) ? sectionIndex + 1 : 0;
    setIndex();
    stopAutoSlider();
});

// Start the auto-slider when the page loads
startAutoSlider();

const trending_el = document.querySelector('.trending .movies-grid')

// Trending Movies
get_trending_movies()
async function get_trending_movies () {
    const resp = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${API_KEY}`)
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
                    <h2>${e.title || e.name}</h2>
                    <div class="single-info">
                        <span>Rate: </span>
                        <span>${e.vote_average} / 10</span>
                    </div>
                    <div class="single-info">
                        <span>Release Date: </span>
                        <span>${e.release_date || e.first_air_date}</span>
                    </div>
                </div>
            </div>
        `
    }).join('')
}

function add_click_effect_to_card (cards) {
    cards.forEach(card => {
        card.addEventListener('click', () => show_popup(card))
    })
}

// SEARCH MOVIES

const input = document.querySelector('.search input')
const btn = document.querySelector('.search button')
const main_grid_title = document.querySelector('.favorites h1')
async function get_movie_by_search (search_term) {
    const resp = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${search_term}`)
    const respData = await resp.json()
    return respData.results
}

btn.addEventListener('click', add_searched_movies_to_dom)

async function add_searched_movies_to_dom () {
    const data = await get_movie_by_search(input.value)

    main_grid_title.innerText = `Search Results...`
    main_grid.innerHTML = data.map(e => {
        return `
            <div class="card" data-id="${e.id}">
                <div class="img">
                    <img src="${image_path + e.poster_path}">
                </div>
                <div class="info">
                    <h2>${e.title || e.name}</h2>
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
                <h2>${movie_data.title || movie_data.name}</h2>
                <div class="single-info">
                    <span>Rate: </span>
                    <span>${movie_data.vote_average} / 10</span>
                </div>
                <div class="single-info">
                    <span>Release Date: </span>
                    <span>${movie_data.release_date || movie_data.first_air_date}</span>
                </div>
            </div>
        </div>
    `

    const cards = document.querySelectorAll('.card')
    add_click_effect_to_card(cards)
}

// Watchlist Movies
const watchlist_grid = document.querySelector('.watchlist .movies-grid');

fetch_watchlist_movies();
async function fetch_watchlist_movies() {
    watchlist_grid.innerHTML = '';

    const watchlist_LS = await get_watchlist_LS();
    const watchlistMovies = [];
    for (let i = 0; i < watchlist_LS.length; i++) {
        const movie_id = watchlist_LS[i];
        let movie = await get_movie_by_id(movie_id);
        add_watchlist_to_dom_from_LS(movie);
        watchlistMovies.push(movie);
    }
}

function add_watchlist_to_dom_from_LS(movie_data) {
    watchlist_grid.innerHTML += `
        <div class="card" data-id="${movie_data.id}">
            <div class="img">
                <img src="${image_path + movie_data.poster_path}">
            </div>
            <div class="info">
                <h2>${movie_data.title || movie_data.name}</h2>
                <div class="single-info">
                    <span>Rate: </span>
                    <span>${movie_data.vote_average} / 10</span>
                </div>
                <div class="single-info">
                    <span>Release Date: </span>
                    <span>${movie_data.release_date || movie_data.first_air_date}</span>
                </div>
            </div>
        </div>
    `;

    const cards = document.querySelectorAll('.card');
    add_click_effect_to_card(cards);
}

// You may need to implement the get_watchlist_LS and get_movie_by_id functions.



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
async function get_movie_trailer (id) {
    const resp = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`)
    const respData = await resp.json()
    return respData.results[0].key
}

async function show_popup (card) {
    popup_container.classList.add('show-popup')

    const movie_id = card.getAttribute('data-id')
    const movie = await get_movie_by_id(movie_id)
    const movie_trailer = await get_movie_trailer(movie_id)

    popup_container.style.background = `linear-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, 1)), url(${image_path + movie.poster_path})`

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
            <h1>${movie.title || movie.name}</h1>
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
                    <span>${movie.release_date || movie.first_air_date}</span>
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
            <div class="trailer">
                <h2>Trailer</h2>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${movie_trailer}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
        </div>
    </div>
    `
    const x_icon = document.querySelector('.x-icon')
    x_icon.addEventListener('click', () => popup_container.classList.remove('show-popup'))

    const heart_icon = popup_container.querySelector('.heart-icon')

    const movie_ids = get_LS()
    for(let i = 0; i <= movie_ids.length; i++) {
        if (movie_ids[i] == movie_id) heart_icon.classList.add('change-color')
    }

    heart_icon.addEventListener('click', () => {
        if(heart_icon.classList.contains('change-color')) {
            remove_LS(movie_id)
            heart_icon.classList.remove('change-color')
        } else {
            add_to_LS(movie_id)
            heart_icon.classList.add('change-color')
        }
        fetch_favorite_movies()
    })
}

fetch_watchlist_movies()

async function fetch_watchlist_movies() {
    watchlist_grid.innerHTML = ''

    const watchlist_LS = await get_watchlist_LS();
    const watchlistMovies = [];

    for (let i = 0; i <= watchlist_LS.length - 1; i++) {
        const movie_id = watchlist_LS[i];
        let movie = await get_movie_by_id(movie_id);
        add_watchlist_to_dom_from_LS(movie);
        watchlistMovies.push(movie);
    }
}

function add_watchlist_to_dom_from_LS(movie_d) {

        watchlist_grid.innerHTML += `
            <div class="card" data-id="${movie_d.id}">
                <div class="img">
                    <img src="${image_path + movie_d.poster_path}">
                </div>
                <div class="info">
                    <h2>${movie_d.title}</h2>
                    <div class="single-info">
                        <span>Rate: </span>
                        <span>${movie_d.vote_average} / 10</span>
                    </div>
                    <div class="single-info">
                        <span>Release Date: </span>
                        <span>${movie_d.release_date}</span>
                    </div>
                </div>
            </div>
        `;
    

    const cards = document.querySelectorAll('.card');
    add_click_effect_to_card(cards);
}


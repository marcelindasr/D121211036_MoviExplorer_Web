const API_KEY = `f6707fe48c0e27df16600fa9efd12133`
const image_path = `https://image.tmdb.org/t/p/w1280/`

// BANNER

const slider = document.querySelector('.slider');
const leftArrow = document.querySelector('.left');
const rightArrow = document.querySelector('.right');
const indicatorParents = document.querySelector('.controls ul');
const totalSlides = 4;

var sectionIndex = 0;
var autoSlideInterval; 

function setIndex() {
    document.querySelector('.controls .selected').classList.remove('selected');
    slider.style.transform = 'translate(' + (sectionIndex * -25) + '%)';
    indicatorParents.children[sectionIndex].classList.add('selected');
}

function nextSlide() {
    sectionIndex = (sectionIndex < totalSlides - 1) ? sectionIndex + 1 : 0;
    setIndex();
}

function startAutoSlider() {
    autoSlideInterval = setInterval(nextSlide, 3000); 
}

function stopAutoSlider() {
    clearInterval(autoSlideInterval);
}

document.querySelector('.controls li').classList.add('selected');

document.querySelectorAll('.controls li').forEach(function(indicator, ind) {
    indicator.addEventListener('click', function() {
        sectionIndex = ind;
        setIndex();
        stopAutoSlider();
    });
});

leftArrow.addEventListener('click', function() {
    sectionIndex = (sectionIndex > 0) ? sectionIndex - 1 : totalSlides - 1;
    setIndex();
    stopAutoSlider(); 
});

rightArrow.addEventListener('click', function() {
    sectionIndex = (sectionIndex < totalSlides - 1) ? sectionIndex + 1 : 0;
    setIndex();
    stopAutoSlider(); 
});

startAutoSlider();


// SEARCH
const searchButton = document.querySelector('.search button');
const searchInput = document.querySelector('.search input');
const searchResults = document.querySelector('.search-results');
const banners = document.querySelectorAll('.banner1, .trending, .favorites, .watchlist');

searchButton.addEventListener('click', async () => {
    const searchTerm = searchInput.value;
    if (searchTerm) {
        // Sembunyikan banner1, trending, favorites, dan watchlist
        banners.forEach(banner => banner.style.display = 'none');

        // Tampilkan tampilan hasil pencarian
        searchResults.style.display = 'block';

        // Lakukan pencarian dan tampilkan hasilnya
        const searchResultsData = await searchMovies(searchTerm);
        displaySearchResults(searchResultsData);
    }
});

async function searchMovies(searchTerm) {
    const resp = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}`)
    const respData = await resp.json()
    return respData.results
}

function displaySearchResults(results) {
    const searchResultsGrid = searchResults.querySelector('.movies-grid');
    const searchResultsTitle = searchResults.querySelector('h1');


    searchResultsGrid.innerHTML = results.map(movie => {
        return `
            <div class="card" data-id="${movie.id}">
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
            </div>
        `;
    }).join('');

    const cards = document.querySelectorAll('.card')
    add_click_effect_to_card(cards)
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
                        <span>${e.release_dates}</span>
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

// Fungsi Local Storage Watchlist
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

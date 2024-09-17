const pokemonList = document.querySelector("#pokemon_list");
const btnHeader = document.querySelectorAll(".btn-header");
const URL = "https://pokeapi.co/api/v2/pokemon/";
let cachedPokemonData = [];

async function fetchAllPokemonInParallel() {
    const promises = [];
    for (let i = 1; i <= 1025; i++) {
        promises.push(fetch(URL + i).then(response => response.json()));
    }
    const results = await Promise.all(promises); // Esperar a que todas las promesas se resuelvan
    cachedPokemonData = results;
    mostrarTodosLosPokemon();
    localStorage.setItem('pokemonData', JSON.stringify(cachedPokemonData));
}

function cargarPokemon() {
    const pokemonDataFromStorage = localStorage.getItem('pokemonData');
    if (pokemonDataFromStorage) {
        cachedPokemonData = JSON.parse(pokemonDataFromStorage);
        mostrarTodosLosPokemon();
    } else {
        fetchAllPokemonInParallel(); // Cargar todos los Pokémon en paralelo
    }
}

function mostrarPokemon(data) {
    let types = data.types.map((type) => `<p class="${type.type.name} type">${type.type.name}</p>`).join('');
    let pokeId = data.id.toString().padStart(4, '0');
    
    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon_id_back">#${pokeId}</p>
        <div class="image_pokemon lazy">
          <img data-src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}" class="lazy-img">
        </div>
        <div class="info_pokemon">
            <div class="conter_name">
                <p class="id_pokemon">#${pokeId}</p>
                <h2 class="name_pokemon">${data.name}</h2>
            </div>
            <div class="types_pokemon">${types}</div>
            <div class="stats">
                <p class="stat">${data.height/10}m</p>
                <p class="stat">${data.weight/10}kg</p>
            </div>
        </div>
    `;
    pokemonList.append(div);
}

function mostrarTodosLosPokemon() {
    pokemonList.innerHTML = "";
    cachedPokemonData.forEach(mostrarPokemon);
    lazyLoadImages(); // Aplicar lazy loading a las imágenes
}

function lazyLoadImages() {
    const lazyImages = document.querySelectorAll('.lazy-img');
    const intersectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src; // Cargar la imagen cuando esté en la vista
                img.classList.remove('lazy-img');
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => {
        intersectionObserver.observe(img);
    });
}

function filtrarPokemon(btnId) {
    pokemonList.innerHTML = "";
    let filteredPokemon;

    switch (btnId) {
        case 'btn-search':
            filteredPokemon = cachedPokemonData.filter(pokemon => pokemon.name === document.getElementById("search").value || pokemon.id === parseInt(document.getElementById("search").value));
            break;
        case 'ver-todos':
            filteredPokemon = cachedPokemonData;
            break;
        case 'gen1':
            filteredPokemon = cachedPokemonData.filter(pokemon => pokemon.id <= 151);
            break;
        case 'gen2':
            filteredPokemon = cachedPokemonData.filter(pokemon => pokemon.id > 151 && pokemon.id <= 251);
            break;
        case 'gen3':
            filteredPokemon = cachedPokemonData.filter(pokemon => pokemon.id > 251 && pokemon.id <= 386);
            break;
        case 'gen4':
            filteredPokemon = cachedPokemonData.filter(pokemon => pokemon.id > 386 && pokemon.id <= 493);
            break;
        case 'gen5':
            filteredPokemon = cachedPokemonData.filter(pokemon => pokemon.id > 493 && pokemon.id <= 649);
            break;
        case 'gen6':
            filteredPokemon = cachedPokemonData.filter(pokemon => pokemon.id > 649 && pokemon.id <= 721);
            break;
        case 'gen7':
            filteredPokemon = cachedPokemonData.filter(pokemon => pokemon.id > 721 && pokemon.id <= 809);
            break;
        case 'gen8':
            filteredPokemon = cachedPokemonData.filter(pokemon => pokemon.id > 809 && pokemon.id <= 905);
            break;
        case 'gen9':
            filteredPokemon = cachedPokemonData.filter(pokemon => pokemon.id > 905 && pokemon.id <= 1025);
            break;
        default:
            filteredPokemon = cachedPokemonData.filter(pokemon => pokemon.types.some(type => type.type.name.includes(btnId)));
            break;
    }

    filteredPokemon.forEach(mostrarPokemon);
    lazyLoadImages(); // Aplicar lazy loading tras filtrar
}

btnHeader.forEach(btn => {
    btn.addEventListener("click", (event) => {
        const btnId = event.currentTarget.id;
        filtrarPokemon(btnId);
    });
});

document.getElementById('search').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        filtrarPokemon('btn-search');
    }
});

cargarPokemon();


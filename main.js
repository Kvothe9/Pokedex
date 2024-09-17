const pokemonList = document.querySelector("#pokemon_list");
const btnHeader = document.querySelectorAll(".btn-header");
const URL = "https://pokeapi.co/api/v2/pokemon/";

let cachedPokemonData = []; // Cache para almacenar todos los Pokémon

// Función para obtener todos los Pokémon de la API de forma incremental
async function fetchAllPokemonIncremental() {
    for (let i = 1; i <= 1025; i++) {
        const response = await fetch(URL + i);
        const data = await response.json();
        mostrarPokemon(data); // Mostrar el Pokémon inmediatamente
        cachedPokemonData.push(data); // Añadir a la cache
    }
    localStorage.setItem('pokemonData', JSON.stringify(cachedPokemonData)); // Guardar en localStorage después de cargar
}

// Función para cargar desde localStorage o desde la API si no existe
function cargarPokemon() {
    const pokemonDataFromStorage = localStorage.getItem('pokemonData');
    
    if (pokemonDataFromStorage) {
        // Si los datos están en localStorage, los usamos
        cachedPokemonData = JSON.parse(pokemonDataFromStorage);
        mostrarTodosLosPokemon(); // Mostrar todos los Pokémon inmediatamente
    } else {
        // Si no, los cargamos desde la API y mostramos cada Pokémon al obtenerlo
        fetchAllPokemonIncremental();
    }
}

// Función para mostrar un Pokémon en el DOM
function mostrarPokemon(data) {
    let types = data.types.map((type) => `<p class="${type.type.name} type">${type.type.name}</p>`).join('');
    
    let pokeId = data.id.toString().padStart(4, '0'); // Formatear el ID para que siempre tenga 3 dígitos

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `
        <p class="pokemon_id_back">#${pokeId}</p>
        <div class="image_pokemon">
          <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}">
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

// Función para mostrar todos los Pokémon (usando la cache ya cargada)
function mostrarTodosLosPokemon() {
    pokemonList.innerHTML = ""; // Limpiar la lista
    cachedPokemonData.forEach(mostrarPokemon); // Mostrar todos los Pokémon
}

// Función para filtrar Pokémon por generación o tipo
function filtrarPokemon(btnId) {
    pokemonList.innerHTML = ""; // Limpiamos la lista antes de mostrar los nuevos resultados
    let filteredPokemon;        

    function mostrarTodosLosPokemon() {

    }

    // Filtrar por generación
    switch (btnId) {
        case 'btn-search':
            filteredPokemon = cachedPokemonData.filter(pokemon => pokemon.name === document.getElementById("search").value || pokemon.id === parseInt(document.getElementById("search").value))
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
            // Filtrar por tipo
            filteredPokemon = cachedPokemonData.filter(pokemon => pokemon.types.some(type => type.type.name.includes(btnId)));
            break;
    }

    // Mostrar los Pokémon filtrados
    filteredPokemon.forEach(mostrarPokemon);
}

// Agregamos un event listener para cada botón
btnHeader.forEach(btn => {
    btn.addEventListener("click", (event) => {
        const btnId = event.currentTarget.id;
        filtrarPokemon(btnId);
    });
});

document.getElementById('search').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Evita el comportamiento por defecto del Enter
        filtrarPokemon('btn-search'); // Llama a la función de búsqueda con el ID del botón de búsqueda
    }
});

// Llamamos a la función para cargar Pokémon al inicio de la página
cargarPokemon();

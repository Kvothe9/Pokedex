const pokemon_list = document.querySelector("#pokemon_list");
const btnheader = document.querySelectorAll(".btn-header");
const URL = "https://pokeapi.co/api/v2/pokemon/";
let allPokemons = [];
let displayedPokemons = [];
let isLoading = false;

// Cargar todos los Pokémon al inicio
async function loadInitialPokemons() {
    pokemon_list.innerHTML = "<p>Loading...</p>"; // Mostrar mensaje de carga
    allPokemons = await fetchPokemons(1, 1025); // Cargar todos los Pokémon
    displayedPokemons = allPokemons; // Inicialmente, mostramos todos los Pokémon
    displayPokemons();
}

// Función para obtener Pokémon de la API
async function fetchPokemons(start, end) {
    const urls = [];
    for (let i = start; i <= end; i++) {
        urls.push(`${URL}${i}`);
    }

    try {
        const responses = await Promise.all(urls.map(url => fetch(url)));
        const jsons = await Promise.all(responses.map(response => response.json()));
        return jsons;
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        return [];
    }
}

// Mostrar Pokémon en el DOM
function mostrarPokemon(data) {
    let types = data.types.map(type => 
        `<p class="${type.type.name} type">${type.type.name}</p>`
    ).join('');

    let pokeId = data.id.toString().padStart(3, '0');

    return `
        <div class="pokemon">
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
                    <p class="stat">${data.height}m</p>
                    <p class="stat">${data.weight}kg</p>
                </div>
            </div>
        </div>
    `;
}

// Mostrar Pokémon filtrados
function displayPokemons(pokemons = displayedPokemons) {
    const html = pokemons.map(mostrarPokemon).join('');
    pokemon_list.innerHTML = html;
    if (pokemons.length < 1025) {
        if (!document.querySelector("#load-more")) {
            pokemon_list.innerHTML += '<button id="load-more">Load more</button>'; // Mostrar botón para cargar más
            document.querySelector("#load-more").addEventListener("click", loadMorePokemons);
        }
    } else {
        const loadMoreButton = document.querySelector("#load-more");
        if (loadMoreButton) loadMoreButton.remove(); // Eliminar el botón si no hay más Pokémon para cargar
    }
}

// Cargar más Pokémon
async function loadMorePokemons() {
    if (isLoading) return;
    isLoading = true;
    const nextBatchStart = displayedPokemons.length + 1;
    const nextBatchEnd = Math.min(nextBatchStart + 29, 1025); // Cargar 30 Pokémon adicionales o hasta el total disponible
    const newPokemons = await fetchPokemons(nextBatchStart, nextBatchEnd);
    allPokemons = [...allPokemons, ...newPokemons];
    displayedPokemons = allPokemons; // Actualizamos la lista mostrada
    displayPokemons();
    isLoading = false;
}

// Filtrar Pokémon por tipo
function filterPokemonsByType(type) {
    if (type === "ver-todos") {
        displayedPokemons = allPokemons;
    } else {
        displayedPokemons = allPokemons.filter(pokemon =>
            pokemon.types.some(t => t.type.name === type)
        );
    }
    displayPokemons();
}

// Filtrar Pokémon por generación
function filterPokemonsByGeneration(gen) {
    let start, end;
    switch (gen) {
        case 1:
            start = 1;
            end = 151;
            break;
        case 2:
            start = 152;
            end = 251;
            break;
        case 3:
            start = 252;
            end = 386;
            break;
        case 4:
            start = 387;
            end = 493;
            break;
        case 5:
            start = 494;
            end = 649;
            break;
        case 6:
            start = 650;
            end = 721;
            break;
        case 7:
            start = 722;
            end = 809;
            break;
        case 8:
            start = 810;
            end = 905;
            break;
        case 9:
            start = 906;
            end = 1025;
            break;
        default:
            return;
    }
    displayedPokemons = allPokemons.filter(pokemon =>
        pokemon.id >= start && pokemon.id <= end
    );
    displayPokemons();
}

// Configurar los event listeners para los botones
btnheader.forEach(btn => {
    btn.addEventListener("click", (event) => {
        const btnId = event.currentTarget.id;

        if (btnId === "ver-todos") {
            filterPokemonsByType(btnId);
        } else if (btnId.startsWith("gen")) {
            const gen = parseInt(btnId.split("-")[1], 10);
            filterPokemonsByGeneration(gen);
        } else {
            filterPokemonsByType(btnId);
        }
    });
});

window.onload = loadInitialPokemons;

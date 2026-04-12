const pokemonList = document.querySelector("#pokemon_list");
const btnHeader = document.querySelectorAll(".btn-header");
const URL = "https://pokeapi.co/api/v2/pokemon/";
let cachedPokemonData = [];


let equipo = JSON.parse(localStorage.getItem("equipo")) || [];

function guardarEquipo() {
    localStorage.setItem("equipo", JSON.stringify(equipo));
}

function renderEquipo() {
    const teamContainer = document.querySelector("#team");
    if (!teamContainer) return;

    teamContainer.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        const slot = document.createElement("div");
        slot.classList.add("team-slot");

        if (equipo[i]) {
            slot.innerHTML = `
                <span class="remove-btn">X</span>
                <img src="${equipo[i].sprites.front_default}" />
            `;

            slot.querySelector(".remove-btn").addEventListener("click", (e) => {
                e.stopPropagation();
                eliminarPokemon(i);
            });

        } else {
            slot.innerHTML = `<span>+</span>`;
        }

        teamContainer.appendChild(slot);
    }
}

function añadirAlEquipo(id) {
    if (equipo.length >= 6) {
        alert("Máximo 6 Pokémon");
        return;
    }

    const pokemon = cachedPokemonData.find(p => p.id === id);
    if (!pokemon) return;

    if (equipo.some(p => p.id === id)) {
        alert("Ya está en el equipo");
        return;
    }

    equipo.push(pokemon);
    guardarEquipo();
    renderEquipo();
}

function eliminarPokemon(index) {
    equipo.splice(index, 1);
    guardarEquipo();
    renderEquipo();
}

document.getElementById("toggle-team").addEventListener("click", () => {
    const container = document.getElementById("team-container");
    container.classList.toggle("hidden");

    if (!container.classList.contains("hidden")) {
        renderEquipo();
    }
});



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


function traducirTipo(tipo) {
    const tipos = {
        fire: "fuego",
        water: "agua",
        grass: "planta",
        electric: "eléctrico",
        ice: "hielo",
        fighting: "lucha",
        poison: "veneno",
        ground: "tierra",
        flying: "volador",
        psychic: "psíquico",
        bug: "bicho",
        rock: "roca",
        ghost: "fantasma",
        dark: "siniestro",
        dragon: "dragón",
        steel: "acero",
        fairy: "hada",
        normal: "normal"
    };

    return tipos[tipo] || tipo;
}


function traducirStat(stat) {
    const traducciones = {
        hp: "PS",
        attack: "Ataque",
        defense: "Defensa",
        "special-attack": "At. Esp.",
        "special-defense": "Def. Esp.",
        speed: "Velocidad"
    };

    return traducciones[stat] || stat;
}


function mostrarPokemon(data) {
    let types = data.types.map((type) => `<p class="${type.type.name} type">${traducirTipo(type.type.name)}</p>`).join('');
    let pokeId = data.id.toString().padStart(4, '0');
    
    let stats = data.stats.map(stat => {
        let valor = stat.base_stat;
        let porcentaje = Math.min((valor / 150) * 100, 100);

        return `
            <div class="stat_row ${stat.stat.name}">
                <div class="stat_info">
                    <span class="stat_name">${traducirStat(stat.stat.name)}</span>
                    <span class="stat_value">${valor}</span>
                </div>

                <div class="stat_bar">
                    <div class="stat_fill" style="--final-width: ${porcentaje}%"></div>
                </div>
            </div>
        `;
    }).join('');

    const div = document.createElement("div");
    div.classList.add("pokemon");

    div.innerHTML = `
    <p class="pokemon_id_back">#${pokeId}</p>

    <div class="image_pokemon lazy">
        <img src="${data.sprites.versions['generation-v']['black-white']['animated'].front_default}" alt="${data.name}" class="lazy-img">
    </div>

    
        <!-- 🔥 BOTÓN COMO OVERLAY -->
    <button class="add-team-btn" data-id="${data.id}">
        +
    </button>

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
    </div>

    <div class="card_extra">
        <div class="extra_content">
            <h4>Estadísticas</h4>
            <div class="stats_container">
                ${stats}
            </div>
        </div>
    </div>
    `;

    // 🔥 EVENTO BOTÓN (CLAVE)
    const btn = div.querySelector(".add-team-btn");

    btn.addEventListener("click", (e) => {
        e.stopPropagation(); // evita abrir la card
        añadirAlEquipo(parseInt(btn.dataset.id));
    });

    // 🔥 TU CLICK ORIGINAL (pero protegido)
    div.addEventListener("click", (e) => {
        if (!e.target.classList.contains("add-team-btn")) {
            div.classList.toggle("active");
        }
    });

    pokemonList.append(div);
}

function mostrarTodosLosPokemon() {
    pokemonList.innerHTML = "";
    cachedPokemonData.forEach(mostrarPokemon);
}

// Filtrado por búsqueda en tiempo real (coincidencia parcial)
function filtrarPokemon(query) {
    pokemonList.innerHTML = ""; // Limpiar la lista
    let filteredPokemon;

    if (query) {
        filteredPokemon = cachedPokemonData.filter(pokemon => 
            pokemon.name.toLowerCase().includes(query.toLowerCase())
        );
    } else {
        filteredPokemon = cachedPokemonData;
    }

    if (filteredPokemon.length === 0) {
        pokemonList.innerHTML = "<p>No se encontraron Pokémon</p>"; // Mensaje cuando no se encuentran resultados
    } else {
        filteredPokemon.forEach(mostrarPokemon); // Mostrar los Pokémon filtrados
    }
}

// Filtrado por búsqueda exacta (por nombre o ID)
function filtrarPokemonExacto(query) {
    pokemonList.innerHTML = ""; // Limpiar la lista
    let filteredPokemon;

    if (!isNaN(query)) {
        // Si el query es un número, buscar por ID
        filteredPokemon = cachedPokemonData.filter(pokemon => pokemon.id === parseInt(query));
    } else {
        // Si no es un número, buscar por nombre exacto
        filteredPokemon = cachedPokemonData.filter(pokemon => pokemon.name.toLowerCase() === query.toLowerCase());
    }

    if (filteredPokemon.length === 0) {
        pokemonList.innerHTML = "<p>No se encontraron Pokémon</p>"; // Mensaje cuando no se encuentran resultados
    } else {
        filteredPokemon.forEach(mostrarPokemon); // Mostrar los Pokémon filtrados
    }
}

// Filtrado por tipos o generaciones
function filtrarPorBtn(btnId) {
    pokemonList.innerHTML = "";
    let filteredPokemon;

    switch (btnId) {
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
            // Filtrado por tipo
            filteredPokemon = cachedPokemonData.filter(pokemon => pokemon.types.some(type => type.type.name.includes(btnId)));
            break;
    }

    if (filteredPokemon.length === 0) {
        pokemonList.innerHTML = "<p>No se encontraron Pokémon</p>"; // Mensaje cuando no se encuentran resultados
    } else {
        filteredPokemon.forEach(mostrarPokemon);
    }
}

// Evento para los botones de generaciones y tipos
btnHeader.forEach(btn => {
    btn.addEventListener("click", (event) => {
        const btnId = event.currentTarget.id;
        filtrarPorBtn(btnId);
    });
});

// Evento input para búsqueda en tiempo real
document.getElementById('search').addEventListener('input', function(event) {
    const searchQuery = event.target.value.trim();
    filtrarPokemon(searchQuery);  // Búsqueda en tiempo real por coincidencias parciales
});

// Evento para buscar Pokémon por nombre o ID exacto al presionar Enter o hacer click en el botón
document.getElementById('search').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const searchQuery = event.target.value.trim();
        filtrarPokemonExacto(searchQuery);  // Búsqueda exacta por nombre o ID
    }
});




document.getElementById('btn-search').addEventListener('click', function() {
    const searchQuery = document.getElementById('search').value.trim();
    filtrarPokemonExacto(searchQuery);  // Búsqueda exacta por nombre o ID
});

cargarPokemon();





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
                <img src="${equipo[i].sprite}" />
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

// 🔥 SPRITE SYSTEM (LO IMPORTANTE)
function getSprites(data) {

    const animated =
        data.sprites.versions?.['generation-v']?.['black-white']?.animated;

    const artwork =
        data.sprites.other?.['official-artwork'];

    const isGen5OrLower = data.id <= 649;

    // GEN 1–5 → ANIMADO
    if (isGen5OrLower && animated?.front_default) {
        return {
            normal: animated.front_default,
            shiny: animated.front_shiny || animated.front_default
        };
    }

    // GEN 6–9 → ARTWORK
    return {
        normal: artwork?.front_default || data.sprites.front_default,
        shiny: artwork?.front_shiny || data.sprites.front_shiny || artwork?.front_default
    };
}

// 🔥 CARGA
async function fetchAllPokemonInParallel() {
    const promises = [];

    for (let i = 1; i <= 1025; i++) {
        promises.push(fetch(URL + i).then(r => r.json()));
    }

    const results = await Promise.all(promises);

    cachedPokemonData = results;

    mostrarTodosLosPokemon();

    localStorage.setItem('pokemonData', JSON.stringify(cachedPokemonData));
}

function cargarPokemon() {
    const stored = localStorage.getItem('pokemonData');

    if (stored) {
        cachedPokemonData = JSON.parse(stored);
        mostrarTodosLosPokemon();
    } else {
        fetchAllPokemonInParallel();
    }
}

// 🔥 TRADUCCIONES
function traducirTipo(tipo) {
    const tipos = {
        fire: "fuego", water: "agua", grass: "planta", electric: "eléctrico",
        ice: "hielo", fighting: "lucha", poison: "veneno", ground: "tierra",
        flying: "volador", psychic: "psíquico", bug: "bicho", rock: "roca",
        ghost: "fantasma", dark: "siniestro", dragon: "dragón",
        steel: "acero", fairy: "hada", normal: "normal"
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

// 🔥 POKEMON CARD
function mostrarPokemon(data) {

    const sprites = getSprites(data);

    let types = data.types.map(t =>
        `<p class="${t.type.name} type">${traducirTipo(t.type.name)}</p>`
    ).join('');

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

        <div class="image_pokemon">
            <img src="${sprites.normal}" alt="${data.name}">
        </div>

        <button class="add-team-btn" data-id="${data.id}">+</button>
        <button class="shiny-btn">✨</button>

        <div class="info_pokemon">
            <div class="conter_name">
                <p class="id_pokemon">#${pokeId}</p>
                <h2 class="name_pokemon">${data.name}</h2>
            </div>

            <div class="types_pokemon">${types}</div>

            <div class="stats">
                <p class="stat">${data.height / 10}m</p>
                <p class="stat">${data.weight / 10}kg</p>
            </div>
        </div>

        <div class="card_extra">
            <div class="extra_content">
                <h4>${data.name}</h4>
                <div class="stats_container">
                    ${stats}
                </div>
            </div>
        </div>
    `;

    const img = div.querySelector("img");
    const shinyBtn = div.querySelector(".shiny-btn");

    let isShiny = false;

    shinyBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        isShiny = !isShiny;
        img.src = isShiny ? sprites.shiny : sprites.normal;

        shinyBtn.classList.toggle("active");
    });

    div.querySelector(".add-team-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        añadirAlEquipo(data.id);
    });

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

// 🔍 FILTROS
function filtrarPokemon(query) {
    pokemonList.innerHTML = "";

    const filtered = query
        ? cachedPokemonData.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase())
        )
        : cachedPokemonData;

    filtered.forEach(mostrarPokemon);
}

function filtrarPokemonExacto(query) {
    pokemonList.innerHTML = "";

    let filtered;

    if (!isNaN(query)) {
        filtered = cachedPokemonData.filter(p => p.id === parseInt(query));
    } else {
        filtered = cachedPokemonData.filter(p => p.name.toLowerCase() === query.toLowerCase());
    }

    filtered.forEach(mostrarPokemon);
}

function filtrarPorBtn(btnId) {
    pokemonList.innerHTML = "";

    let filtered;

    switch (btnId) {
        case 'ver-todos':
            filtered = cachedPokemonData;
            break;
        case 'gen1':
            filtered = cachedPokemonData.filter(p => p.id <= 151);
            break;
        case 'gen2':
            filtered = cachedPokemonData.filter(p => p.id <= 251 && p.id > 151);
            break;
        case 'gen3':
            filtered = cachedPokemonData.filter(p => p.id <= 386 && p.id > 251);
            break;
        case 'gen4':
            filtered = cachedPokemonData.filter(p => p.id <= 493 && p.id > 386);
            break;
        case 'gen5':
            filtered = cachedPokemonData.filter(p => p.id <= 649 && p.id > 493);
            break;
        case 'gen6':
            filtered = cachedPokemonData.filter(p => p.id <= 721 && p.id > 649);
            break;
        case 'gen7':
            filtered = cachedPokemonData.filter(p => p.id <= 809 && p.id > 721);
            break;
        case 'gen8':
            filtered = cachedPokemonData.filter(p => p.id <= 905 && p.id > 809);
            break;
        case 'gen9':
            filtered = cachedPokemonData.filter(p => p.id <= 1025 && p.id > 905);
            break;
        default:
            filtered = cachedPokemonData.filter(p =>
                p.types.some(t => t.type.name.includes(btnId))
            );
    }

    filtered.forEach(mostrarPokemon);
}

// 🔥 EVENTOS
btnHeader.forEach(btn => {
    btn.addEventListener("click", e => {
        filtrarPorBtn(e.currentTarget.id);
    });
});

document.getElementById('search').addEventListener('input', e => {
    filtrarPokemon(e.target.value.trim());
});

document.getElementById('search').addEventListener('keypress', e => {
    if (e.key === 'Enter') {
        filtrarPokemonExacto(e.target.value.trim());
    }
});

document.getElementById('btn-search').addEventListener('click', () => {
    filtrarPokemonExacto(document.getElementById('search').value.trim());
});

// 🚀 INICIO
cargarPokemon();

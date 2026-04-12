const pokemonList = document.querySelector("#pokemon_list");
const btnHeader = document.querySelectorAll(".btn-header");
const URL = "https://pokeapi.co/api/v2/pokemon/";

let cachedPokemonData = [];
let isLoading = false;
let renderIndex = 0;
const RENDER_STEP = 50;

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


// =========================
// 🔥 CARGA POKÉMON OPTIMIZADA
// =========================

async function fetchAllPokemonInParallel() {
    if (isLoading) return;
    isLoading = true;

    pokemonList.innerHTML = "";

    const limit = 50;
    const total = 1025;
    const results = [];

    for (let start = 1; start <= total; start += limit) {
        const batch = [];

        for (let i = start; i < start + limit && i <= total; i++) {
            batch.push(
                fetch(URL + i)
                    .then(res => res.json())
                    .catch(() => null)
            );
        }

        const data = await Promise.all(batch);
        results.push(...data.filter(Boolean));

        cachedPokemonData = results;
        renderChunk();
    }

    cachedPokemonData = results;

    renderAllPokemon();

    try {
        localStorage.setItem("pokemonData", JSON.stringify(cachedPokemonData));
    } catch (e) {
        console.warn("localStorage lleno, ignorado");
    }

    isLoading = false;
}

// =========================
// 🔥 RENDER OPTIMIZADO
// =========================

function createPokemonCard(data) {
    const div = document.createElement("div");
    div.classList.add("pokemon");

    let pokeId = data.id.toString().padStart(4, '0');

    const normalSprite = data.sprites.versions['generation-v']['black-white']['animated'].front_default;
    const shinySprite = data.sprites.versions['generation-v']['black-white']['animated'].front_shiny;

    let isShiny = false;

    div.innerHTML = `
        <p class="pokemon_id_back">#${pokeId}</p>

        <div class="image_pokemon">
            <img src="${normalSprite}">
        </div>

        <button class="add-team-btn" data-id="${data.id}">+</button>
        <button class="shiny-btn">✨</button>

        <div class="info_pokemon">
            <p>#${pokeId}</p>
            <h2>${data.name}</h2>
        </div>
    `;

    const img = div.querySelector("img");
    const shinyBtn = div.querySelector(".shiny-btn");

    shinyBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        isShiny = !isShiny;
        img.src = isShiny && shinySprite ? shinySprite : normalSprite;
    });

    const btn = div.querySelector(".add-team-btn");

    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        añadirAlEquipo(parseInt(btn.dataset.id));
    });

    div.addEventListener("click", () => {
        div.classList.toggle("active");
    });

    return div;
}

function renderChunk() {
    const fragment = document.createDocumentFragment();

    const end = Math.min(renderIndex + RENDER_STEP, cachedPokemonData.length);

    for (let i = renderIndex; i < end; i++) {
        fragment.appendChild(createPokemonCard(cachedPokemonData[i]));
    }

    pokemonList.appendChild(fragment);
    renderIndex = end;
}

function renderAllPokemon() {
    pokemonList.innerHTML = "";
    renderIndex = 0;

    const interval = setInterval(() => {
        renderChunk();

        if (renderIndex >= cachedPokemonData.length) {
            clearInterval(interval);
        }
    }, 0);
}

// =========================
// 🔍 FILTROS
// =========================

function filtrarPokemon(query) {
    pokemonList.innerHTML = "";

    let filtered = query
        ? cachedPokemonData.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase())
        )
        : cachedPokemonData;

    filtered.forEach(p => pokemonList.appendChild(createPokemonCard(p)));
}

function filtrarPokemonExacto(query) {
    pokemonList.innerHTML = "";

    let filtered;

    if (!isNaN(query)) {
        filtered = cachedPokemonData.filter(p => p.id === parseInt(query));
    } else {
        filtered = cachedPokemonData.filter(p =>
            p.name.toLowerCase() === query.toLowerCase()
        );
    }

    if (!filtered.length) {
        pokemonList.innerHTML = "<p>No se encontraron Pokémon</p>";
        return;
    }

    filtered.forEach(p => pokemonList.appendChild(createPokemonCard(p)));
}

function filtrarPorBtn(btnId) {
    pokemonList.innerHTML = "";

    let filtered;

    switch (btnId) {
        case "ver-todos":
            filtered = cachedPokemonData;
            break;
        case "gen1":
            filtered = cachedPokemonData.filter(p => p.id <= 151);
            break;
        case "gen2":
            filtered = cachedPokemonData.filter(p => p.id > 151 && p.id <= 251);
            break;
        case "gen3":
            filtered = cachedPokemonData.filter(p => p.id > 251 && p.id <= 386);
            break;
        case "gen4":
            filtered = cachedPokemonData.filter(p => p.id > 386 && p.id <= 493);
            break;
        case "gen5":
            filtered = cachedPokemonData.filter(p => p.id > 493 && p.id <= 649);
            break;
        case "gen6":
            filtered = cachedPokemonData.filter(p => p.id > 649 && p.id <= 721);
            break;
        case "gen7":
            filtered = cachedPokemonData.filter(p => p.id > 721 && p.id <= 809);
            break;
        case "gen8":
            filtered = cachedPokemonData.filter(p => p.id > 809 && p.id <= 905);
            break;
        case "gen9":
            filtered = cachedPokemonData.filter(p => p.id > 905 && p.id <= 1025);
            break;
        default:
            filtered = cachedPokemonData.filter(p =>
                p.types.some(t => t.type.name.includes(btnId))
            );
    }

    filtered.forEach(p => pokemonList.appendChild(createPokemonCard(p)));
}

// =========================
// 🔘 EVENTOS
// =========================

btnHeader.forEach(btn => {
    btn.addEventListener("click", e => {
        filtrarPorBtn(e.currentTarget.id);
    });
});

document.getElementById("search").addEventListener("input", e => {
    filtrarPokemon(e.target.value.trim());
});

document.getElementById("search").addEventListener("keypress", e => {
    if (e.key === "Enter") {
        filtrarPokemonExacto(e.target.value.trim());
    }
});

document.getElementById("btn-search").addEventListener("click", () => {
    const val = document.getElementById("search").value.trim();
    filtrarPokemonExacto(val);
});

// =========================
// 🚀 INIT
// =========================

fetchAllPokemonInParallel();

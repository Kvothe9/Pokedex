const pokemon_list = document.querySelector("#pokemon_list");
const btnheader = document.querySelectorAll(".btn-header");
let URL = "https://pokeapi.co/api/v2/pokemon/"

for (let i = 1; i <= 1025; i++) {
    fetch(URL + i)
    .then((Response) => Response.json())
    .then(data => mostrarPokemon(data))
}

function mostrarPokemon(data) {

    let types = data.types.map((type) => 
        `<p class="${type.type.name} type">${type.type.name}</p>`);
        types = types.join('');

    let pokeId = data.id.toString();
    if (pokeId.length === 1) {
        pokeId = "00" + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = "0" + pokeId;
    }


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
                 <div class="types_pokemon">
                     ${types}
                </div>
                <div class="stats">
                     <p class="stat">${data.height}m</p>
                     <p class="stat">${data.weight}kg</p>
             </div>
        </div>    
    `;
    pokemon_list.append(div);
}


btnheader.forEach(btn => btn.addEventListener("click", (event) => {
    const btnId = event.currentTarget.id;


    pokemon_list.innerHTML = "";

    for (let i = 1; i <= 1025; i++) {
        fetch(URL + i)
        .then((Response) => Response.json())
        .then(data => {

            if(btnId === "ver-todos"){
                mostrarPokemon(data);
            } else {
                const types = data.types.map(type => type.type.name);
                if (types.some(type => type.includes(btnId))){
                    mostrarPokemon(data);
            }
            }

            
        })  
    }

    pokemon_list.innerHTML = "";

    for (let i = 1; i <= 151; i++) {
        fetch(URL + i)
        .then((Response) => Response.json())
        .then(data => {

            if(btnId === "1-generacion"){
                mostrarPokemon(data);
            } else {
                const types = data.types.map(type => type.type.name);
                if (types.some(type => type.includes(btnId))){
                    mostrarPokemon(data);
            }
            }

            
        })  
    }

    pokemon_list.innerHTML = "";

    for (let i = 150; i <= 251; i++) {
        fetch(URL + i)
        .then((Response) => Response.json())
        .then(data => {

            if(btnId === "2-generacion"){
                mostrarPokemon(data);
            } else {
                const types = data.types.map(type => type.type.name);
                if (types.some(type => type.includes(btnId))){
                    mostrarPokemon(data);
            }
            }

            
        })  
    }

    pokemon_list.innerHTML = "";

    for (let i = 250; i <= 386; i++) {
        fetch(URL + i)
        .then((Response) => Response.json())
        .then(data => {

            if(btnId === "3-generacion"){
                mostrarPokemon(data);
            } else {
                const types = data.types.map(type => type.type.name);
                if (types.some(type => type.includes(btnId))){
                    mostrarPokemon(data);
            }
            }

            
        })  
    }

    pokemon_list.innerHTML = "";

    for (let i = 385; i <= 493; i++) {
        fetch(URL + i)
        .then((Response) => Response.json())
        .then(data => {

            if(btnId === "4-generacion"){
                mostrarPokemon(data);
            } else {
                const types = data.types.map(type => type.type.name);
                if (types.some(type => type.includes(btnId))){
                    mostrarPokemon(data);
            }
            }

            
        })  
    }

    pokemon_list.innerHTML = "";

    for (let i = 492; i <= 649; i++) {
        fetch(URL + i)
        .then((Response) => Response.json())
        .then(data => {

            if(btnId === "5-generacion"){
                mostrarPokemon(data);
            } else {
                const types = data.types.map(type => type.type.name);
                if (types.some(type => type.includes(btnId))){
                    mostrarPokemon(data);
            }
            }

            
        })  
    }

    pokemon_list.innerHTML = "";

    for (let i = 648; i <= 721; i++) {
        fetch(URL + i)
        .then((Response) => Response.json())
        .then(data => {

            if(btnId === "6-generacion"){
                mostrarPokemon(data);
            } else {
                const types = data.types.map(type => type.type.name);
                if (types.some(type => type.includes(btnId))){
                    mostrarPokemon(data);
            }
            }

            
        })  
    }

    pokemon_list.innerHTML = "";

    for (let i = 720; i <= 809; i++) {
        fetch(URL + i)
        .then((Response) => Response.json())
        .then(data => {

            if(btnId === "7-generacion"){
                mostrarPokemon(data);
            } else {
                const types = data.types.map(type => type.type.name);
                if (types.some(type => type.includes(btnId))){
                    mostrarPokemon(data);
            }
            }

            
        })  
    }

    pokemon_list.innerHTML = "";

    for (let i = 809; i <= 905; i++) {
        fetch(URL + i)
        .then((Response) => Response.json())
        .then(data => {

            if(btnId === "8-generacion"){
                mostrarPokemon(data);
            } else {
                const types = data.types.map(type => type.type.name);
                if (types.some(type => type.includes(btnId))){
                    mostrarPokemon(data);
            }
            }

            
        })  
    }

    pokemon_list.innerHTML = "";

    for (let i = 904; i <= 1025; i++) {
        fetch(URL + i)
        .then((Response) => Response.json())
        .then(data => {

            if(btnId === "9-generacion"){
                mostrarPokemon(data);
            } else {
                const types = data.types.map(type => type.type.name);
                if (types.some(type => type.includes(btnId))){
                    mostrarPokemon(data);
            }
            }

            
        })  
    }
}))
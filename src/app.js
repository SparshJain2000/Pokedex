"use strict";
const container = document.getElementById("pokemons");
const query = document.getElementById("query");
document.addEventListener("DOMContentLoaded", () => {
    showPokemons(0);
});
// document.querySelectorAll("img").forEach((img) => {
//     console.log(img);
//     img.addEventListener("load", function () {
//         console.log("loaded");
//         this.classList.remove("loading");
//     });
// });
const removeLoading = (event) => {
    console.log("loaded");
    event.classList.remove("loading");
};
const morePokemons = () => {
    container.innerHTML += `<div class="spinner-border spinner-border-lg text-primary" id='loader'></div>`;
    showPokemons(document.querySelectorAll(".card").length);
};
const getPokemon = (id) => {
    return axios
        .get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((response) => response.data)
        .catch((err) => console.log(err));
};
let Pokemons = [];
const display = (pokemons) => {
    let cards = "";
    pokemons.forEach((pokemon) => {
        cards += `<div class="card  col-md-2 col-sm-3 col-5 p-0 m-2">
                <img class="card-img loading" onload='removeLoading(this)' src=${pokemon.image}>
                <div class="card-header text-capitalize"><h5>${pokemon.name}</h5></div>
            </div>`;
    });
    container.innerHTML = cards;
};
const showPokemons = (x) => {
    let promises = [];
    // let i = 0;
    for (let i = x; i < x + 20; i++) {
        promises.push(new Promise((resolve, reject) => {
            const pokemon = getPokemon(i + 1);
            pokemon
                .then((data) => {
                // let types: string[];
                // data.types.forEach((type: any) => types.push(type.type.name))
                const pokmon = {
                    id: data.id,
                    name: data.name,
                    image: data.sprites.front_shiny,
                    type: data.types.map((type) => type.type.name),
                };
                Pokemons = [...Pokemons, pokmon];
                resolve("done");
                // console.log(Pokemons)
            })
                .catch((err) => reject(err));
        }));
    }
    Promise.all(promises).then((mess) => {
        display(Pokemons);
        const loader = document.getElementById("loader");
        if (loader)
            loader.remove();
    });
};
const findPokemon = () => {
    container.innerHTML = `<div class="spinner-border spinner-border-lg text-primary"></div>`;
    const pr = getPokemon(query.value.toLowerCase());
    pr.then((data) => {
        const pokmon = {
            id: data.id,
            name: data.name,
            image: data.sprites.front_shiny,
            type: data.types.map((type) => type.type.name),
            abilities: data.abilities.map((type) => type.ability.name),
        };
        console.log(pokmon);
        container.innerHTML = `<div class="media w-75 rounded" >
                <img src=${pokmon.image} alt="" class="card-img img-fluid w-25 align-self-center m-1 p-2">
                <div class="media-body py-5 p-3 row">
                <h2 class='col-12 text-align-center' >${pokmon.name}</h2>
                
                <ul class='list-group p-4 list-group-flush col-6'> <h5 style='text-align:center'>Types</h5>
                    ${pokmon.type
            .map((type) => `<li class='list-group-item'>${type}</li>`)
            .join("")}
                </ul>
                <ul class='list-group p-4 list-group-flush col-6'> <h5 style='text-align:center'>Abilities</h5>
                    ${pokmon.abilities
            .map((ability) => `<li class='list-group-item'>${ability}</li>`)
            .join("")}
                </ul>
                </div>
            </div>`;
    }).catch((err) => (container.innerHTML = `<div>Check your spelling</div>`));
};

"use strict";
// import axios from ;
const container = document.getElementById('pokemons');
const query = document.getElementById('query');
// const async getTypes = (): string[] => {
//     return ;
// };
document.addEventListener("DOMContentLoaded", () => {
    findPokemons();
});
const getPokemon = (id) => {
    console.log(id);
    return axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((response) => response.data)
        .catch((err) => console.log(err));
};
let Pokemons = [];
const findPokemons = () => {
    for (let i = 0; i < 20; i++) {
        const pokemon = getPokemon(i + 1);
        pokemon.then((data) => {
            // let types: string[];
            // data.types.forEach((type: any) => types.push(type.type.name))
            const pokmon = {
                id: data.id,
                name: data.name,
                image: data.sprites.frony_shiny,
                type: data.types.map((type) => type.type.name)
            };
            Pokemons = [...Pokemons, pokmon];
            console.log(Pokemons);
        });
    }
};
const findPokemon = () => {
    const pr = getPokemon(query.value.toLowerCase());
    pr.then((data) => {
        console.log(data);
        const pokmon = {
            id: data.id,
            name: data.name,
            image: data.sprites.back_shiny,
            type: data.types.map((type) => type.type.name),
        };
        container.innerHTML = `<div class="card">
    <img src=${pokmon.image} alt="" class="card-img">
    <div class="card-header">${pokmon.name}</div>
</div>`;
    })
        .catch((err) => container.innerHTML = `<div>Check your spelling</div>`);
};

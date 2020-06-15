"use strict";
const container = document.getElementById("pokemons");
const query = document.getElementById("query");
document.addEventListener("DOMContentLoaded", () => {
    showPokemons(0);
});
const closeModal = () => {
    const modal = document.getElementById('exampleModalCenter');
    if (modal)
        modal.remove();
};
const displayPokemon = (name) => {
    getPokemon(name).then((data) => {
        container.innerHTML +=
            `<div class="modal fade " id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" >
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content text-white bg-dark" >
                    <div class="modal-header ">
                        <h5 class="modal-title" id="exampleModalLongTitle">${data.name}</h5>
                        <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close" onclick='closeModal()'>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body d-flex flex-column justify-content-center">
                        <img src="${data.sprites.front_default}" class='bg-white img-fluid mx-auto' style=' border-radius: 50%; border: 5px solid #163047;  margin-top: 20px;  box-shadow: 0 10px 80px rgb(25, 204, 235);'>
                        <h2 class='mt-5 mx-auto text-capitalize' style='font-size:1.5rem'>${data.name}</h2>
                        <h1 class='mb-5 mx-auto text-capitalize' style='font-size:1rem'>BASE-EXP : ${data.base_experience}</h1>
                        
                        <div class='mb-5 row justify-content-center px-2'>
                            <div class='col-6' style='text-align:center'> <strong><em>Abilities</em></strong> <hr class='bg-secondary'>
                                ${data.abilities.map((ablility) => {
                return ablility.ability.name;
            }).join(" , ")}
                            </div>
                            <div class='col-6' style='text-align:center'> <strong><em>Types</em></strong> <hr class='bg-secondary'>
                                ${data.types.map((type) => {
                return type.type.name;
            }).join(" , ")}
                            </div>

                            ${data.stats.map((stat) => {
                return `<div class='col-4 my-4' style='text-align:center'><strong class='text-capitalize'>
                                        <em>${stat.stat.name}</em> <hr class='bg-secondary'> ${stat.base_stat}
                                </div>`;
            }).join("")}
                        </div>
                        <div class='mx-auto'>
                            
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick='closeModal()'>Close</button>
                    </div>
                </div>
            </div>
        </div>`;
        $('#exampleModalCenter').modal('show');
        $('.alert').remove();
    }).catch((err) => {
        $('#alert').html(`<div class="alert alert-primary alert-dismissible fade show" role = "alert" >
                            Invalid Pokemon Name
                            <button type = "button" class="close" data-dismiss="alert" aria-label="Close" >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`);
    });
};
const showDetails = (event) => {
    displayPokemon(event.children[1].children[0].textContent);
};
const removeLoading = (event) => {
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
const display = (pokemons, num) => {
    let cards = "";
    for (let i = num; i < num + 20; i++) {
        cards += `<div class="pok card draw-border col-md-2 col-sm-3 col-5 p-0 m-2" onclick='showDetails(this)'>
                <img class="card-img img-fluid loading" onload='removeLoading(this)' src=${pokemons[i].image}>
                <div class="card-header text-capitalize"><h5 class='responsive_headline'>${pokemons[i].name}</h5></div>
            </div>`;
    }
    container.innerHTML += cards;
};
const showPokemons = (num) => {
    let promises = [];
    for (let i = num; i < num + 20; i++) {
        promises.push(new Promise((resolve, reject) => {
            const pokemon = getPokemon(i + 1);
            pokemon
                .then((data) => {
                const pokmon = {
                    id: data.id,
                    name: data.name,
                    image: data.sprites.front_default,
                    type: data.types.map((type) => type.type.name),
                };
                Pokemons = [...Pokemons, pokmon];
                resolve("done");
            })
                .catch((err) => reject(err));
        }));
    }
    Promise.all(promises).then((mess) => {
        display(Pokemons, num);
        const loader = document.getElementById("loader");
        if (loader)
            loader.remove();
    });
};
const findPokemon = () => {
    displayPokemon(query.value.toLowerCase());
    const loader = document.getElementById("loader");
    if (loader)
        loader.remove();
};

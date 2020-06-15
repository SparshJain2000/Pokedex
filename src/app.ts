const container: HTMLElement | any = document.getElementById("pokemons");
const query: HTMLElement | any = document.getElementById("query");
interface IPokemon {
    id: number;
    name: string;
    image: string;
    type: string[];
}
document.addEventListener("DOMContentLoaded", (): void => {
    showPokemons(0);
});
const closeModal = (): void => {
    const modal:(HTMLElement|any) = document.getElementById('exampleModalCenter');
    if(modal) modal.remove();
}
const showDetails = (event: HTMLElement | any): void => {
    console.log(event);
    getPokemon(event.children[1].children[0].textContent).then((data: any) => {
        console.log(data);
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
                        <img src="${data.sprites.front_default}" class='bg-white img-fluid mx-auto w-50' style=' border-radius: 50%; border: 5px solid #163047;  margin-top: 20px;  box-shadow: 0 10px 80px rgb(25, 204, 235);'>
                        <h2 class='mt-5 mx-auto text-capitalize' style='font-size:2.5rem'>${data.name}</h2>
                        <h1 class='mb-5 mx-auto text-capitalize' style='font-size:1.5rem'>BASE-EXP : ${data.base_experience}</h1>
                        
                        <div class='mb-5 row justify-content-center px-4'>
                            <div class='col-6' style='text-align:center'> <strong><em>Abilities</em></strong> <hr class='bg-secondary'>
                                ${data.abilities.map((ablility: any) => {
                                    return ablility.ability.name;
                                }).join(" , ")}
                            </div>
                            <div class='col-6' style='text-align:center'> <strong><em>Types</em></strong> <hr class='bg-secondary'>
                                ${data.types.map((type: any) => {
                                    return type.type.name;
                                }).join(" , ")}
                            </div>

                            ${data.stats.map((stat: any) => {
                                return `<div class='col-4 my-4' style='text-align:center'><strong class='text-capitalize'>
                                        <em>${stat.stat.name}</em> <hr class='bg-secondary'> ${stat.base_stat}
                                </div>`
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
    }).catch((err: any) => console.log(err));   
}
const removeLoading = (event: HTMLElement): void => {
    console.log("loaded");
    event.classList.remove("loading");
};
const morePokemons = (): void => {
    container.innerHTML += `<div class="spinner-border spinner-border-lg text-primary" id='loader'></div>`;
    showPokemons(document.querySelectorAll(".card").length);
    
};
const getPokemon = (id: number | string): any => {
    return axios
        .get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((response: any) => response.data)
        .catch((err: Error) => console.log(err));
};
let Pokemons: (IPokemon[] | any) = [];
const display = (pokemons: IPokemon[],num:number): void => {
    let cards: string = "";
    for (let i: number = num; i < num + 20; i++) { 
        console.log(pokemons[i])
        cards += `<div class="card draw-border col-md-2 col-sm-3 col-5 p-0 m-2" onclick='showDetails(this)'>
                <img class="card-img img-fluid loading" onload='removeLoading(this)' src=${pokemons[i].image}>
                <div class="card-header text-capitalize"><h5 class='responsive_headline'>${pokemons[i].name}</h5></div>
            </div>`;
    }
    container.innerHTML += cards;
    fitText(document.querySelectorAll('.responsive_headline'),1);
    fitText(document.querySelectorAll('.responsive_input'));
    
};
const showPokemons = (num: number): void => {
    let promises = [];
    // let i = 0;
    for (let i = num; i < num + 20; i++) {
        promises.push(
            new Promise((resolve, reject) => {
                const pokemon: any = getPokemon(i + 1); 
                pokemon
                    .then((data: any) => {
                        const pokmon = {
                            id: data.id,
                            name: data.name,
                            image: data.sprites.front_default,
                            type: data.types.map((type: any) => type.type.name),
                        };
                        Pokemons = [...Pokemons, pokmon];
                        resolve("done");
                    })
                    .catch((err: Error) => reject(err));
            })
        );
    }
    Promise.all(promises).then((mess) => {
        display(Pokemons,num);
        const loader = document.getElementById("loader");
        if (loader) loader.remove();
    });
};
const findPokemon = (): void => {
    container.innerHTML = `<div class="spinner-border spinner-border-lg text-primary"></div>`;
    const pr = getPokemon(query.value.toLowerCase());

    pr.then((data: any) => {
        const pokmon = {
            id: data.id,
            name: data.name,
            image: data.sprites.front_default,
            type: data.types.map((type: any) => type.type.name),
            abilities: data.abilities.map((type: any) => type.ability.name),
        };
        console.log(pokmon);

        container.innerHTML = `<div class="media w-75" >
                <img src=${
                    pokmon.image
                } alt="" class="card-img img-fluid w-25 align-self-center m-1 p-2">
                <div class="media-body py-5 p-3 row">
                <h2 class='col-12  text-capitalize ml-4' ><em>${pokmon.name}</em></h2>
                
                <ul class='p-4  col-6'> <h5 style='text-align:center'>Types</h5><hr>
                    ${pokmon.type
                        .map(
                            (type: string) =>
                                `<li class='ml-5 px-3 py-2'>${type}</li>`
                        )
                        .join("")}
                </ul>
                <ul class='p-4  col-6'> <h5 style='text-align:center'>Abilities</h5><hr>
                    ${pokmon.abilities
                        .map(
                            (ability: string) =>
                                `<li class='ml-5 px-3 py-2'>${ability}</li>`
                        )
                        .join("")}
                </ul>
                </div>
            </div>`;
    }).catch((err: any) => {
        container.innerHTML = `<div>Check your spelling ${err}</div>`;
        console.log(err);
    });
};

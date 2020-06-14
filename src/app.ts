// import axios from ;
const container: HTMLElement | any = document.getElementById('pokemons');
const query: HTMLElement | any = document.getElementById('query');
interface IPokemon {
    id: number;
    name: string;
    image: string;
    type: string[];
}
// const async getTypes = (): string[] => {
//     return ;
// };
document.addEventListener("DOMContentLoaded",  ():void=> {
    showPokemons(0);
});
const getPokemon = (id: (number | string)): any => {
    return axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((response: any) => response.data)
        .catch((err: Error) => console.log(err))
}
let Pokemons: IPokemon[] | any = [];
const display = (pokemons: IPokemon[]): void => {
    pokemons.forEach((pokemon:IPokemon) => {
        container.innerHTML +=
            `<div class="card  col-md-2 col-sm-3 col-5 p-0 m-2">
                <img class="card-img" src=${pokemon.image}>
                <div class="card-header">${pokemon.name}</div>
            </div>`
    })
}
const showPokemons = (x:number): void => {
    for (let i: number = x; i < x+20; i++){
        const pokemon: any = getPokemon(i + 1);
        pokemon.then((data: any) => {
            // let types: string[];
            // data.types.forEach((type: any) => types.push(type.type.name))
            const pokmon = {
                id: data.id,
                name: data.name,
                image:data.sprites.front_shiny,
                type:data.types.map((type:any)=>type.type.name)
            }
            Pokemons=[...Pokemons,pokmon]
        }).then(() => {
            container.innerHTML = "";
            display(Pokemons); });
        

    }
}
const findPokemon = (): void => {
    container.innerHTML = `<div class="spinner-border spinner-border-lg text-primary"></div>`;
    const pr = getPokemon(query.value.toLowerCase());
    
    pr.then((data: any) => {
        const pokmon = {
            id: data.id,
            name: data.name,
            image: data.sprites.front_shiny,
            type: data.types.map((type: any) => type.type.name),
            abilities: data.abilities.map((type: any) => type.ability.name)
        }
        console.log(pokmon);
        
        container.innerHTML =
            `<div class="media w-75 rounded" >
                <img src=${pokmon.image} alt="" class="card-img img-fluid w-25 align-self-center m-1 p-2">
                <div class="media-body py-5 p-3 row">
                <h2 class='col-12 text-align-center' >${pokmon.name}</h2>
                
                <ul class='list-group p-4 list-group-flush col-6'> <h5 style='text-align:center'>Types</h5>
                    ${pokmon.type.map(((type: string) => `<li class='list-group-item'>${type}</li>`)).join("")}
                </ul>
                <ul class='list-group p-4 list-group-flush col-6'> <h5 style='text-align:center'>Abilities</h5>
                    ${pokmon.abilities.map(((ability: string) => `<li class='list-group-item'>${ability}</li>`)).join("")}
                </ul>
                </div>
            </div>`;
        

    })
    .catch((err: any) => container.innerHTML = `<div>Check your spelling</div>`)
    
}
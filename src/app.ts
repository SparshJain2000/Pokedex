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
    findPokemons();
});
const getPokemon = (id: (number | string)): any => {
    console.log(id)
    return axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((response: any) => response.data)
        .catch((err: Error) => console.log(err))
}
let Pokemons: IPokemon[] | any=[];
const findPokemons = (): void => {
    for (let i: number = 0; i < 20; i++){
        const pokemon: any = getPokemon(i + 1);
        pokemon.then((data: any) => {
            // let types: string[];
            // data.types.forEach((type: any) => types.push(type.type.name))
            const pokmon = {
                id: data.id,
                name: data.name,
                image:data.sprites.frony_shiny,
                type:data.types.map((type:any)=>type.type.name)
            }
            Pokemons=[...Pokemons,pokmon]
            console.log(Pokemons)
        });

    }
    
}
const findPokemon = (): void => {
    
    const pr = getPokemon(query.value.toLowerCase());
    
    pr.then((data: any) => {
        console.log(data)
        const pokmon = {
            id: data.id,
            name: data.name,
            image: data.sprites.back_shiny,
            type: data.types.map((type: any) => type.type.name),
        }
        container.innerHTML =`<div class="card">
    <img src=${pokmon.image} alt="" class="card-img">
    <div class="card-header">${pokmon.name}</div>
</div>`
    
        
    })
    .catch((err: any) => container.innerHTML = `<div>Check your spelling</div>`)
    
}
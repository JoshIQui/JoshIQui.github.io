import * as utils from "./utils.js";
import "./game-card.js";
import "./character-card.js";
import "./monster-card.js";
import "./boss-card.js";
import "./dungeon-card.js";
import "./place-card.js";
import "./item-card.js";

const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<link rel="stylesheet" href="./styles/search.css">
<section>
<div class="columns is-vcentered">
    <div class="column">  
        <div class="hero is-large is-primary p-2">
        <div class="hero-head">
            <p class="title">
            Search Menu
            </p>
            <p>
                Category
            </p>
            <br>
            <div class="select">
                <select>
                    <option value="games">Games</option>
                    <option value="characters">Characters</option>
                    <option value="monsters">Monsters</option>
                    <option value="bosses">Bosses</option>
                    <option value="dungeons">Dungeons</option>
                    <option value="places">Places</option>
                    <option value="items">Items</option>
                </select>
            </div>
            <br>
            <p>
                Search Term
            </p>
            <br>
            <input class="input" id="search-input" type="text" placeholder="search by name">
            <br>
            <button id="search-btn" class="button">Search</button>
            <button id="clear-btn" class="button">Clear Search Settings</button>
            <hr>
            <div id="output">
            </div>
        </div>
        <hr>
        <div class="hero-footer">Contact: jiq4449@rit.edu</div>
        </div>
    </div>
</div>
</section>
`;

class SearchMenu extends HTMLElement{
    constructor(){
    super();
        // 1 - attach a shadow DOM tree to this instance - this creates `.shadowRoot` for us
        this.attachShadow({mode: "open"});

        // 2 - Clone `template` and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Generate Fields
        this.select = this.shadowRoot.querySelector("select");
        this.input = this.shadowRoot.querySelector("#search-input");
        this.searchButton = this.shadowRoot.querySelector("#search-btn");
        this.clearButton = this.shadowRoot.querySelector("#clear-btn");
        this.div = this.shadowRoot.querySelector("#output");
        this.url = "https://zelda.fanapis.com/api/games";
        this.category = "games";
        this.term = "";
    }

    // 3 - called when the component is added to the page
    connectedCallback(){
        let appState = utils.loadAppData();

        //Determine the previously used category from local storage
        this.select.value = appState.select;
        this.category = this.select.value

        //Determine the previously inputted search term from local storage
        this.input.value = appState.input;
        this.term = this.input.value;

        this.div.innerHTML = appState.output;

        this.searchButton.onclick = async () => {
            //console.log(this.shadowRoot.querySelector("option"));

            //Give the button a loading icon
            this.searchButton.className = "button is-loading";

            //Determine the URL
            if (this.term === ""){
                this.url = `https://zelda.fanapis.com/api/${this.category}?limit=100`;
            }
            else{
                this.url = `https://zelda.fanapis.com/api/${this.category}?name=${this.term}&limit=100`;
            }

            this.shadowRoot.querySelector("#output").innerHTML = "";

            console.log(this.url);
            const data = await utils.loadData(this.url);

            console.log(data);
            if (data.length == 0){
                this.div.innerHTML = `<p class="title">No results found</p>`;
            }
            
            //Determines which type of card to create
            switch(this.category){
                case "games":
                    this.createGameCards(data);
                    break;
                case "characters":
                    this.createCharacterCards(data);
                    break;
                case "monsters":
                    this.createMonsterCards(data);
                    break;
                case "bosses":
                    this.createBossCards(data);
                    break;
                case "dungeons":
                    this.createDungeonCards(data);
                    break;
                case "places":
                    this.createPlaceCards(data);
                    break;
                case "items":
                    this.createItemCards(data);
                    break;
            }

            utils.saveAppState(this.select.value, this.input.value, this.shadowRoot.querySelector("#output").outerHTML);

            //Remove the loading icon from the button
            this.searchButton.className = "button";
        };

        //Resets the search settings to default
        this.clearButton.onclick = () => {
            utils.clearAppData();
            this.select.value = "games";
            this.category = this.select.value;

            this.input.value = "";
            this.term = this.input.value;
        }

        //Change the search category
        this.select.onchange = () => {
            this.category = this.select.value;
            this.input.value = "";
            this.term = "";
        }

        //Change the search term
        this.input.onchange = () => {
            this.term = this.input.value;
        }
    }

    disconnectedCallback(){
        this.searchButton.onclick = null;
        this.clearButton.onclick = null;
    }

    //Creates a game card
    async createGameCards(jsonData){
        for (const data of jsonData){
            const card = document.createElement("game-card");
            card.dataset.name = data.name ?? "no name found";
            card.dataset.developer = data.developer ?? "no developer found";
            card.dataset["released_date"] = data["released_date"] ?? "no release date found";
            card.dataset.description = data.description ?? "no description";
            this.shadowRoot.querySelector("#output").appendChild(card);
        }
    }

    //Creates a character card
    async createCharacterCards(jsonData){
        for (const data of jsonData){
            const card = document.createElement("character-card");
            card.dataset.name = data.name ?? "no name found";
            card.dataset.gender = data.gender ?? "unknown";
            card.dataset.race = data.race ?? "unknown";
            card.dataset.description = data.description ?? "no description";
            this.shadowRoot.querySelector("#output").appendChild(card);
        }
    }

    //Creates a monster card
    async createMonsterCards(jsonData){
        for (const data of jsonData){
            const card = document.createElement("monster-card");
            card.dataset.name = data.name ?? "no name found";
            card.dataset.description = data.description ?? "no description";
            this.shadowRoot.querySelector("#output").appendChild(card);
        }
    }

    //Creates a boss card
    async createBossCards(jsonData){
        for (const data of jsonData){
            const card = document.createElement("boss-card");
            card.dataset.name = data.name ?? "no name found";
            card.dataset.description = data.description ?? "no description";
            this.shadowRoot.querySelector("#output").appendChild(card);
        }
    }

    //Creates a dungeon card
    async createDungeonCards(jsonData){
        for (const data of jsonData){
            const card = document.createElement("dungeon-card");
            card.dataset.name = data.name ?? "no name found";
            card.dataset.description = data.description ?? "no description";
            this.shadowRoot.querySelector("#output").appendChild(card);
        }
    }

    //Creates a place card
    async createPlaceCards(jsonData){
        for (const data of jsonData){
            const card = document.createElement("place-card");
            card.dataset.name = data.name ?? "no name found";
            card.dataset.description = data.description ?? "no description";
            this.shadowRoot.querySelector("#output").appendChild(card);
        }
    }

    //Creates an item card
    async createItemCards(jsonData){
        for (const data of jsonData){
            const card = document.createElement("item-card");
            card.dataset.name = data.name ?? "no name found";
            card.dataset.description = data.description ?? "no description";
            this.shadowRoot.querySelector("#output").appendChild(card);
        }
    }
} 
    
customElements.define('search-menu', SearchMenu);
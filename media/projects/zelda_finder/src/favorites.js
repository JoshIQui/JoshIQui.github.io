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
<link rel="stylesheet" href="./styles/catalogue.css">
<div class="columns is-vcentered">
    <div class="column">  
        <div class="hero is-large is-primary p-2">
        <div class="hero-head">
            <p class="title">
            Favorites
            </p>
            <button class="button">Clear Favorites</button>
            <div id="cards">
            </div>
        </div>
        <hr>
        <div class="hero-footer">Contact: jiq4449@rit.edu</div>
        </div>
    </div>
</div>
`;

class FavoriteList extends HTMLElement{
    constructor(){
    super();
        // 1 - attach a shadow DOM tree to this instance - this creates `.shadowRoot` for us
        this.attachShadow({mode: "open"});

        // 2 - Clone `template` and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // Generate Fields
        this.button = this.shadowRoot.querySelector("button");
        this.div = this.shadowRoot.querySelector("#cards");
    }

    // 3 - called when the component is added to the page
    connectedCallback(){
        this.favorites = utils.getFavorites();
        this.createFavoriteCards(this.favorites);
        this.button.onclick = () => {
            utils.clearFavorites();
            this.div.innerHTML = "";

            for (let i = 0; i < this.favorites.length; i += 1)
            {
                utils.decreaseFavorite(this.favorites[i]);
            }
        }
        this.render();
    }

    disconnectedCallback(){
        this.button.onclick = null;
    }

    //Creates a card for each favorite
    createFavoriteCards(favorites){
        for (const favorite of favorites){
            let card;
            switch(favorite.type){
                case "game":
                    card = document.createElement("game-card");
                    card.dataset.name = favorite.name ?? "no name found";
                    card.dataset.developer = favorite.developer ?? "no developer found";
                    card.dataset.released_date = favorite.released_date ?? "no release date found";
                    card.dataset.description = favorite.description ?? "no description";
                    break;
                case "character":
                    card = document.createElement("character-card");
                    card.dataset.name = favorite.name ?? "no name found";
                    card.dataset.gender = favorite.gender ?? "unknown";
                    card.dataset.race = favorite.race ?? "unknown";
                    card.dataset.description = favorite.description ?? "no description";
                    break;
                case "monster":
                    card = document.createElement("monster-card");
                    card.dataset.name = favorite.name ?? "no name found";
                    card.dataset.description = favorite.description ?? "no description";
                    break;
                case "boss":
                    card = document.createElement("boss-card");
                    card.dataset.name = favorite.name ?? "no name found";
                    card.dataset.description = favorite.description ?? "no description";
                    break;
                case "dungeon":
                    card = document.createElement("dungeon-card");
                    card.dataset.name = favorite.name ?? "no name found";
                    card.dataset.description = favorite.description ?? "no description";
                    break;
                case "place":
                    card = document.createElement("place-card");
                    card.dataset.name = favorite.name ?? "no name found";
                    card.dataset.description = favorite.description ?? "no description";
                    break;
                case "item":
                    card = document.createElement("item-card");
                    card.dataset.name = favorite.name ?? "no name found";
                    card.dataset.description = favorite.description ?? "no description";
                    break;
            }

            //Add the card to the output
            this.div.appendChild(card);
        }
    }
} 
    
customElements.define('favorite-list', FavoriteList);
import { onValue } from  "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
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
            Community Favorites
            </p>
            <div id="cards"></div>
        </div>
        <hr>
        <div class="hero-footer">Contact: jiq4449@rit.edu</div>
        </div>
    </div>
</div>
`;

class CommunityList extends HTMLElement{
    constructor(){
    super();
        // 1 - attach a shadow DOM tree to this instance - this creates `.shadowRoot` for us
        this.attachShadow({mode: "open"});

        // 2 - Clone `template` and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    // 3 - called when the component is added to the page
    connectedCallback(){
        // Generate Fields
        let cards = this.shadowRoot.querySelector("#cards");

        let communityFavorites = [];

        onValue(utils.favoritesReference,loadCommunityFavorites);

        //Loads each favorite to the page
        function loadCommunityFavorites(snapshot){
            snapshot.forEach(favorite => {
                const favoriteData = favorite.val();
                if (favoriteData.likes > 0)
                {
                    communityFavorites.push(favoriteData);
                }
            });
            
            if (communityFavorites.length === 0)
            {
                cards.innerHTML = 
                `<p class="title">No Community Favorites - Go and Favorite some!</p>`;
            }
            createCommunityCards(communityFavorites);
        }

        function createCommunityCards(favorites){
            for (let i = 0; i < favorites.length; i += 1){
                let card;
                switch(favorites[i].type){
                    case "game":
                        card = document.createElement("game-card");
                        card.dataset.name = favorites[i].name ?? "no name found";
                        card.dataset.developer = favorites[i].developer ?? "no developer found";
                        card.dataset.released_date = favorites[i].released_date ?? "no release date found";
                        card.dataset.description = favorites[i].description ?? "no description";
                        break;
                    case "character":
                        card = document.createElement("character-card");
                        card.dataset.name = favorites[i].name ?? "no name found";
                        card.dataset.gender = favorites[i].gender ?? "unknown";
                        card.dataset.race = favorites[i].race ?? "unknown";
                        card.dataset.description = favorites[i].description ?? "no description";
                        break;
                    case "monster":
                        card = document.createElement("monster-card");
                        card.dataset.name = favorites[i].name ?? "no name found";
                        card.dataset.description = favorites[i].description ?? "no description";
                        break;
                    case "boss":
                        card = document.createElement("boss-card");
                        card.dataset.name = favorites[i].name ?? "no name found";
                        card.dataset.description = favorites[i].description ?? "no description";
                        break;
                    case "dungeon":
                        card = document.createElement("dungeon-card");
                        card.dataset.name = favorites[i].name ?? "no name found";
                        card.dataset.description = favorites[i].description ?? "no description";
                        break;
                    case "place":
                        card = document.createElement("place-card");
                        card.dataset.name = favorites[i].name ?? "no name found";
                        card.dataset.description = favorites[i].description ?? "no description";
                        break;
                    case "item":
                        card = document.createElement("item-card");
                        card.dataset.name = favorites[i].name ?? "no name found";
                        card.dataset.description = favorites[i].description ?? "no description";
                        break;
                }
                card.dataset.likes = favorites[i].likes ?? "";
                //console.log(card);
                cards.appendChild(card);
            }
        }
        this.render();
    }

    disconnectedCallback(){
    }

    // 4 - a helper method to display the values of the attributes
    render(){

    }
} 
    
customElements.define('community-list', CommunityList);
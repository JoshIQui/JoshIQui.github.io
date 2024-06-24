import * as utils from "./utils.js";
const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<link rel="stylesheet" href="./styles/card.css">
<div class="card">
    <div class="media-content">
    <p id="likes"></p>
    <button class="button">Favorite</button>
    <h2 id="name" class="title"></h2>
    <p id="gender"></p>
    <p id="race"></p>
    <p id="description"></p>
    </div>
</div>
`;

class CharacterCard extends HTMLElement{
    constructor(){
        super();
        // 1 - attach a shadow DOM tree to this instance - this creates `.shadowRoot` for us
        this.attachShadow({mode: "open"});

        // 2 - Clone `template` and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // 3 - Create properies to manipulate the Shadow DOM
        this.button = this.shadowRoot.querySelector("button");
        this.name = this.shadowRoot.querySelector("#name");
        this.gender = this.shadowRoot.querySelector("#gender");
        this.race = this.shadowRoot.querySelector("#race");
        this.description = this.shadowRoot.querySelector("#description");
        this.likes = this.shadowRoot.querySelector("#likes");
    }

    connectedCallback(){
        // If the favorite button is clicked, add it to favorites in local storage
        this.button.onclick = () => {
            utils.addFavorite(this, "character");
            this.button.innerHTML = "Favorited";
            this.button.className = "button is-warning";
            this.button.disabled = true;

            utils.increaseFavorite(this,'character');

            if (this.dataset.likes != null)
            {
                this.dataset.likes = parseInt(this.dataset.likes) + 1;
                this.render();
            }

            this.render();
        }

        if (utils.checkIfFavorited(this.dataset.name)){
            this.button.value = "Favorited";
            this.button.disabled = true;
            this.button.innerHTML = "Favorited";
        }

        if (this.button.value == "Favorited")
        {
            this.button.className = "button is-warning";
        }
        else{
            this.button.className = "button is-success";
        }
        this.render();
    }

    disconnectedCallback(){
        this.button.onclick = null;
    }

    attributeChangedCallback(attributeName, oldVal, newVal){
        // Whenever the attribute is changed, render the window again
        //console.log(attributeName, oldVal, newVal);
        this.render();
    }

    static get observedAttributes(){
        // Observe for changes in the following
        return ["data-name","data-gender","data-race","data-description","data-likes"];
    }

    render(){
        // grab the attribute values, and assign a default value if necessary
        const name = this.getAttribute('data-name') ? this.getAttribute('data-name') : "<i>...game name...</i>";
        const gender = this.getAttribute('data-gender') ? this.getAttribute('data-gender') : "<i>...gender...</i>";
        const race = this.getAttribute('data-race') ? this.getAttribute('data-race') : "<i>...race...</i>";
        const description = this.getAttribute('data-description') ? this.getAttribute('data-description') : "<i>...description...</i>";
        const likes = this.getAttribute('data-likes') ? this.getAttribute('data-likes') : "";

        // Sets the values in the Shadow DOM
        this.name.innerHTML = `${name}`;
        this.gender.innerHTML = `Gender: ${gender}`;
        this.race.innerHTML = `Race: ${race}`;
        this.description.innerHTML = `${description}`;

        //Only display if likes are specified in the card's creation
        if (likes != "")
        {
            this.likes.innerHTML = `Likes: ${likes}`;
        }
    }

} // end of class

customElements.define('character-card', CharacterCard)
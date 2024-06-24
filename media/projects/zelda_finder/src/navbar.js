const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<nav class="navbar has-shadow is-white">
        <div class="navbar-brand">
          <a class="navbar-item" href="home.html">
            <img src="images/triforce.png">
          </a>
          <a class="navbar-burger" id="burger">
            <span></span>
            <span></span>
            <span></span>
          </a>
        </div>
    
        <div class="navbar-menu" id="nav-links">
          <div class="navbar-start">
            <a class="navbar-item" href="home.html" id="home">
              Home
            </a>
          
            <a class="navbar-item is-hoverable" href="app.html" id="app">
              App
            </a>
          
            <a class="navbar-item is-hoverable" href="favorites.html" id="favorites">
              Favorites
            </a>

            <a class="navbar-item is-hoverable" href="community.html" id="community">
              Community
            </a>
          
            <a class="navbar-item is-hoverable" href="documentation.html" id="documentation">
              Documentation
            </a>
          </div> <!-- end navbar-start -->
        </div>
      </nav>
`;

class NavigationBar extends HTMLElement{
    constructor(){
    super();
        // 1 - attach a shadow DOM tree to this instance - this creates `.shadowRoot` for us
        this.attachShadow({mode: "open"});

        // 2 - Clone `template` and append it
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.burgerIcon = this.shadowRoot.querySelector("#burger");
        this.navbarMenu = this.shadowRoot.querySelector("#nav-links");

        this.burgerIcon.addEventListener('click', () => {
            this.navbarMenu.classList.toggle('is-active');
        })
    }

    // 3 - called when the component is added to the page
    connectedCallback(){
        this.render();

        
    }

    static get observedAttributes(){
        return ["data-page"];
    }

    // 4 - a helper method to display the values of the attributes
    render(){
        // Set up bold highlights based on the selected page
        const link = this.dataset.page ? this.dataset.page : "";
        this.shadowRoot.querySelector(`#${link}`).classList += " has-text-weight-bold";
    }
} 
    
customElements.define('navigation-bar', NavigationBar);
const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<nav class="navbar has-background-grey is-size-3">
  <div class="navbar-brand">
    <a class="navbar-burger" id="burger">
      <span></span>
      <span></span>
      <span></span>
    </a>
  </div>

  <div class="navbar-menu" id="nav-links">
    <div class="navbar-start">
      <a class="navbar-item has-text-white" href="home.html" id="home">
        Home
      </a>
    
      <a class="navbar-item is-hoverable has-text-white" href="interactive-art.html" id="interactive-art">
        Interactive Art
      </a>
    
      <a class="navbar-item is-hoverable has-text-white" href="ins-and-outs.html" id="ins-and-outs">
        Ins and Outs
      </a>

      <a class="navbar-item is-hoverable has-text-white" href="blink-project.html" id="blink-project">
        Blink
      </a>

      <a class="navbar-item is-hoverable has-text-white" href="sliding-objects.html" id="sliding-objects-project">
        Sliding Objects
      </a>

      <a class="navbar-item is-hoverable has-text-white" href="game-challenge.html" id="game-challenge">
        Game Challenge
      </a>

      <a class="navbar-item is-hoverable has-text-white" href="voice-attack.html" id="voice-attack">
        Voice Attack
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
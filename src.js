let navi;
let display;

let pages;

let buttonColumns = [];

function displayPage(page) {
    display.innerHTML = null;
    display.innerHTML += page.Title + `<div id="content">` + page.Image + page.Description + `</div>`;
}

function aboutMeClicked() {
    let display = document.getElementById("display");
    display.innerHTML = null;
    display.innerHTML += `<h2>About Me</h2>` + `<div id="content">` + `<img src=\"media/Images/me.jpg\" alt=\"Me\">` + 
    `<p>I am a programmer who loves everything about the video game creation process. I love the music, mechanics, art, and story of games. To me, being passionate is the most important part about developing games. I believe that a game developer must be open-minded and passionate about everything they do. As such, I've built my experience in game development by working on a plethora of genres. I'd describe myself as organized, goal-oriented, and self-critical. <br><br> In my personal life, I absolutely adore difficult games, loving to challenge myself. Fighting games are an exceptional example of my love for challenge, as I am an avid fan of them. RPGs are a close second, giving me the opportunity to express my strategy or visions and watch them play out. Besides video games as a passion, I love to cook and self-teach myself by making my own dishes. My proudest food is my steak and onions, which I put an eastern twist to.</p>` + `</div>`;
    clearColumns();
}

function clearColumns(){
    for(let i = 0; i < buttonColumns.length; i++){
        buttonColumns[i].style.display = 'none';
    }
}

function toggleButtons(section){
    section.style.display = section.style.display === 'none' ? '' : clearColumns();
}

window.onload = async () => {
    navi = document.getElementById("navi");
    display = document.getElementById("display");

    document.getElementById("aboutMeButton").onclick = function() {aboutMeClicked()};
    aboutMeClicked();

    await fetch("pages.json").then((response) => response.json()).then((data) => {
        pages = data;
        for (const section in data){
            let segment = document.createElement('div');
            segment.setAttribute("class", "segment");

            let buttonColumn = document.createElement('div');
            buttonColumn.setAttribute("class", "buttonColumn");
            buttonColumn.style.display = 'none';

            buttonColumns.push(buttonColumn);

            let sectionButton = document.createElement('button');
            sectionButton.innerHTML = section;
            sectionButton.setAttribute("class", "sectionButton");
            sectionButton.onclick = function(){toggleButtons(buttonColumn);}

            segment.appendChild(sectionButton);

            for (const page in data[section]){
                let newButton = document.createElement('button');
                newButton.innerHTML = page;
                newButton.onclick = function(){
                    displayPage(data[section][page]);
                    toggleButtons(buttonColumn);
                }
                newButton.setAttribute("class", "pageButton");
                buttonColumn.appendChild(newButton);
            }
            
            segment.appendChild(buttonColumn);
            navi.appendChild(segment);
        }

        //Make button for physical computing blog
        navi.innerHTML += `<a href=\"./media/projects/physical_computing_blog/home.html\" target=\"_blank\"><button>Arduino Blog</button></a>`;
    });
}
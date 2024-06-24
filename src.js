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
    `<p>I am a programmer who loves everything about the video game creation process. I love the music, mechanics, art, and story of games. To me, being passionate is the most important part about developing games. When working with others, I have learned that developing a strong relationship among group members allows for this passion to grow. Therefore, I believe that a game designer must be open-minded and passionate about everything they do. I have experience designing and developing multiple different genres of games. During my time at RIT, my coding experience and my experience working with game engines and frameworks have been refined. I am someone who is organized, goal-oriented, and self-critical. Additionally, I am an effective problem solver who applies his math skills to facets such as game balance. My favorite types of games are competetive games. I love fighting games, MOBAs, and RPGs. Having the ability to express myself in games is one of my driving forces for playing games.</p>` + `</div>`;
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
    });
}
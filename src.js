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
    display.innerHTML += `<h2>About Me</h2>` + `<div id="content">` + `<img src=\"media/images/me.jpg\" alt=\"Me\">` + `<p>Passions are what drive us in every aspect of our lives. And what makes me passionate, is building things. I've always had a fascination with bringing my thoughts and dreams to life — whether it be in creative video games, a science project, or a collection of random doodads. That very passion led me to pursue an education at the Rochester Institute of Technology, where I earned my Bachelor of Science in Game Design and Development. I had learned strong programming fundamentals in several fields — from simulation, to graphics, to web technology. <br><br>Following my education, I decided to continue building my skills in Full Stack Software Development, eventually earning two esteemed certifications from IBM and AWS. Now, with a seasoned skillset and a realized dream, I seek to make a name for myself in the wide world of creation. <br><br>Outside my self-development, I love to cook, corrupt video games, and perform amateur voice acting.</p>`+ `</div>`;
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
        let blogAnchor = document.createElement('a');
        blogAnchor.setAttribute("href", "https://joshiqui.github.io/arduino-blog/");
        blogAnchor.setAttribute("target", "blank");
        let blogButton = document.createElement('button');
        blogButton.innerHTML = "Arduino Blog";
        blogAnchor.appendChild(blogButton);
        navi.appendChild(blogAnchor);
    });
}
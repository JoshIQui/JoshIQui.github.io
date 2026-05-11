let pages = {};
let currentCategory = 'About Me';

const display = document.getElementById('display');
const navi = document.getElementById('navi');

async function init() {
    try {
        const response = await fetch('pages.json');
        pages = await response.json();
        renderSidebar();
        displayAboutMe();
    } catch (error) {
        console.error('Error loading pages.json:', error);
    }
}

function renderSidebar() {
    const aboutBtn = document.getElementById('aboutMeButton');
    aboutBtn.onclick = () => {
        setActiveNav(aboutBtn);
        displayAboutMe();
    };

    for (const category in pages) {
        const btn = document.createElement('button');
        btn.className = 'nav-button';
        btn.textContent = category;
        btn.onclick = () => {
            setActiveNav(btn);
            displayCategory(category);
        };
        navi.appendChild(btn);
    }
}

function setActiveNav(activeBtn) {
    document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

function displayAboutMe() {
    display.innerHTML = `
        <section class="about-section">
            <div class="about-text">
                <h2>About Me</h2>
                <p>Passions are what drive us in every aspect of our lives. And what makes me passionate, is building things. I've always had a fascination with bringing my thoughts and dreams to life — whether it be in creative video games, a science project, or a collection of random doodads.</p>
                <p>That very passion led me to pursue an education at the Rochester Institute of Technology, where I earned my Bachelor of Science in Game Design and Development. I had learned strong programming fundamentals in several fields — from simulation, to graphics, to web technology.</p>
                <p>Following my education, I decided to continue building my skills in Full Stack Software Development, eventually earning two esteemed certifications from IBM and AWS. Now, with a seasoned skillset and a realized dream, I seek to make a name for myself in the wide world of creation.</p>
                <p>Outside my self-development, I love to cook, corrupt video games, and perform amateur voice acting.</p>
            </div>
            <div class="about-image">
                <img src="media/images/me.jpg" alt="Joshua Quinones">
            </div>
        </section>
    `;
    window.scrollTo(0, 0);
}

function displayCategory(categoryName) {
    currentCategory = categoryName;
    const categoryData = pages[categoryName];
    
    let html = `<h2>${categoryName}</h2>`;
    html += `<div class="card-grid">`;
    
    for (const itemName in categoryData) {
        const item = categoryData[itemName];
        const imgSrc = extractSrc(item.Image);
        const preview = stripHtml(item.Description).substring(0, 120) + '...';
        
        html += `
            <div class="card" onclick="displayItem('${categoryName}', '${itemName}')">
                <div class="card-image">
                    ${imgSrc ? `<img src="${imgSrc}" alt="${itemName}">` : '<div class="no-image">No Preview Available</div>'}
                </div>
                <div class="card-content">
                    <h3 class="card-title">${itemName}</h3>
                    <p class="card-preview">${preview}</p>
                </div>
            </div>
        `;
    }
    
    html += `</div>`;
    display.innerHTML = html;
    window.scrollTo(0, 0);
}

function displayItem(categoryName, itemName) {
    const item = pages[categoryName][itemName];
    
    display.innerHTML = `
        <div class="detail-view">
            <div class="detail-header">
                <button class="back-button" onclick="displayCategory('${categoryName}')">← Back to ${categoryName}</button>
            </div>
            <div class="detail-content">
                <div class="media-container">
                    ${item.Image}
                </div>
                <div class="description-container">
                    ${item.Title}
                    <div class="description-text">
                        ${item.Description}
                    </div>
                </div>
            </div>
        </div>
    `;
    window.scrollTo(0, 0);
}

// Helpers
function extractSrc(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    const img = div.querySelector('img');
    if (img) return img.src;
    
    // Check for iframe (videos)
    const iframe = div.querySelector('iframe');
    if (iframe) {
        // For video placeholders, maybe use a generic video icon or try to get YT thumbnail
        // For now, let's just return null and the CSS will handle it
        return null;
    }
    return null;
}

function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
}

window.onload = init;
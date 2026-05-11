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
        display.innerHTML = `<h2>Error</h2><p>Could not load portfolio data. Please check pages.json for errors.</p>`;
    }
}

function renderSidebar() {
    const aboutBtn = document.getElementById('aboutMeButton');
    if (aboutBtn) {
        aboutBtn.onclick = () => {
            setActiveNav(aboutBtn);
            displayAboutMe();
        };
    }

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
                <p>I am a Certified Full Stack Software Developer with a background in Game Design and Development from RIT. My expertise spans building scalable cloud architectures on AWS, developing responsive web applications with React and Node.js, and low-level graphics programming with C++ and DirectX.</p>
                <p>I am passionate about creating robust software solutions that solve real-world problems. My experience includes developing high-performance 3D systems and architecting serverless hosting platforms.</p>
                <div class="btn-group">
                    <a href="media/pdfs/Joshua_Quinones_Resume.pdf" target="_blank" class="btn-primary">Download Resume</a>
                    <a href="https://github.com/JoshIQui" target="_blank" class="btn-secondary">View GitHub</a>
                </div>
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
    
    if (categoryName.toLowerCase().includes('experience')) {
        html += `<div class="experience-list">`;
        for (const itemName in categoryData) {
            html += renderExperienceItem(itemName, categoryData[itemName]);
        }
        html += `</div>`;
    } else {
        html += `<div class="card-grid">`;
        for (const itemName in categoryData) {
            html += renderProjectCard(itemName, categoryData[itemName], categoryName);
        }
        html += `</div>`;
    }
    
    display.innerHTML = html;
    window.scrollTo(0, 0);
}

function renderProjectCard(itemName, item, categoryName) {
    const imgSrc = item.image || extractSrc(item.Image);
    const tags = item.tags ? item.tags.map(t => `<span class="tag">${t}</span>`).join('') : '';
    const subtitle = item.subtitle || '';
    
    // Support for both old and new schema
    const rawDescription = item.Description || item.description || '';
    const previewText = item.preview || stripHtml(rawDescription).substring(0, 100) + '...';
    
    return `
        <div class="card" onclick="displayItem('${categoryName}', '${itemName}')">
            <div class="card-image">
                ${imgSrc ? `<img src="${imgSrc}" alt="${itemName}">` : `<div class="no-image"><span>${itemName}</span></div>`}
            </div>
            <div class="card-content">
                <h3 class="card-title">${item.title || itemName}</h3>
                ${subtitle ? `<p class="card-subtitle" style="font-size: 0.8rem; color: var(--accent); font-weight: 600; margin-top: -0.5rem; margin-bottom: 0.5rem;">${subtitle}</p>` : ''}
                <div class="tag-container">${tags}</div>
                <p class="card-preview">${previewText}</p>
            </div>
        </div>
    `;
}

function renderExperienceItem(itemName, item) {
    const rawDescription = item.Description || item.description || '';
    const highlights = item.highlights ? 
        item.highlights.map(h => `<li>${h}</li>`).join('') : 
        `<li>${stripHtml(rawDescription)}</li>`;
    
    return `
        <div class="experience-item">
            <div class="exp-header">
                <div class="exp-title-group">
                    <h3>${item.role || itemName}</h3>
                    <div class="exp-company">${item.company || ''}</div>
                </div>
                <div class="exp-date">${item.date || ''}</div>
            </div>
            <ul class="exp-highlights">
                ${highlights}
            </ul>
        </div>
    `;
}

function displayItem(categoryName, itemName) {
    const item = pages[categoryName][itemName];
    const tags = item.tags ? item.tags.map(t => `<span class="tag">${t}</span>`).join('') : '';
    
    display.innerHTML = `
        <div class="detail-view">
            <div class="detail-header">
                <button class="back-button" onclick="displayCategory('${categoryName}')">← Back to ${categoryName}</button>
            </div>
            <div class="detail-content">
                <div class="media-container">
                    ${item.Image || (item.image ? `<img src="${item.image}">` : '')}
                </div>
                <div class="description-container">
                    <h2>${item.title || itemName}</h2>
                    ${item.subtitle ? `<p style="color: var(--accent); font-weight: 600; margin-top: -1.5rem; margin-bottom: 1.5rem;">${item.subtitle}</p>` : ''}
                    <div class="tag-container">${tags}</div>
                    <div class="description-text">
                        ${item.Description || item.description || ''}
                    </div>
                    ${item.highlights ? `
                        <ul class="exp-highlights" style="margin-top: 1.5rem;">
                            ${item.highlights.map(h => `<li>${h}</li>`).join('')}
                        </ul>
                    ` : ''}
                    <div class="btn-group">
                        ${item.links ? Object.entries(item.links).map(([label, url]) => `<a href="${url}" target="_blank" class="btn-primary">${label}</a>`).join('') : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
    window.scrollTo(0, 0);
}

// Helpers
function extractSrc(htmlString) {
    if (!htmlString) return null;
    const div = document.createElement('div');
    div.innerHTML = htmlString;
    const img = div.querySelector('img');
    if (img) return img.src;
    return null;
}

function stripHtml(html) {
    if (!html) return "";
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
}

window.onload = init;
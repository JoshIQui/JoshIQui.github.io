export async function loadData(url) {
    let response = await fetch(url);

    let json = await response.json();

    return json.data;
}

const defaultData = {
    "favorites": [],
    "app-state": {
        "select": "games",
        "input": "",
        "output": ""
    }
};
const storeName = "jiq4449-p1-settings";

const readLocalStorage = () => {
    let allValues = null;

    try{
      allValues = JSON.parse(localStorage.getItem(storeName)) || defaultData;
    }catch(err){
      console.log(`Problem with JSON.parse() and ${storeName} !`);
      throw err;
    }
  
    //console.log(allValues);

    return allValues;
};
  
const writeLocalStorage = (allValues) => {
    localStorage.setItem(storeName, JSON.stringify(allValues));
};

export const clearLocalStorage = () => {
    writeLocalStorage(defaultData);
};

export const addFavorite = (card, cardType) => {
    const allValues = readLocalStorage();

    let data;
    switch(cardType)
    {
        case "game":
            data = {
                "type": "game",
                "name": card.dataset.name,
                "developer": card.dataset.developer,
                "release": card.dataset.released_date,
                "description": card.dataset.description
            };
            //console.log(allValues);
            break;
        case "character":
            data = {
                "type": "character",
                "name": card.dataset.name,
                "gender": card.dataset.gender,
                "race": card.dataset.race,
                "description": card.dataset.description
            };
            //console.log(allValues);
            break;
        case "monster":
            data = {
                "type": "monster",
                "name": card.dataset.name,
                "description": card.dataset.description
            };
            //console.log(allValues);
            break;
        case "boss":
            data = {
                "type": "boss",
                "name": card.dataset.name,
                "description": card.dataset.description
            };
            //console.log(allValues);
            break;
        case "dungeon":
            data = {
                "type": "dungeon",
                "name": card.dataset.name,
                "description": card.dataset.description
            };
            //console.log(allValues);
            break;
        case "place":
            data = {
                "type": "place",
                "name": card.dataset.name,
                "description": card.dataset.description
            };
            //console.log(allValues);
            break;
        case "item":
            data = {
                "type": "item",
                "name": card.dataset.name,
                "description": card.dataset.description
            };
            //console.log(allValues);
            break;
    }
    
    allValues.favorites.push(data);
    writeLocalStorage(allValues);
};

export const saveAppState = (select, input, output) => {
    let allValues = readLocalStorage();

    let appState = allValues['app-state'];

    appState.select = select;
    appState.input = input;
    appState.output = output;

    writeLocalStorage(allValues);
};

export const loadAppData = () => {
    return readLocalStorage()['app-state'];
};

export const getFavorites = () => readLocalStorage().favorites

export const clearFavorites = () => {
    const allValues = readLocalStorage();

    allValues.favorites = [];
    writeLocalStorage(allValues);
};

export const clearAppData = () => {
    const allValues = readLocalStorage();

    allValues['app-state'] = defaultData["app-state"];
    writeLocalStorage(allValues);
};

export const checkIfFavorited = (cardName) => {
    const favorites = readLocalStorage().favorites;

    for(const favorite of favorites)
    {
        if (favorite.name == cardName)
        {
            return true;
        }
    }

    return false;
};

//-------------
// FIREBASE
//-------------
//
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-app.js";
import { getDatabase, ref, set, push, onValue, increment, remove } from  "https://www.gstatic.com/firebasejs/9.6.8/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDQsKmct_SWdK5piPoshY4B7DcljHNDwc8",
    authDomain: "zelda-finder-favorites.firebaseapp.com",
    databaseURL: "https://zelda-finder-favorites-default-rtdb.firebaseio.com",
    projectId: "zelda-finder-favorites",
    storageBucket: "zelda-finder-favorites.appspot.com",
    messagingSenderId: "522354735103",
    appId: "1:522354735103:web:9bfefdc8361bb5b18e19ca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//console.log(app); // make sure firebase is loaded

const db = getDatabase();

export const favoritesReference = ref(db, 'favorites/');

//let communityFavorites = [];

export const increaseFavorite = (card,type) => {
    //Set up basic values
    const name = card.dataset.name;
    const description = card.dataset.description;

    //Create a reference to the favorites list
    const favRef = ref(db, 'favorites/' + name);

    //Check and change the data if the object is a game or character
    if (type === 'game')
    {
        //Set up extra variables in data for a game
        const developer = card.dataset.developer;
        const release = card.dataset.released_date;
        set(favRef, {
            type,
            name,
            description,
            developer,
            release,
            likes: increment(1)
        });
    }
    else if (type === 'character')
    {
        //Set up extra variables in data for a character
        const gender = card.dataset.gender;
        const race = card.dataset.race;
        set(favRef, {
            type,
            name,
            description,
            gender,
            race,
            likes: increment(1)
        });
    }
    else
    {
        //Default case
        set(favRef, {
            type,
            name,
            description,
            likes: increment(1)
        });
    }
};

export const decreaseFavorite = card => {
    //Set up basic values
    const type = card.type; //Type is defined inside of this function instead of as a parameter
    const name = card.name;
    const description = card.description;

    //Create a reference to the favorites list
    const favRef = ref(db, 'favorites/' + name);

    //Check and change the data if the object is a game or character
    if (type === 'game')
    {
        //console.log(card);
        //Set up extra variables in data for a game
        const developer = card.developer;
        const release = card.release;
        set(favRef, {
            type,
            name,
            description,
            developer,
            release,
            likes: increment(-1)
        });
    }
    else if (type === 'character')
    {
        //Set up extra variables in data for a character
        const gender = card.gender;
        const race = card.race;
        set(favRef, {
            type,
            name,
            description,
            gender,
            race,
            likes: increment(-1)
        });
    }
    else
    {
        //Default case
        set(favRef, {
            type,
            name,
            description,
            likes: increment(-1)
        });
    }
};
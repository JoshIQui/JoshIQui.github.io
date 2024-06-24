"use strict";
window.onload = init;

$( function() {
    $( "#datepicker" ).datepicker({
        showButtonPanel: true,
        showAnim: "fold"
    });
} );

function init(){
    document.querySelector("#search").onclick = getData;

    //Store Information setup
    //Elements
    const searchTerm = document.querySelector("#searchterm");
    const searchType = document.querySelector("#searchtype");
    const searchDate = document.querySelector("#datepicker");
    const searchStore = document.querySelector("#searchstore");

    //Necessary prefix
    const prefix = "jiq4449";

    //Keys
    const termKey = prefix + "term";
    const typeKey = prefix + "type";
    const dateKey = prefix + "date";
    const storeKey = prefix + "store";

    //Stored information
    const storedTerm = localStorage.getItem(termKey);
    const storedType = localStorage.getItem(typeKey);
    const storedDate = localStorage.getItem(dateKey);
    const storedStore = localStorage.getItem(storeKey);

    //Stored information loading
    if (storedTerm){
        searchTerm.value = storedTerm;
    }

    if (storedType){
        searchType.value = storedType;
    }

    if (storedDate){
        searchDate.value = storedDate;
    }

    if (storedStore){
        searchStore.value = storedStore;
    }

    //Changes the stored information if necessary
    searchTerm.onchange = e=>{localStorage.setItem(termKey, e.target.value); };
    searchType.onchange = e=>{localStorage.setItem(typeKey, e.target.value); };
    searchDate.onchange = e=>{localStorage.setItem(dateKey, e.target.value); };
    searchStore.onchange = e=>{localStorage.setItem(storeKey, e.target.value); };
}

function getData(){
    // 1 - main entry point to web service
    const SERVICE_URL = "https://www.amiiboapi.com/api/amiibo/?";
    
    // No API Key required!
    
    // 2 - build up our URL string
    // not necessary for this service endpoint
    let url = SERVICE_URL;

    // 3 - add the search type to the url
    let type = document.querySelector("#searchtype").value;
    url += type + "=";
    
    // 3 - parse the user entered term we wish to search
    // not necessary for this service endpoint
    let term = document.querySelector("#searchterm").value.trim();
    term = encodeURIComponent(term);
    url+=term;
    
    // 4 - update the UI
    //document.querySelector("#debug").innerHTML = `<b>Querying web service with:</b> <a href="${url}" target="_blank">${url}</a>`;

    document.querySelector("#status").innerHTML = "Searching. Please Wait!";
    
    // 5 - create a new XHR object
    let xhr = new XMLHttpRequest();

    

    // 6 - set the onload handler
    xhr.onload = dataLoaded;

    // 7 - set the onerror handler
    xhr.onerror = dataError;

    // 8 - open connection and send the request
    xhr.open("GET",url);
    xhr.send();
}

function dataError(e){
    console.log("An error occurred");
}

function dataLoaded(e){
    // 1 - e.target is the xhr object
    let xhr = e.target;

    // 2 - xhr.responseText is the JSON file we just downloaded
    console.log(xhr.responseText);

    // 3 - turn the text into a parsable JavaScript object
    let obj = JSON.parse(xhr.responseText);

    // 4 - create a few constant urls for
    const amazonURL = "https://www.amazon.com/s?k=";
    const gamestopURL = "https://www.gamestop.com/search/?q=";
    const walmartURL = "https://www.walmart.com/search/?query=";
    
    // 5 - if there is an array of results, loop through them
    let results = obj.amiibo;
    let bigString = "";

    try{
        // 6 determine the url for the proper site
        let siteURL = "";
        switch (document.querySelector("#searchstore").value){
            case "amazon":
                siteURL = amazonURL;
                break;
            case "gamestop":
                siteURL = gamestopURL;
                break;
            case "walmart":
                siteURL = walmartURL;
                break;
        }

        //Filter by date if a date is specified
        if (document.querySelector("#datepicker").value != ""){
            let date = document.querySelector("#datepicker").value.split("/");

            //First checks if the date is valid
            if (date.length == 3 && date[0] <= 12 && date[0] >= 1 && date[1] >= 1 && date[1] <= 31){
                // 7 - display final results to user
                for (let i = 0; i < results.length; i++){
                    let amiiboDate = results[i].release.na.split('-');

                    //Compare years
                    if (date[2] <= amiiboDate[0]){
                        //Compare months
                        if(date[0] <= amiiboDate[1] || date[2] < amiiboDate[0]){
                            //Compare days
                            if (date[1] <= amiiboDate[2] || date[0] < amiiboDate[1] || date[2] < amiiboDate[0]){
                                bigString += `<div class='result'><span><p>${results[i].character}<p>Released: ${results[i].release.na}</p>`;
                                bigString += `<p>Game Series: ${results[i].gameSeries}</p><p>Amiibo Series: ${results[i].amiiboSeries}</p>`
                                bigString += `<a target='_blank' href='${siteURL + results[i].amiiboSeries + " " + results[i].character + " amiibo"}'>Purchase</a></p></span>`;
                                bigString += `<img src="${results[i].image}" title="${results[i].character}" /></div>`;

                                document.querySelector("#content").innerHTML = bigString;
                            }
                        }
                    }
                }
            }
        }else{
            // 7 - display final results to user
            for (let i = 0; i < results.length; i++){
                bigString += `<div class='result'><span><p>${results[i].character}<p>Released: ${results[i].release.na}</p>`;
                bigString += `<p>Game Series: ${results[i].gameSeries}</p><p>Amiibo Series: ${results[i].amiiboSeries}</p>`
                bigString += `<a target='_blank' href='${siteURL + results[i].amiiboSeries + " " + results[i].character + " amiibo"}'>Purchase</a></p></span>`;
                bigString += `<img src="${results[i].image}" title="${results[i].character}" /></div>`;

                document.querySelector("#content").innerHTML = bigString;
            }
        }

        if (bigString == ""){
            document.querySelector("#content").innerHTML = "<p>No Results</p>";
        }
    }catch{
        document.querySelector("#content").innerHTML = "<p>No Results</p>";
    }

    document.querySelector("#status").innerHTML = "Search Complete!";
}
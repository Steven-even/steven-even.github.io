//weather API global variables
const weatherUrl = 'https://weatherapi-com.p.rapidapi.com/forecast.json?days=3&q=';
const weatherOptions = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '3be5c42222msh87ba54a21a304e3p13f5f9jsn13227e04e32e',
        'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com',
        'Content-Type': 'application/json'
    }
};



//prepareing variables
let scrollingBox;
let offsetLeftStart;
let scrollLeftStart;
let isMoving;

//function to get remote JSon data
async function getData(url, options) {
    try {
        const response = await fetch(url, options);
        if (response.ok) {
            const result = await response.json();
            return result;
        } else {
            throw (response.status);
        }
    } catch (error) {
        console.error(error);
    }
}
// Code to update the weather display based on past object
function updateWeather(weatherObject) {

    //outputting whole weather object to console
    console.log(weatherObject);
    document.querySelector(".temp span").innerHTML = weatherObject.current.temp_f;
    document.querySelector(".cond").innerHTML = weatherObject.current.condition.text;
    document.querySelector(".humidity span").innerHTML = weatherObject.current.humidity;

    //update wind speed and direction
    let windspeed = weatherObject.current.wind_mph;
    let winddirection = weatherObject.current.wind_dir;
    document.querySelector(".current-wind").innerHTML = windspeed + " mph " + winddirection;

    // loops to update day temps
    let futureDays = document.querySelectorAll(".forecast-day");
    for (let i = 0; i < futureDays.length; i++) {
        if (!weatherObject.forecast.forecastday[i]) break;

        futureDays[i].querySelector(".day-temp span").innerHTML = weatherObject.forecast.forecastday[i].day.maxtemp_f;

        let windspeed = weatherObject.forecast.forecastday[i].day.maxwind_mph;
        futureDays[i].querySelector(".wind-speed").innerHTML = windspeed + " mph";

        futureDays[i].querySelector(".status").innerHTML = weatherObject.forecast.forecastday[i].day.condition.text;

    }

}

// JavaScript to enable drag scrolling

document.addEventListener("DOMContentLoaded", function () {
    scrollingBox = document.querySelector(".side-by-side");
    isMoving = false;

    scrollingBox.addEventListener("mousedown", function (e) {
        scrollLeftStart = scrollingBox.scrollLeft;
        offsetLeftStart = e.pageX - scrollingBox.offsetLeft;
        isMoving = true;
    });

    scrollingBox.addEventListener("mouseleave", function (e) {
        isMoving = false;
    });

    scrollingBox.addEventListener("mouseup", function (e) {
        isMoving = false;
    });

    scrollingBox.addEventListener("mousemove", function (e) {
        e.preventDefault();
        if (!isMoving) return;
        scrollingBox.scrollLeft = scrollLeftStart - (e.pageX - scrollingBox.offsetLeft - offsetLeftStart);
    });

    //ip Lookup data
    let ipLookupUrl = "https://api.ipify.org/?format=json";
    let ipLookupOptions = {};
    //use Ajax to fetch  Ip in Json format
    getData(ipLookupUrl, ipLookupOptions).then(function (result) {
    //add ip number to weather Url for lookup
        let weatherLookupUrl = weatherUrl + result.ip;


        getData(weatherLookupUrl, weatherOptions).then(function (weatherResult) {
            console.log(weatherResult);
            updateWeather(weatherResult);
        });
    });


    //make Location button activate modal pop-up
    document.querySelector("#findLocation").addEventListener("click", function () {
        document.body.classList.toggle("show-modal");
    });

    document.querySelector("#locationform").addEventListener("submit", function (event) {

        // stop form from submitting to server
        event.preventDefault();


        document.body.classList.toggle("show-modal");
        let newLocation = documentquerySelector("#locationBox").value;

        //add passed value number to weather Url for lookup
        let weatherLookupUrl = weatherUrl + newLocation;


        getData(weatherLookupUrl, weatherOptions).then(function (weatherResult) {
            console.log(weatherResult);
            updateWeather(weatherResult);
        });
    });

});

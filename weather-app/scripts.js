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
    console.log(weatherObject);
    document.querySelector(".temp span").innerHTML = weatherObject.current.temp_f;
    documenr.querySelector(".cond").innerHTML = weatherObject.current.condition.text;
    document.querySelector(".temp span").innerHTML = weatherObject.current.humidity;

    document.querySelector(".temp span").innerHTML = weatherObject.current.humidity;

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

    let sampleUrl = "https://tordevries.github.io/477/examples/ajax-api-test/current-forecast.js";
    let sampleOptions = {};

//get sample data 
    getData(sampleUrl, sampleOptions).then(function (result) {
        //code to handle result JSON object
        updateWeather(result);
    });
});

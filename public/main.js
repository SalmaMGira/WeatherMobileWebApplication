const api = {
    key: "99e10ab3d7acefa4cf1af1e9baa7ba96",
    baseurl: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

let prevLocation = "new york";
let currentcity = localStorage.getItem("currentcity");
if (currentcity === null) {
    currentcity = "new york";
}

window.addEventListener('online', function(e) {
    console.log('And we\'re back :).');
}, false);
            
window.addEventListener('offline', function(e) {
    console.log('Connection is down.');
    currentcity = localStorage.getItem("currentcity");
    if (currentcity === null) {
        currentcity = "new york";
    }
    displayOld(currentcity);
}, false);


window.addEventListener('load', function(e){
    if (navigator.onLine){
        console.log("online");
        getResults(prevLocation);
    }
    else {
        console.log("offline service");
        currentcity = localStorage.getItem("currentcity");
        if (currentcity === null) {
            currentcity = "new york";
        }
        displayOld(currentcity);
    }
});


function setQuery(evt) {
    if (evt.keyCode == 13) {
        prevLocation = searchbox.value;
        getResults(searchbox.value);
    }
}

function getResults(query) {
    localStorage.setItem(query, "saved");
        
    fetch(`${api.baseurl}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => {
        if (weather.ok) {
            return weather.json()
          } else {
            console.log(weather.statusCode)
            return Promise.reject('some error happend maybe 404')
          }      
        // return weather.json();
    }).then(displayResults)
    .catch(error => {
        console.log('error searching location');
        localStorage.removeItem(query);
        console.error(error);
    });
    
}

function displayResults(weather) {
    console.log(weather);

    let city = document.querySelector('.location .city');
    let weathercity = weather.name;
    weathercity = weathercity.toLowerCase();
    city.innerText = `${weather.name}, ${weather.sys.country}`;
    localStorage.setItem(`${weathercity}city`, weather.name);
    localStorage.setItem(`${weathercity}country`, weather.sys.country);

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now, weathercity);

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;
    localStorage.setItem(`${weathercity}temp`, Math.round(weather.main.temp));

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;
    localStorage.setItem(`${weathercity}status`, weather.weather[0].main);

    let hilow = document.querySelector('.high-low');
    hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
    localStorage.setItem(`${weathercity}min`, Math.round(weather.main.temp_min));
    localStorage.setItem(`${weathercity}max`, Math.round(weather.main.temp_max));

    localStorage.setItem("currentcity", weathercity);

}

function dateBuilder (d, weather) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  localStorage.setItem(`${weather}day`, day);
  localStorage.setItem(`${weather}date`, date);
  localStorage.setItem(`${weather}month`, month);
  localStorage.setItem(`${weather}year`, year);

  return `${day} ${date} ${month} ${year}`;
}

function displayOld(weather) {
    console.log(weather);

    let city = document.querySelector('.location .city');
    city.innerText = `${localStorage.getItem(`${weather}city`)}, ${localStorage.getItem(`${weather}country`)}`;
    console.log(weather);
    console.log(localStorage.getItem(`${weather}city`));
    console.log(`${localStorage.getItem(`${weather}city`)}, ${localStorage.getItem(`${weather}country`)}`);


    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = `${localStorage.getItem(`${weather}day`)} ${localStorage.getItem(`${weather}date`)} ${localStorage.getItem(`${weather}month`)} ${localStorage.getItem(`${weather}year`)}`;

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${parseInt(localStorage.getItem(`${weather}temp`))}<span>°c</span>`;

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = localStorage.getItem(`${weather}status`);

    let hilow = document.querySelector('.high-low');
    let min = localStorage.getItem(`${weather}min`);
    let max = localStorage.getItem(`${weather}max`);
    hilow.innerText = `${min}°c / ${max}°c`;
}


// making sure sw are supported
if ('serviceWorker' in navigator) {
    // register it when the window load
    // this will take a callback function, so make it es6 as it is in the second parameter to addEventListener
    window.addEventListener('load', () => {
        navigator.serviceWorker
        .register('sw_cached_site.js')
        // them make a promise back
        .then(reg => console.log('service worker is registered'))
        // then make catch if something goes wrong
        .catch(err => console.log(`service worker error: ${err}`));
    });
}
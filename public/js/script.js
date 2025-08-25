//=============permission==========
document.getElementById("enableNotifications").addEventListener("click", () => {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission().then(permission => {
      console.log("Notification permission:", permission);
    });
  }
});
if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission().then(permission => {
    console.log("Notification permission:", permission);
  });
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(showMap, handleError);
} else {
  alert("Cannot get location, not supported.");
}


function showMap(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  const map = L.map("weather-map").setView([lat, lon], 6);

  //==============openweather data======
  function fetchCurrentWeather(lat, lon) {
    fetch(`/api/weather?lat=${lat}&lon=${lon}`)
      .then(res => res.json())
      .then(data => {
        interpretWeather(data);
      })
      .catch(err => {
        console.error("Weather API error:", err);
        document.getElementById("weather-info").innerHTML = "Unable to load weather data.";
      });
  }

  fetchCurrentWeather(lat, lon);

  //===========refreshh
  setInterval(() => fetchCurrentWeather(lat, lon), 600000);


  //=============map only==
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  //===================map green==
  fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
    .then(res => res.json())
    .then(data => {
      L.geoJSON(data, { style: { color: '#00FF00', weight: 1, fillOpacity: 0 } }).addTo(map);
    });

  //====================rainviewer cloud only====
  let cloudLayer;
  let cloudFrames = [];
  let cloudIndex = 0;

  L.tileLayer(`https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
    attribution: "© OpenWeatherMap",
    opacity: 0.5
  }).addTo(map);


  //========================rainviewer layer
  fetch("https://api.rainviewer.com/public/weather-maps.json")
    .then(res => res.json())
    .then(data => {
      cloudFrames = data.radar.past.concat(data.radar.nowcast);
      playClouds();
    });

  function changeCloudFrame(i) {
    if (cloudLayer) map.removeLayer(cloudLayer);
    cloudLayer = L.tileLayer(
      `https://tilecache.rainviewer.com/v2/radar/${cloudFrames[i].path}/256/{z}/{x}/{y}/2/1_1.png`,
      { opacity: 0.6, attribution: "Clouds © RainViewer" }
    ).addTo(map);
  }

  function playClouds() {
    setInterval(() => {
      changeCloudFrame(cloudIndex);
      cloudIndex = (cloudIndex + 1) % cloudFrames.length;
    }, 500);
  }

  //=====================================================
  const precipitation = L.tileLayer(
    `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`,
    { opacity: 0.9 }
  ).addTo(map);

  const wind = L.tileLayer(
    `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`,
    { opacity: 0.6 }
  ).addTo(map);

  //===============from rainviewer data===
  let radarLayer;
  let frameIndex = 0;
  let frames = [];

  fetch("https://api.rainviewer.com/public/weather-maps.json")
    .then(res => res.json())
    .then(data => {
      frames = data.radar.past.concat(data.radar.nowcast);
      playRadar();
    });

  function changeRadarFrame(i) {
    if (radarLayer) map.removeLayer(radarLayer);
    radarLayer = L.tileLayer(
      `https://tilecache.rainviewer.com/v2/radar/${frames[i].path}/256/{z}/{x}/{y}/2/1_1.png`,
      { opacity: 0.9, attribution: "Weather data © RainViewer" }
    ).addTo(map);
  }

  function playRadar() {
    setInterval(() => {
      changeRadarFrame(frameIndex);
      frameIndex = (frameIndex + 1) % frames.length;
    }, 500);
  }


  L.marker([lat, lon]).addTo(map).bindPopup("You are here").openPopup();
}


function formatDateTime(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes().toString().padStart(2, "0");
  let ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12;

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${hours}:${minutes} ${ampm} ${month} ${day}, ${year}`;
}



let soundEnabled = false;

document.addEventListener("click", () => {
//   alert('Weather alerts enabled!');
  soundEnabled = true;
});

function showWeatherNotification(title, body, withSound = false) {
  if ("Notification" in window && Notification.permission === "granted") {
    const options = {
      body: body,
      silent: !withSound
    };
    new Notification(title, options);

    if (withSound && soundEnabled) {
      const audio = new Audio("/sounds/alert-33762.mp3");
      audio.play();
    }
  }
}





//=====================
const updateInterval = 600000;
let lastUpdateTime = null;

function getShortDescription(description) {
  if (description.includes("rain")) return "Possible rain. Take an umbrella with you!";
  if (description.includes("clear")) return "Great day to be outside!";
  if (description.includes("cloud")) return "Cloudy skies, but no worries!";
  if (description.includes("storm")) return "Stay safe indoors!";
  if (description.includes("hot")) return "Don't forget to rehydrate, it's hot!";
  return "Have a nice day!";
}


//=================================================
function interpretWeather(data) {
  const temp = data.main.temp;
  const feelsLike = data.main.feels_like;
  const description = (data.weather?.[0]?.description || "").toLowerCase();
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const clouds = data.clouds.all;
  const shortDesc = getShortDescription(description);

  let message = `<strong><i class="bi bi-thermometer-half"></i> Temp:</strong> ${temp}°C (Feels like ${feelsLike}°C)<br>`;
  message += `<strong><i class="bi bi-cloud"></i> Weather:</strong> ${description}<br>`;
  message += `<strong><i class="bi bi-droplet"></i> Humidity:</strong> ${humidity}%<br>`;
  message += `<strong><i class="bi bi-cloud-sun"></i> Cloud coverage:</strong> ${clouds}%<br>`;
  message += `<strong><i class="bi bi-wind"></i> Wind:</strong> ${windSpeed} m/s<br>`;
  message += `<em>Temp: ${temp}°C, ${description}. ${shortDesc}</em><br>`;

  //======================
  if (description.includes("rain") && clouds > 70) {
    message += `<i class="bi bi-umbrella-fill" style="color:#00BFFF;"></i> Possible heavy rain!<br>`;
  }
  if (windSpeed > 15) {
    message += `<i class="bi bi-wind" style="color:#FFA500;"></i> Strong winds!<br>`;
  }
  if (temp > 40) {
    message += `<i class="bi bi-thermometer-high" style="color:#FF4500;"></i> Extremely hot!<br>`;
  }
  if (temp < 5) {
    message += `<i class="bi bi-thermometer-low" style="color:#1E90FF;"></i> Extremely cold!<br>`;
  }

  const now = new Date();
  const formattedTime = formatDateTime(now);
  message += `<br><strong>Updated:</strong> ${formattedTime}<br>`;

  document.getElementById("weather-info").innerHTML = message;


  // ===== Notifications =====
  let hazard = false;
  let hazardText = "";

  if (description.includes("rain") && clouds > 70) {
    hazard = true;
    hazardText += "Heavy rain possible. ";
  }
  if (windSpeed > 15) {
    hazard = true;
    hazardText += "Strong winds. ";
  }
  if (temp > 40) {
    hazard = true;
    hazardText += "Extreme heat. ";
  }
  if (temp < 5) {
    hazard = true;
    hazardText += "Extreme cold. ";
  }


  if (hazard) {
    showWeatherNotification("Weather Alert!", hazardText, true);
  } else {
    showWeatherNotification("Current Weather", `Temp: ${temp}°C, ${description}. ${shortDesc}`, false);
  }

}


function handleError(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}
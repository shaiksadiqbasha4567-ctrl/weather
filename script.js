const search = document.querySelector("#search-in");
const searchBtn = document.querySelector("#searchbtn");
const mic = document.querySelector("#mic");
const cityname = document.querySelector(".city");
const temp = document.querySelector(".temp");
const wind = document.querySelector(".wind");
const humid = document.querySelector(".humidity");
const loader=document.querySelector("#loader");
const weatherIcon = document.querySelector(".weather-icon");
const weather = document.querySelector(".weather");
const details = document.querySelector(".details");
const SpeechRecoginition = window.SpeechRecgonition || window.webkitSpeechRecognition;
console.log(SpeechRecoginition);


if (SpeechRecoginition) {
  const recoginition = new SpeechRecoginition();
  recoginition.lang = "en-IN";
  recoginition.interimResults = false;
  mic.addEventListener("click", () => {
    recoginition.start();
  });

  recoginition.onresult = (event) => {
    const city = event.results[0][0].transcript;

    search.value = city;

    getWeather(city);
  };


  recoginition.onerror = (event) => {
    alert("Voice recoginition failed :" + event.error);
  };
} else {
  alert("Speech recoginition not supported in this browser");
}

searchBtn.addEventListener("click", async ()=>{
    code  = await getWeather(search.value);
    updateWeatherImage(code);
    
})

async function getWeather(cityName) {
  if(!cityName) return null;

  showLoader(true);

  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      showLoader(false);
      return null;
    }
    const { latitude, longitude, name, country } = geoData.results[0];
   
    
    const weather = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m,weather_code`);
    const weatherData = await weather.json();
     cityname.textContent = cityName;
    temp.textContent = weatherData.current.temperature_2m+"°C";
    wind.textContent = weatherData.current.wind_speed_10m+"km/h";
    humid.textContent = weatherData.current.relative_humidity_2m+"%";
    
    showLoader(false);
    return weatherData.current.weather_code;
  }
  catch (error) {
    console.error("Error fetching weather", error);
    showLoader(false);
    return null;
  }
}

function updateWeatherImage(code){
  if(code==0){
    weatherIcon.src = "clear.svg";
  }
  else if(code >=1&&code<=3){
    weatherIcon.src ="clouds.svg";
  }
  else if(code >=51&&code<=67){
    weatherIcon.src ="rain.svg";
  }
  else if(code >=95){
    weatherIcon.src ="thunderstorm.svg";
  }
  else{
    weatherIcon.src="atmosphere.svg"
  }
}

function showLoader(isloading){
  if(isloading){
    loader.classList.remove("hidden");
    weather.classList.add("hidden");
    details.classList.add("hidden");
  }
  else{
    loader.classList.add("hidden");
    weather.classList.remove("hidden");
    details.classList.remove("hidden");
    weather.classList.add("fade-in");
    details.classList.add("fade-in");
  }
}









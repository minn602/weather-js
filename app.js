//1. 웹 페이지가 로드되면 현재 위치 값 구하기
//2. 구한 위치 값으로 api 연결
//3. api에서 위치정보, 온도, 날씨코멘트, 아이콘 가져오기
//4. 아이콘 연결

"use strict";

const apiKey = API_KEY.apiKey;

let currentIcon;

function iconId(icon) {
  if (icon === "01d") {
    currentIcon = `CLEAR_DAY`;
  } else if (icon === "01n") {
    currentIcon = `CLEAR_NIGHT`;
  } else if (icon === "02d") {
    currentIcon = `PARTLY_CLOUDY_DAY`;
  } else if (icon === "02n") {
    currentIcon = `PARTLY_CLOUDY_NIGHT`;
  } else if (
    icon === "03d" ||
    icon === "03n" ||
    icon === "04d" ||
    icon === "04n"
  ) {
    currentIcon = `CLOUDY`;
  } else if (
    icon === "09d" ||
    icon === "09n" ||
    icon === "10d" ||
    icon === "10n"
  ) {
    currentIcon = `RAIN`;
  } else if (icon === "11d" || icon === "11n") {
    currentIcon = `WIND`;
  } else if (icon === "13d" || icon === "13n") {
    currentIcon = "SNOW";
  } else if (icon === "50d" || icon === "50n") {
    currentIcon = "FOG";
  }
}

function setIcon(icon, id) {
  const skycons = new Skycons({ color: "white" });
  iconId(icon);
  skycons.play();
  return skycons.set(id, Skycons[currentIcon]);
}

function paintApp(city, country, temp, des, icon) {
  const currentLocation = document.querySelector(".location"),
    currentTemp = document.querySelector(".temperature"),
    weatherDes = document.querySelector(".weather-des");
  currentLocation.innerText = `${city} / ${country}`;
  let temperature = (temp - 273.15).toFixed(0);
  currentTemp.innerText = `${temperature} °C`;
  weatherDes.innerText = des;
  setIcon(icon, document.querySelector(".icon"));
}

function linkToApi(lon, lat) {
  const api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  fetch(api)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const city = data.name,
        country = data.sys["country"],
        temp = data.main.temp,
        description = data.weather[0]["description"],
        icon = data.weather[0]["icon"];
      paintApp(city, country, temp, description, icon);
    });
}

function getLocation() {
  let lon; //경도
  let lat; //위도

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      lon = position.coords.longitude.toFixed(2);
      lat = position.coords.latitude.toFixed(2);
      linkToApi(lon, lat);
    });
  }
}

function loadEvent() {
  window.addEventListener("load", getLocation);
}

function init() {
  loadEvent();
}

init();

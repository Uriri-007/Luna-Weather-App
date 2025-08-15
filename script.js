// Using IIFE to access every DOM elements
const Domaccess = (() => {
  const searchBtn = document.querySelector("#search-btn");
  const cityInput = document.querySelector("#city-name");
  const descriptionText = document.getElementById("description");
  const conditionText = document.getElementById("condition");
  const addressText = document.getElementById("address");
  const windspeedText = document.getElementById("windspeed");
  const temperatureText = document.getElementById("temperature");
  const weatherCard = document.querySelector(".weather-card");
  const gifImg = document.createElement("img");
  const iconElem = document.createElement("i");
  const dataVisuals = document.querySelector(".data-visuals");
  const dataInputs = document.querySelector(".data-input");
  const backBtn = document.querySelector(".back-btn");
  
  return {
    searchBtn,
    cityInput,
    descriptionText,
    conditionText,
    addressText,
    windspeedText,
    temperatureText,
    weatherCard,
    gifImg,
    iconElem,
    dataVisuals,
    dataInputs,
    backBtn
  };
})();

let domObj = {};

function getWetherData() {
  const city = Domaccess.cityInput.value;
  fetch(
      "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" +
      city +
      "?unitGroup=us&key=VD4KB8Y63RUHYCVSF883Y3264&contentType=json", { mode: "cors" }
    )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      domObj.address = data.resolvedAddress;
      domObj.windspeed = data.days[0].windspeed;
      domObj.temperature = data.days[0].temp;
      domObj.condition = data.days[0].conditions;
      domObj.description = data.days[0].description;
      domObj.icon = data.days[0].icon;
      getSuitableGif(domObj.icon);
    })
    .catch((error) => {
      getErrorMsg(error);
    })
}

function getErrorMsg(error) {
  alert(`404   \n ＞﹏＜\n ${error}`);
}

async function getSuitableGif(icon) {
  const getIconData = await fetch(
    "https://api.giphy.com/v1/gifs/translate?api_key=OxOlAZlGrdoipwWS38MZhW0wlv9RXr51&s=" +
    icon, { mode: "cors" }
  );
  const refineIconData = await getIconData.json();
  domObj.imageSrc = refineIconData.data.images.original.url;
  domObj.altText = refineIconData.data.alt_text;
  updateUI(domObj);
  displayWeatherCard();
}

async function updateUI(obj) {
  const {
    address,
    windspeed,
    temperature,
    condition,
    description,
    icon,
    imageSrc,
    altText
  } = await obj;
  
  const iElem = Domaccess.iconElem;
  const uniformIconData = icon.toLowerCase();
  if (uniformIconData.includes("rain")) {
    iElem.className = "fa-solid fa-umbrella";
  } else if (uniformIconData.includes("cloud")) {
    iElem.className = "fa-solid fa-cloud";
  } else if (uniformIconData.includes("sun")) {
    iElem.className = "fa-solid fa-sun";
  } else if (uniformIconData.includes("storm")) {
    iElem.className = "fa-solid fa-bolt-lightning"
  } else {
    iElem.className = "fa-solid fa-cloud-sun";
  }
  
  Domaccess.addressText.textContent = address;
  Domaccess.conditionText.textContent = condition;
  Domaccess.conditionText.appendChild(iElem);
  Domaccess.descriptionText.textContent = description;
  Domaccess.temperatureText.textContent = `${temperature}°F`;
  Domaccess.windspeedText.textContent = `Windspeed: ${windspeed}m/s`;
  Domaccess.weatherCard.appendChild(Domaccess.gifImg);
  Domaccess.gifImg.classList.add("gif-img");
  Domaccess.gifImg.src = imageSrc;
  Domaccess.gifImg.alt = altText;
}

function convertTemperature(self) {
  let convertedTemp;
  let temp = domObj.temperature;
  if (self.textContent.includes("F")) {
    convertedTemp = `${Math.round(((Number(temp) - 32) * 5) / 9)}°C`;
  } else {
    convertedTemp = `${temp}°F`
  }
  
  self.textContent = convertedTemp;
}

function displayWeatherCard() {
  Domaccess.dataVisuals.style.display = "flex";
  Domaccess.dataInputs.style.display = "none";
  Domaccess.cityInput.value = "";
  setTimeout(() => {
    Domaccess.backBtn.style.opacity = "1";
    Domaccess.backBtn.style.transition = "opacity 0.5s linear";
  }, 1500);
}

function displaySearchColumn(self) {
  Domaccess.dataVisuals.style.display = "none";
  Domaccess.dataInputs.style.display = "flex";
  self.style.opacity = "0";
  Domaccess.addressText.textContent = "";
  Domaccess.conditionText.textContent = "";
  Domaccess.windspeedText.removeChild(iElem);
  Domaccess.descriptionText.textContent = "";
  Domaccess.temperatureText.textContent = "";
  Domaccess.windspeedText.textContent = "";
  Domaccess.weatherCard.removeChild(gifImg);
  Domaccess.gifImg.src = "";
  Domaccess.gifImg.alt = "";
}

Domaccess.searchBtn.addEventListener("click", getWetherData);

Domaccess.temperatureText.addEventListener("mouseover", (e) => {
  convertTemperature(e.target)
})

Domaccess.temperatureText.addEventListener("click", (e) => {
  convertTemperature(e.target)
})

Domaccess.backBtn.addEventListener("click", (e) => {
  displaySearchColumn(e.target)
})
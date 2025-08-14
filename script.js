// Using IIFE to access every DOM elements
const Domaccess = (() => {
  const searchBtn = document.querySelector("#search-btn");
  const cityInput = document.querySelector("#city-name");
  const descriptionText = document.getElementById("description");
  const conditionText = document.getElementById("condition");
  const addressText = document.getElementById("address");
  const windspeedText = document.getElementById("windspeed");
  const iconImg = document.getElementById("icon");
  const temperatureText = document.getElementById("temperature");
  const weatherCard = document.querySelector(".weather-card");
  const gifImg = document.createElement("img");
  const dataVisuals = document.querySelector(".data-visuals");
  const dataInputs = document.querySelector(".data-input");

  return {
    searchBtn,
    cityInput,
    descriptionText,
    conditionText,
    addressText,
    windspeedText,
    iconImg,
    temperatureText,
    weatherCard,
    gifImg,
    dataVisuals,
    dataInputs,
  };
})();

let domObj = {};

function getWetherData() {
  const city = Domaccess.cityInput.value;
  fetch(
    "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" +
      city +
      "?unitGroup=us&key=VD4KB8Y63RUHYCVSF883Y3264&contentType=json",
    { mode: "cors" }
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
      console.log(domObj);
      console.log(data)
      getSuitableIcon(domObj.icon);
    })
    .catch((error) => {
      getErrorMsg(error);
    })
}

async function getSuitableIcon(icon) {
  const getIconData = await fetch(
    "https://api.giphy.com/v1/gifs/translate?api_key=OxOlAZlGrdoipwWS38MZhW0wlv9RXr51&s=" +
      icon,
    { mode: "cors" }
  );
  const refineIconData = await getIconData.json();
  domObj.imageSrc = refineIconData.data.images.original.url;
  domObj.altText = refineIconData.data.alt_text;
  updateUI(domObj);
}

function getErrorMsg(error) {
  alert(`404   \n ＞﹏＜\n ${error}`);
}

function updateUI(obj) {
  const { 
    address, 
    windspeed, 
    temperature, 
    condition, 
    description, 
    icon,
    imageSrc,
    altText
  } = obj;

  Domaccess.addressText.textContent = address;
  Domaccess.conditionText.textContent = condition;
  Domaccess.descriptionText.textContent = description;
  Domaccess.temperatureText.textContent = `${temperature} °F`;
  Domaccess.windspeedText.textContent = windspeed;
  Domaccess.weatherCard.appendChild(Domaccess.gifImg);
  Domaccess.gifImg.classList.add("gif-img");
  Domaccess.gifImg.src = imageSrc;
  Domaccess.gifImg.alt = altText;

//   switch (icon.toLowerCase()) {
//     case "clear-day":
//       Domaccess.iconImg.
//   }
 }

Domaccess.searchBtn.addEventListener("click", () => {
  Domaccess.dataVisuals.style.display = "flex";
  Domaccess.dataInputs.style.display = "none";
  getWetherData();
});
Domaccess.temperatureText.addEventListener("click", () => {})
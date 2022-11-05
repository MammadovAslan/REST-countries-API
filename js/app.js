const countriesContainer = document.querySelector("#countries-container");
const mainContainer = document.querySelector(".container");
const select = document.querySelector("#filter");

//*------------------Filter by Region--------------------

select.addEventListener("change", function () {
  switch (this.value) {
    case "Africa":
      getCountries("Africa", null);
      break;
    case "Americas":
      getCountries("Americas", null);
      break;
    case "Europe":
      getCountries("Europe", null);
      break;
    case "Asia":
      getCountries("Asia", null);
      break;
    case "Oceania":
      getCountries("Oceania", null);
      break;
    default:
      getCountries();
  }
});

//*------------------Search for a country-------------------

const search = document.querySelector("#search-form");
const input = document.querySelector("#search-input");
search.addEventListener("submit", function (event) {
  event.preventDefault();

  getCountries(null, input.value.toLowerCase());
  event.target.reset();
});

//*------------------Display counties--------------------

const getCountries = async (region, countryName) => {
  const data = await fetch("https://restcountries.com/v2/all");
  const countries = await data.json();
  countriesContainer.innerHTML = "";
  for (const country of countries) {
    if (region) {
      if (country.region === region) {
        countriesContainer.append(createCountryCard(country));
      }
    } else if (countryName) {
      if (country.name.toLowerCase() === countryName) {
        countriesContainer.append(createCountryCard(country));
      }
    } else {
      countriesContainer.append(createCountryCard(country));
      if (country.cioc === "BEL") {
      }
    }
  }
};

//*------------------Create country card--------------------

const createCountryCard = (country) => {
  const countryCard = document.createElement("div");
  countryCard.classList.add("country");
  countryCard.innerHTML = `    
          <img src="${country.flag}" alt="${country.name}"/>
          <div class="info-container">
          <h4 class="country-name">${country.name}</h4>
          <p class="population info">Population: ${country.population
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</p>
          <p class="region info">Region: ${country.region}</p>
          <p class="capital info">Capital: ${country.capital}</p>
          </div>
      `;
  countryCard.addEventListener("click", function () {
    countriesContainer.classList.replace("show", "hide");
    showDetailedInfo(country);
  });
  return countryCard;
};

getCountries();

//*-------------Show detailed information about country---------------

const showDetailedInfo = (country) => {
  const detailetInfo = document.createElement("div");

  //*-------------Show near countries(if there are  any)---------------

  if (country.borders) {
    console.log(country.borders);
    const request = new Promise((res, rej) => {
      res(fetch("https://restcountries.com/v2/all"));
    })
      .then((data) => {
        return data.json();
      })
      .then((resp) => {
        const result = [];
        for (const elem of resp) {
          for (const border of country.borders) {
            if (elem.alpha3Code === border) {
              result.push(elem);
            }
          }
        }

        return result;
      })
      .then((resp) => {
        const borders = document.querySelector(".borders");

        resp.forEach((el) => {
          const border = document.createElement("button");
          border.classList.add("border-countrie");
          border.innerHTML = `${el.name}`;
          border.addEventListener("click", function () {
            const info = document.querySelector("#detailed-information");
            info.remove();
            showDetailedInfo(el);
          });
          borders.append(border);
        });
      });
  }

  detailetInfo.innerHTML = `
  <div id="detailed-information">
  <button class="back-button" onclick='getBackToList()'><i class="fa-solid fa-arrow-left"></i>Back</button>
  <div class="inform-container">
    <div class="flag">
      <img src="${country.flag}" alt="${country.name}" />
    </div>
    <div class="information">
      <h1 class="country-name">${country.name}</h1>
      <div class="country-info">
        <p class="info native-name"><b>Native name</b>: ${country.nativeName}</p>
        <p class="info population"><b>Population</b>: ${country.population
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</p>
        <p class="info region"><b>Region</b>: ${country.region}</p>
        <p class="info sub-region"><b>Sub Region</b>: ${country.subregion}</p>
        <p class="info capital"><b>Capital</b>: ${country.capital}</p>
        <p class="info area"><b>Area</b>: ${country.area
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")} m<sup>2</sup></p>
        <p class="info top-level-domain"><b>Top Level Domain</b>: ${country.topLevelDomain}</p>
        <p class="info currencies"><b>Currencies</b>: ${country.currencies.map((currencie) => {
          return currencie.name;
        })}</p>
        <p class="info languages"><b>Languages</b>: ${country.languages.map((lang) => {
          return lang.name;
        })}</p>
      </div>
      <div class="borders">
      <p class="border-countries"><b>Border-Countries</b>:</p>
      </div>
    </div>
  </div>
</div>
  `;

  mainContainer.append(detailetInfo);
};

//*-------------Back to list---------------

const getBackToList = () => {
  const info = document.querySelector("#detailed-information");
  info.remove();
  countriesContainer.classList.replace("hide", "show");
};

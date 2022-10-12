let searchBtn = document.getElementById('search-btn');
let countryInput = document.getElementById('country-input');

document.querySelector('#country-input').addEventListener('keyup', (event) => {
  if (event.key !== 'Enter') return;
  document.querySelector('#search-btn').click();
  event.preventDefault();
});

searchBtn.addEventListener('click', () => {
  let countryName = countryInput.value.trim();
  let finalURL = `http://localhost:3000/api/countries/${countryName}`;
  fetch(finalURL)
    .then((response) => response.json())
    .then((data) => {
      result.innerHTML = `
      <img src="${data.sCountryFlag}" class="flag-img">
      <h2>${data.sName}</h2>
      <div class="wrapper">
        <div class="data-wrapper">
            <h4>ISO Code:</h4>
            <span>${data.sISOCode}</span>
        </div>
      </div>
      <div class="wrapper">
        <div class="data-wrapper">
            <h4>Capital:</h4>
            <span>${data.sCapitalCity}</span>
        </div>
      </div>
      
      <div class="wrapper">
        <div class="data-wrapper">
            <h4>Phone Code:</h4>
            <span>${data.sPhoneCode}</span>
        </div>
      </div>
      <div class="wrapper">
        <div class="data-wrapper">
            <h4>Continent:</h4>
            <span>${data.sContinentCode}</span>
        </div>
      </div>
      <div class="wrapper">
        <div class="data-wrapper">
            <h4>Currency:</h4>
            <span>${data.sCurrencyISOCode}</span>
        </div>
      </div>
      <div class="wrapper">
        <div class="data-wrapper">
            <h4>Common Languages:</h4>
            <span>${Object.values(
              data.Languages.map((language) => {
                return language.sName;
              })
            )
              .toString()
              .split(',')
              .join(', ')}</span>
        </div>
      </div>
      `;
    })
    .catch(() => {
      if (countryName.length === 0) {
        result.innerHTML = `<h3>The input field cannot be empty!</h3>`;
      } else {
        result.innerHTML = `<h3>Please enter a valid country name.</h3>`;
      }
    });
});

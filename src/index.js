import './css/styles.css';
import { fetchCountry } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchField = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchField.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
  event.preventDefault();
  const input = event.currentTarget;
  const searchQuery = input.value.trim();

  fetchCountry(searchQuery)
    .then(data => {
      if (searchQuery === '') {
        cleanCountryList();
        cleanCountryInfo();
      }

      if (data.length > 10) {
        return Notify.failure(
          'Too many matches found. Please enter a more specific name.'
        );
      }

      if (data.length >= 2 && data.length < 10) {
        createCountryList(data);
        cleanCountryInfo();
        return;
      }

      if (data.length === 1) {
        cleanCountryList();
        createCountryInfo(data);
        return;
      }
    })
    .catch(error => Notify.failure('Oops, there is no country with that name'));
}

function createCountryList(data) {
  countryList.innerHTML = createMarkupCountryList(data);
}

function createCountryInfo(data) {
  countryInfo.innerHTML = createMarkupCountryInfo(data);
}

function cleanCountryList() {
  countryList.innerHTML = '';
}

function cleanCountryInfo() {
  countryInfo.innerHTML = '';
}

function createMarkupCountryList(data) {
  return data
    .map(
      ({ name, flags }) =>
        `<li>
          <img src="${flags.svg}" alt="flag" width="30px"/>
          <h2>${name.common}</h2>
        </li>`
    )
    .join('');
}

function createMarkupCountryInfo(data) {
  return data
    .map(
      ({ name, capital, population, flags, languages }) =>
        `<div class="info">
          <img src="${flags.svg}" alt="flag" width="100px"/>
          <h1>${name.common}</h1>
        </div>
        <div>
          <p class="title"><b>Capital:</b> ${capital}</p>
          <p class="title"><b>Population:</b> ${population}</p>
          <p class="title"><b>Languages:</b> ${Object.values(languages)}</p>
        </div>`
    )
    .join('');
}

import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import API from './fetchCountries';

class CountrySearch {
  constructor({ search, list, info, url, params }) {
    this.search = search;
    this.list = list;
    this.info = info;
    // this.url = url;
    // this.params = params;
    this.DEBOUNCE_DELAY = 300;
  }

  init() {
    this.addListeners();
    this.info.style.display = 'none';
  }

  addListeners() {
    this.search.addEventListener(
      'input',
      debounce(this.onInput.bind(this), this.DEBOUNCE_DELAY)
    );
  }

  onInput(e) {
    const input = e.target.value.trim();

    // this.clearMarkup('list');

    if (!input) {
      // this.clearMarkup('list', 'info');
      return;
    }

    API.fetchCountries(input).then(this.onResponse).catch(this.onError);
  }

  // fetchCountries(input) {
  //   return fetch(`${this.url}/v3.1/name/${input}?${this.params}`).then(r => {
  //     if (!r.ok) {
  //       throw new Error();
  //     }
  //     return r.json();
  //   });
  // }

  onResponse(resp) {
    if (resp.length > 10) {
      // this.clearMarkup('list', 'info');

      Notify.info('Too many matches found. Please enter a more specific name.');

      return;
    }

    if (resp.length === 1) {
      this.createCard(resp);

      return;
    }

    this.createList(resp);
  }

  onError(e) {
    console.log(e);

    // this.info.innerHTML = '';
    // this.list.innerHTML = '';

    Notify.failure('Oops, there is no country with that name');
  }

  createCard(country) {
    const markup = country
      .map(
        ({
          name: { official },
          capital,
          flags: { svg },
          population,
          languages,
        }) => {
          const allLanguages = Object.values(languages).join(', ');

          return `<div class="wrapper"><img class="card__flag" src="${svg}"><h2>${official}</h2></div>
          <p><b>Capital</b>: ${capital}</p>
          <p><b>Population</b>: ${population}</p>
          <p><b>Languages</b>: ${allLanguages}</p>`;
        }
      )
      .join('');

    // this.list.innerHTML = '';
    this.info.innerHTML = markup;
  }

  createList(resp) {
    const markup = resp
      .map(
        ({ name: { common }, flags: { svg } }) =>
          `<li><img src="${svg}"> <p class="list__text">${common}</p></li>`
      )
      .join('');

    // this.info.innerHTML = '';
    this.list.innerHTML = markup;
  }

  // clearMarkup(x, y) {
  //   if (x === 'list' || y === 'list') {
  //     this.list.innerHTML = '';
  //   }

  //   if (y === 'info' || x === 'info') {
  //     this.info.innerHTML = '';
  //   }
  // }
}

const refs = {
  search: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
  // url: 'https://restcountries.com',
  // params: new URLSearchParams({
  //   fields: 'name,capital,population,flags,languages',
  // }),
};

new CountrySearch(refs).init();

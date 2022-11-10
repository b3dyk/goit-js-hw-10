import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

class CountrySearch {
  constructor({ search, list, info, fetchCountries }) {
    this.search = search;
    this.list = list;
    this.info = info;
    this.fetchCountries = fetchCountries;
    this.DEBOUNCE_DELAY = 300;
  }

  init() {
    this.addListeners();
    this.displayCard('none');
  }

  addListeners() {
    this.search.addEventListener(
      'input',
      debounce(this.onInput.bind(this), this.DEBOUNCE_DELAY)
    );
  }

  onInput(e) {
    const input = e.target.value.trim();

    this.clearMarkup('list');

    this.displayCard('none');

    if (!input) {
      this.clearMarkup('list', 'info');
      return;
    }

    this.fetchCountries(input)
      .then(this.onResponse.bind(this))
      .catch(this.onError.bind(this));
  }

  onResponse(resp) {
    if (resp.length > 10) {
      this.clearMarkup('list', 'info');

      Notify.info('Too many matches found. Please enter a more specific name.');

      return;
    }

    if (resp.length === 1) {
      this.createCard(resp);
      return;
    }

    this.createList(resp);
  }

  onError(statusText) {
    console.log(statusText);

    this.clearMarkup('list', 'info');

    Notify.failure('Oops, there is no country with that name');
  }

  createCard(country) {
    this.displayCard('block');

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

          if (official === 'Russian Federation') {
            official = 'Temporary misunderstanding';
            svg =
              'https://static2.bigstockphoto.com/9/3/2/large2/239169784.jpg';
          }
          Notify.success(
            `Here you go! You were looking for ${official}, weren't you?`
          );

          return `<div class="wrapper"><img class="card__flag" src="${svg}"><h2 class="card__title">${official}</h2></div>
        <div class="inner-wrapper">
          <p class="card__text"><b>Capital</b>: ${capital}</p>
          <p class="card__text"><b>Population</b>: ${population}</p>
          <p class="card__text"><b>Languages</b>: ${allLanguages}</p>
          </div>`;
        }
      )
      .join('');

    this.clearMarkup('list');
    this.info.innerHTML = markup;
  }

  createList(resp) {
    const markup = resp.map(({ name: { common }, flags: { svg } }) => {
      const li = document.createElement('li');
      const img = document.createElement('img');
      const p = document.createElement('p');

      img.src = `${svg}`;
      p.innerText = `${common}`;
      p.classList.add('list__text');
      li.append(img);
      li.append(p);

      return li;
    });

    this.clearMarkup('info');
    this.list.append(...markup);
  }

  clearMarkup(x, y) {
    if (x === 'list' || y === 'list') {
      this.list.innerHTML = '';
    }

    if (y === 'info' || x === 'info') {
      this.info.innerHTML = '';
    }
  }

  displayCard(x) {
    this.info.style.display = `${x}`;
  }
}

const refs = {
  search: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
  fetchCountries,
};

new CountrySearch(refs).init();

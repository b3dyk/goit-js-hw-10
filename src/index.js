import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  search: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.search.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));
displayCard('none');

function onInput(e) {
  const input = e.target.value.trim();

  clearMarkup('list');

  displayCard('none');

  if (!input) {
    clearMarkup('list', 'info');
    return;
  }

  fetchCountries(input).then(onResponse).catch(onError);
}

function onResponse(resp) {
  if (resp.length > 10) {
    clearMarkup('list', 'info');

    Notify.info('Too many matches found. Please enter a more specific name.');

    return;
  }

  if (resp.length === 1) {
    createCard(resp);

    return;
  }

  createList(resp);
}

function onError(statusText) {
  console.log(statusText);

  clearMarkup('list', 'info');

  Notify.failure('Oops, there is no country with that name');
}

function createCard(country) {
  displayCard('block');

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
          svg = 'https://static2.bigstockphoto.com/9/3/2/large2/239169784.jpg';
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

  clearMarkup('list');
  refs.info.innerHTML = markup;
}

function createList(resp) {
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

  clearMarkup('info');
  refs.list.append(...markup);
}

function clearMarkup(x, y) {
  if (x === 'list' || y === 'list') {
    refs.list.innerHTML = '';
  }

  if (y === 'info' || x === 'info') {
    refs.info.innerHTML = '';
  }
}

function displayCard(x) {
  refs.info.style.display = `${x}`;
}

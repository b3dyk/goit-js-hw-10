const url = 'https://restcountries.com';
const params = new URLSearchParams({
  fields: 'name,capital,population,flags,languages',
});

function fetchCountries(input) {
  return fetch(`${url}/v3.1/name/${input}?${params}`).then(r => {
    if (!r.ok) {
      throw new Error(r.statusText);
    }
    return r.json();
  });
}

export default { fetchCountries };

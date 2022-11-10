const url = 'https://restcountries.com';
const params = new URLSearchParams({
  fields: 'name,capital,population,flags,languages',
});

export async function fetchCountries(input) {
  const response = await fetch(`${url}/v3.1/name/${input}?${params}`);
  return await response.json();
}

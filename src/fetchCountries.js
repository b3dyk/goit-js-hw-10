const url = 'https://restcountries.com';
const params = new URLSearchParams({
  fields: 'name,capital,population,flags,languages',
});

export async function fetchCountries(input) {
  try {
    const response = await fetch(`${url}/v3.1/name/${input}?${params}`);

    if (!response.ok) {
      throw new Error(response.status);
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

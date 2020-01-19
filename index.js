'use strict';

const apiKey = 'CdJHn6uVaOeGgKaJONSUnkjbL7fGajYDKQbs1pi2'; 
const searchURL = 'https://developer.nps.gov/api/v1/parks';


function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  $('#results-list').empty();

  if (responseJson.total == 0) {
      $('#results-list').append(
          '<p class="error-message">Sorry, no results were found. Try changing your search term.</p>'
      );
  }

  for (let i = 0; i < responseJson.data.length; i++){
    $('#results-list').append(
      `<li><h3>${responseJson.data[i].fullName}</h3>
      <p>${responseJson.data[i].description}</p>
      <a href='${responseJson.data[i].url}'>${responseJson.data[i].url}</a>
      </li>`
    )}; 

  $('#results').removeClass('hidden');
};

function getNationalParks(query, maxResults) {
  const params = {
    api_key: apiKey,
    q: query,
    limit: maxResults,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const parkSearch = $('#js-park-search').val();
    const maxResults = $('#js-max-results').val();
    getNationalParks(parkSearch, maxResults);
  });
}

$(watchForm);
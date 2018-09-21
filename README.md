# imdb-node-api

Simple IMDb API for NodeJS.

# Installation
<pre>
npm install imdb-node-api
</pre>
# Usage

## IMDb Api Definition
<pre>
var imdb = require('imdb-node-api');
</pre>

## Search Movies
### Usage
<pre>
imdb.searchMovies(keyword, successCallback, errorCallback);
</pre>

### Example
<pre>
imdb.searchMovies('xmen', function (movies) {
    console.log(movies);
}, function(error) { 
    console.error(error);
});
</pre>

## Get Movie
### Usage
<pre>
imdb.getMovie(movieId, successCallback, errorCallback);
</pre>

### Example
<pre>
imdb.getMovie('tt0106519', function (movie) {
    console.log(movie);
}, function(error) { 
    console.error(error);
});
</pre>
# DEPRECATED
 
# imdb-node-api

Simple IMDb API for Nodejs. <br> Work in progress...

# Installation
<pre>
npm install imdb-node-api
</pre>
# Usage

## Define IMDb Api
<pre>
var imdb = require('imdb-node-api');
</pre>

## Search movies
<pre>
imdb.search({keyword: 'xmen', category: 'movie'}, function (err, data) {
    console.error("error: " + err);
    console.log("data: " + data);
});
</pre>

## Get movie by IMDb Id
<pre>
imdb.getByImdbId('tt0106519', function (err, data) {
    console.error("error: " + err);
    console.log("data: " + data);
});
</pre>

## Get recommendations of a movie
<pre>
imdb.getRecommendationsByImdbId('tt0106519', function (err, data) {
    console.error("error: " + err);
    console.log("data: " + data);
});
</pre>

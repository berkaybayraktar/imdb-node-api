# imdb-node-api

Simple IMDb API for Nodejs. <br> Work in progress...

# Installation
<pre>
npm install imdb-node-api
</pre>
# Usage

<pre>
var imdb = require('imdb-node-api');

imdb.getByImdbId('tt0106519', function (err, data) {
    console.error("error: " + err);
    console.log("data: " + data);
});
</pre>

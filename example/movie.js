var imdb = require('../index');

imdb.getByImdbId('tt0106519', function (err, data) {
    console.error("error: " + err);
    console.log("data: " + data);
});
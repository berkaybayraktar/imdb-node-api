var imdb = require('../index');

imdb.getMovie('tt0106519', function (movie) {
    console.log(movie);
}, function(error) {
    console.error(error);
});

imdb.searchMovies('xmen', function (movies) {
    console.log(movies);
}, function(error) {
    console.error(error);
});
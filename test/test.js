var imdb = require('../index')
    , should = require('chai').should();

describe('#search', function () {
    it('Check search result', function (done) {
        this.timeout(15000);

        imdb.searchMovies('xmen', function (movies) {
            should.exist(movies);
            console.log(movies);
            done();
        }, function (error) {
            should.not.exist(error);
        });
    });

    it('Try to search invalid keyword', function (done) {
        this.timeout(15000);

        imdb.getMovie('-------------------------', function (movies) {
            should.not.exist(movies);
        }, function (error) {
            should.exist(error);
            done();
        });
    });

    it('Get movie details', function (done) {
        this.timeout(15000);

        imdb.getMovie('tt0120903', function (movie) {
            should.exist(movie);
            console.log(movie);
            done();
        }, function (error) {
            should.not.exist(error);
        });
    });

    it('Try to get invalid movie', function (done) {
        this.timeout(15000);

        imdb.getMovie('000000000', function (movie) {
            should.not.exist(movie);
        }, function (error) {
            should.exist(error);
            done();
        });
    });
});
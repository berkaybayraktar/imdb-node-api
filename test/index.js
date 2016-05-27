var imdb = require('../index')
    , assest = require('chai').assert
    , should = require('chai').should()
    , search = imdb.search
    , utility = require('../lib/utility.lib');

describe('#search', function () {
    it('Check search query', function(){
        utility.validateQuery({keyword: 'xmen', category: 'movie'}, function(queryIsValid, queryError){
            queryIsValid.should.equal(true);
        });
    });
    it('Check search result', function () {
       search({keyword: 'xmen'}, function(err, data){
           var parsedData = JSON.parse(data);
           parsedData.query.keyword.should.equal('xmen');
       })
    });
});
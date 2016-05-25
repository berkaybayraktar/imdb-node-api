var imdb = require('../index');

imdb.search({searchKey: "xmen", maxResult: 5}, function(err, data){
    if(err) throw (err)
    console.log(data);
});
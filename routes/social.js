
/*
 * GET social page.
 */

exports.index = function(req, res){
    var request = require('request');
    request('http://localhost:3000/api/user', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    })
    res.render('social', { title: 'Biljet :: Social', subtitle: 'Social section' });
};
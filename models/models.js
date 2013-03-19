// seen at: http://stackoverflow.com/questions/10081611/mongoose-schema-creation

var models = ['./Event.js', './EventComment.js', './QR.js', './User.js', './UserComment.js'];

exports.initialize = function() {
    var len = models.length;
    for (var i = 0; i < len; i += 1) {
        require(models[i]);
    }
};
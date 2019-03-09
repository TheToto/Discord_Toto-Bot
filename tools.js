const fs = require('fs');
var request = require('request');

module.exports.splitArgs = function (string) {
    var myRegexp = /[^\s"]+|"([^"]*)"/gi;
    var myArray = [];
    do {
        var match = myRegexp.exec(string);
        if (match != null)
            myArray.push(match[1] ? match[1] : match[0]);
    } while (match != null);
    return myArray;
}

module.exports.download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        try {
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        } catch (error) {
            console.error(error);
        }

    });
};

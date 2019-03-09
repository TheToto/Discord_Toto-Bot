const express = require('express');
const app = express();


app.get('/', function (req, resu) {
    resu.send("Hello W");
})
app.get('/test', function (req, resu) {
    logChannel.send(req.headers)
    logChannel.send(req.headers['x-forwarded-for']);
    resu.send("OK");
})

app.set('port', (process.env.PORT || 5000));
var test = app.listen(app.get('port'), function () {
    console.log('Webserver is running on port', app.get('port'));
});
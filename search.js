const https = require("https");
var giphy = require('giphy-api')('9trrTqYcZUbUx3bJGJOVALDA1E3DcTRE');
var randomInt = require('random-int');
//var YaBoss = require('yaboss');



module.exports.qwantSearch = function (channel, string) {
  channel.send('Cette fonction est cassée.');
  /*google_image.search(string,10,function(url_list){
    var i = randomInt(0, 10);
    console.log(url_list);
  });*/
    /*npm install google-images-urlgoogle.list({
        keyword: string,
        num: 1,
        detail: true,
        nightmare: {
        }
    })
    .then(function (res) {
        console.log(res);
    }).catch(function(err) {
        console.log('err', err);
    });
    //
    var i = randomInt(0, 10);
    qwant.search("images", { query: string, count: 1, offset: i, language: "french" }, function(err, data){
      console.log(data);
      if (err) return channel.send(err);
      
      if (data.data.result.items[0] == undefined) return channel.send("Rien trouvé :c");
      channel.send("", {
        file: "https:"+data.data.result.items[0].media_fullsize+".png" // Or replace with FileOptions object
      });
    });
    */
  }
  
  module.exports.giphySearch = function (channel, string) {
    var i = randomInt(0, 50);
    giphy.search({
      q: string,
      limit: '1',
      offset:i
    }, function (err, res) {
        if (res.data[0] == undefined) {
          channel.send("J'ai rien trouvé :c");
          console.log("Nothing.");
        } else {
          channel.send("", {
            file: res.data[0].images.downsized_large.url // Or replace with FileOptions object
          });
        } 
    });
  
  }
  
  module.exports.giphyRandom = function (channel, string) {
    giphy.random({
      tag: string,
      limit: '1'
    }, function (err, res) {
        if (res.data.image_original_url == undefined) {
          console.log("giphy : nothing found, switch to search\n" + JSON.stringify(res));
          giphySearch(channel,string);
        } else {
          channel.send("", {
            file: res.data.fixed_height_downsampled_url // Or replace with FileOptions object
          });
        }
    });
  
  }
  
  module.exports.randomWiki = function(channel) {
    var url = 'https://fr.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&format=json';
    var title;
    https.get(url, function(res){
        var body = '';
  
        res.on('data', function(chunk){
            body += chunk;
        });
  
        res.on('end', function(){
            var fbResponse = JSON.parse(body);
            //console.log("First : " + body);
            for (var obj in fbResponse["query"]["pages"])
            {
              if (fbResponse["query"]["pages"][obj].title != undefined)
              {
              title = fbResponse["query"]["pages"][obj].title;
  
              break;
              }
            }
  
            url = "https://fr.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles="+title.replace(' ', '_');
            https.get(url, function(res){
              var body = '';
          
              res.on('data', function(chunk){
                  body += chunk;
              });
          
              res.on('end', function(){
                  var fbResponse = JSON.parse(body);
                  //console.log("Second : " + body);
                  var contentt;
                  for (var obj in fbResponse["query"]["pages"])
                  {
                    if (fbResponse["query"]["pages"][obj].title != undefined)
                    {
                      contentt = fbResponse["query"]["pages"][obj].extract;
          
                    break;
                    }
                  }
                  if (contentt == undefined) {
                    channel.send("> **"+title + "** \n" + "_Pas de résumé_");
                  } else {
                  channel.send("> **"+title + "** \n" + contentt);
                  }
                  
              });
            }).on('error', function(e){
              channel.send("Got an error" + e);
            });
            
        });
    }).on('error', function(e){
      channel.send("Got an error: " + e);
    });
  }
  
module.exports.searchWiki = function (channel,string) {
    var url = 'https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch='+ string + '&format=json';
    var title;
    https.get(url, function(res){
        var body = '';
  
        res.on('data', function(chunk){
            body += chunk;
        });
  
        res.on('end', function(){
            var fbResponse = JSON.parse(body);
            //console.log("First : " + body);
            if (fbResponse.query.search[0] == undefined) {
              channel.send("Rien trouvé... :c");
              return;
            }
            title = fbResponse.query.search[0].title;
  
            url = "https://fr.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles="+title.replace(' ', '_');
            https.get(url, function(res){
              var body = '';
          
              res.on('data', function(chunk){
                  body += chunk;
              });
          
              res.on('end', function(){
                  var fbResponse = JSON.parse(body);
                  //console.log("Second : " + body);
                  var contentt;
                  for (var obj in fbResponse["query"]["pages"])
                  {
                    if (fbResponse["query"]["pages"][obj].title != undefined)
                    {
                      contentt = fbResponse["query"]["pages"][obj].extract;
          
                    break;
                    }
                  }
                  if (contentt == undefined || contentt == "" || contentt == " ") {
                    channel.send("> **"+title + "** \n" + "_Pas de résumé_");
                  } else {
                  channel.send("> **"+title + "** \n" + contentt);
                  }
                  
              });
            }).on('error', function(e){
              channel.send("Got an error" + e);
            });
            
        });
    }).on('error', function(e){
      channel.send("Got an error: " + e);
    });
  }
  
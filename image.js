const fs = require('fs');
let meme = require('meme-maker');
var request = require('request');

const embed = require('./embed');

function splitArgs(string) {
    var myRegexp = /[^\s"]+|"([^"]*)"/gi;
    var myArray = [];
    do {
        var match = myRegexp.exec(string);
        if (match != null)
            myArray.push(match[1] ? match[1] : match[0]);
    } while (match != null);
    return myArray;
  }

  function download(uri, filename, callback) {
    request.head(uri, function(err, res, body){
        try {
            request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);      
        } catch (error) {
            console.error(error);
        }
      
    });
  };
  

  function createMeme(options,channel,author,trashchannel,oldMessage = null){

    function callbackMem(message)  {
      const filter = (reaction, user) => (reaction.emoji.name === '➕' || reaction.emoji.name === '➖' || reaction.emoji.name === '🆗') && user.id === author.id;
      const collector = message.createReactionCollector(filter, { time: 15000 });
      if (!oldMessage) {
        message.react("➖"); message.react("➕"); message.react("🆗");
      }
      collector.on('collect', r => {
            if (r.emoji.name == '➖') {
                options.fontSize -= 10;
            } else if (r.emoji.name == '➕'){
                options.fontSize += 10;
            } else {
                collector.stop("End");
                return;
            }
            fs.unlinkSync(options.outfile);
            options.outfile = "output-" + channel.id + "-"+options.fontSize+".png";
            collector.stop("Next");
            r.remove(author);
            console.log(options);
            createMeme(options,channel,author,trashchannel,message);
            console.log(`Collected ${r.emoji.name}  ${options.fontSize}`);
        });
      collector.on('end', (collected,reason) => {
            if (reason != "Next") {
                message.edit(embed.makeMeme(message.embeds[0].image.url,false)).then(res => {
                    message.clearReactions();   
                    fs.unlinkSync(options.image);
                    fs.unlinkSync(options.outfile);
                });
            }
        });
    }
    
    meme(options, function(err) {
        if(err) {
          console.error(err);
          channel.send("Une erreur est survenue dans la création du meme... :c");
          return;
        }
        let myUrl;
        trashchannel.send("", {files: [options.outfile]}).then(msg => {
            myUrl = msg.attachments.first().url;
            console.log(myUrl);
            console.log('Image temporaly saved !');
            if (oldMessage) {
                oldMessage.edit(embed.makeMeme(myUrl)).then(callbackMem).catch(console.error);
            } else {
                channel.send(embed.makeMeme(myUrl)).then(callbackMem).catch(console.error);
            }
        }).catch(console.error);

        

    });
  }

  module.exports.makeMeme = function(channel, string,author,trashchannel) {
    let args = splitArgs(string);
    if (args.length < 3) {
      channel.send('Tu as mal formulé ta requête...');
      return;
    }
    let inputPath = "input-" + channel.id + ".png";
    let outputPath = "output-" + channel.id + "-100.png";
    download(args[2], inputPath, function(){
      console.log(fs.existsSync(inputPath));
      if(fs.existsSync(inputPath)) {
        let options = {
          image: inputPath,         // Required
          outfile: outputPath,  // Required
          topText: args[0],            // Required
          bottomText: args[1],           // Optional
          //font: '/path/to/font.ttf',      // Optional
          fontSize: 100                   // Optional
          //fontFill: '#FFF',               // Optional
          //textPos: 'center',              // Optional
          //strokeColor: '#000',            // Optional
          //strokeWeight: 2                 // Optional
        }
        createMeme(options,channel,author,trashchannel);
      } else {
        channel.send("J'ai pas réussi à télécharger ton image...");
      }
    });

  }            

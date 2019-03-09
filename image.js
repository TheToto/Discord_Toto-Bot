let memeMaker = require('meme-maker');
const fs = require('fs');
const embed = require('./embed');
const tools = require('./tools')

module.exports.makeMeme = function (message, string, trashchannel) {
    function createMeme(options, channel, author, trashchannel, oldMessage = null) {
        function callbackMem(message) {
            const filter = (reaction, user) => (reaction.emoji.name === '➕' || reaction.emoji.name === '➖' || reaction.emoji.name === '🆗') && user.id === author.id;
            const collector = message.createReactionCollector(filter, { time: 15000 });
            if (!oldMessage) {
                message.react("➖"); message.react("➕"); message.react("🆗");
            }
            collector.on('collect', r => {
                if (r.emoji.name == '➖') {
                    options.fontSize -= 10;
                } else if (r.emoji.name == '➕') {
                    options.fontSize += 10;
                } else {
                    collector.stop("End");
                    return;
                }
                options.outfile = "output-" + author.id + ".png";
                collector.stop("Next");
                r.remove(author);
                console.log(options);
                createMeme(options, channel, author, trashchannel, message);
                console.log(`Collected ${r.emoji.name}  ${options.fontSize}`);
            });
            collector.on('end', (collected, reason) => {
                if (reason != "Next") {
                    message.edit(embed.makeMeme(message.embeds[0].image.url, false)).then(res => {
                        message.clearReactions();
                        fs.unlinkSync(options.image);
                        fs.unlinkSync(options.outfile);
                    });
                }
            });
        }

        memeMaker(options, function (err) {
            if (err) {
                console.error(err);
                channel.send("Une erreur est survenue dans la création du meme... :c");
                return;
            }
            let myUrl;
            trashchannel.send("", { files: [options.outfile] }).then(msg => {
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

    let args = tools.splitArgs(string);
    if (args.length < 3) {
        if (args.length == 2 && message.attachments.first()) {
            args.push(message.attachments.first().url);
        } else {
            message.channel.send('Tu as mal formulé ta requête...');
            return;
        }
    }
    let inputPath = "input-" + message.author.id + ".png";
    let outputPath = "output-" + message.author.id + ".png";
    try {
        tools.download(args[2], inputPath, function () {
            console.log(fs.existsSync(inputPath));
            if (fs.existsSync(inputPath)) {
                let options = {
                    image: inputPath,         // Required
                    outfile: outputPath,  // Required
                    topText: args[0],            // Required
                    bottomText: args[1],           // Optional
                    //font: '/path/to/font.ttf',      // Optional
                    fontSize: 50                   // Optional
                    //fontFill: '#FFF',               // Optional
                    //textPos: 'center',              // Optional
                    //strokeColor: '#000',            // Optional
                    //strokeWeight: 2                 // Optional
                }
                createMeme(options, message.channel, message.author, trashchannel);
            } else {
                message.channel.send("J'ai pas réussi à télécharger ton image...");
            }
        });
    } catch (error) {
        console.error(error);
        message.channel.send("J'ai pas réussi à télécharger ton image... (2)");
    }
}

module.exports.sendTranzat = function (channel, author) {
    function refresh(oldMessage = null) {
        function callbackMem(message) {
            const filter = (reaction, user) => reaction.emoji.name === '🔀' && user.id === author.id
            const collector = message.createReactionCollector(filter, { time: 10000 });
            if (!oldMessage)
                message.react("🔀");
            collector.on('collect', r => {
                collector.stop("Next");
                r.remove(author);
                refresh(message);
            });
            collector.on('end', (collected, reason) => {
                if (reason != "Next")
                    message.clearReactions();
            });
        }
        var i = Math.floor(Math.random() * 201) * 2;
        var content = embed.makeTranzat('https://tranzat.tk/tranzat/custom/tranzat' + i + '.png');
        if (oldMessage) {
            oldMessage.edit(content).then(callbackMem).catch(console.error);
        } else {
            channel.send(content).then(callbackMem).catch(console.error);
        }
    }
    refresh();
}
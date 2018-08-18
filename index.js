require('dotenv').config(); // For local dev

const Discord = require('discord.js');

const googleTTS = require('google-tts-api');
const asciify = require('asciify-image');

const client = new Discord.Client();

//Load external files
const yt = require('./yt');
const search = require('./search');
const hack = require('./hack');

//Launch Webserver for Heroku free dynos
require("./express");



let logChannel;
// Thetoto,Kim,Simby
let authUsers = ["227537120758071296","389454596160094228","239062648208097280"];

client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => {
  console.log('Discord Bot is running'); 
  logChannel = client.channels.get('450184906581082112');   
  client.user.setPresence({ status: 'online', game: { name: `J'occupe ${client.guilds.size} serveurs` } });
});

client.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'));

client.on('reconnecting', () => console.log('I am reconnecting now!'));
 	
client.on("guildCreate", guild => {
  logChannel.send(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setPresence({ status: 'online', game: { name: `J'occupe ${client.guilds.size} serveurs` } });
});

client.on("guildDelete", guild => {
  logChannel.send(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setPresence({ status: 'online', game: { name: `J'occupe ${client.guilds.size} serveurs` } });
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
  if (oldMember.user.bot || newMember.user.bot) return;

  let sayFunc = function(user) {
    if (yt.getQueue().get(user.guild.id)) return; 
    googleTTS("Bienvenue à "+ user.voiceChannel.name.split('_').join(' ') + ", " + user.displayName , 'fr', 1)   // speed normal = 1 (default), slow = 0.24
    .then(function (url) {
      if (client.voiceConnections.get(user.voiceChannel.guild.id))
        client.voiceConnections.get(user.voiceChannel.guild.id).playArbitraryInput(url);
    })
    .catch(function (err) {
      console.error(err.stack);
    });
  }

  if(oldMember.voiceChannel === undefined && newMember.voiceChannel !== undefined) {
    sayFunc(newMember);
  } else if(oldMember.voiceChannel === undefined) {
    sayFunc(oldMember);
  }
});

function checkUser(user) {
  return authUsers.includes(user.id);
}

client.on('message', async message => {
  let attach = [];
  if (message.attachments) {
    attach = message.attachments.map(x => x.url);
  }

  //Log DM and guild messages to a guild.
  logging(message, attach);

  if(message.author.bot) return;

  // Robot Len channel at Hotel saint louis
  if (message.channel.id == "398510725812846592" || message.channel.id == "434774827665195019") {
    let serverQueue = yt.getQueue().get(message.guild.id); 
    if (!serverQueue) { 
      googleTTS(message.content, 'fr', 1)   // speed normal = 1 (default), slow = 0.24
      .then(function (url) {
        if (client.voiceConnections.get(message.guild.id))
          client.voiceConnections.get(message.guild.id).playArbitraryInput(url);
      })
      .catch(function (err) {
        console.error(err.stack);
      });
    }
  }

  let lower = message.content.toLocaleLowerCase();

  if (lower.startsWith("h add ")) {
    let user = client.users.get(lower.slice(6));
    if (user && checkUser(message.author)) {
      authUsers.push(user.id);
      console.log(authUsers);
      message.reply(message.guild.member(user).displayName + " a été promu temporairement. (jusqu'au reboot)");
    } else {
      message.reply("Incorrect.");
    }
    return;
  }

  if (lower.startsWith("h ") || lower.startsWith("hs ")) {
    console.log(message.content);
    if (checkUser(message.author)) {
      let text = message.content.slice(2);
      if (lower.startsWith("hs "))
        text = message.content.slice(3);
      hack.main(client, message, text);
      if (lower.startsWith("hs "))
        message.delete();
    } else {
      message.reply('Lol. (h add id)');
    }
    return;
  }

  if (lower.startsWith('ping')) {
    message.reply('pong, ' + client.ping);
    return;
  }

  if (lower.includes('aurore')) {
    const ayy = client.emojis.find("name", "aurtong");
    if (ayy) {
      message.react(ayy.id);
    }
  }

  // A changer avec le nouveau tranzat creator
  if (lower.includes('tranzat')) {
    var i = Math.random();
    message.channel.send("", {
      file: 'https://tranzat.tk/tranzat/random.php?'+i+".png"
    });
  }

  if (lower === ('merci')) {
    message.channel.send('SIMB !');
    return;
  }

  if (lower === "listemojis") {
    var list = client.emojis;
    const emojiList = list.map(e=>e.toString()).join(" ");
    // Buggy with this node version. Works good on node 10
    message.channel.send("Liste emojis : " + emojiList, {split:{char:" "}});
    return;
  }

  if(lower.startsWith("gif ")) {
    let text = message.content.slice(4);
    search.giphyRandom(message.channel, text);
    return;
  }

  if(lower == "ascii" || lower == "ascii2") {
    let img;
    if (attach.length < 1) {
      img = message.author.avatarURL;  
    } else {
      img = attach[0];
    }
    let rev = lower == "ascii2";
    asciify(img, {
      fit:    'box',
      width:  30,
      height: 30,
      color: false,
      reverse: rev,
      }, function (err, asciified) {
        message.channel.send(err || "```" + asciified + "```");
    });
    return;
  }

  if(lower.startsWith("img ")) {
    let text = message.content.slice(4);
    search.qwantSearch(message.channel, text);
    return;
  }

  if(lower.startsWith("js ") && checkUser(message.author)) {
    let text = message.content.slice(3);
    eval(text);
    console.log("Js exec");
    return;
  }

  if(lower.startsWith("speak ")) {
    let serverQueue = yt.getQueue().get(message.guild.id); 
    if (serverQueue) return; 

    if (message.member.voiceChannel) {
			message.member.voiceChannel.join();
    } else { return; }
    
    let text = message.content.slice(6);
    googleTTS(text, 'fr', 1)   // speed normal = 1 (default), slow = 0.24
    .then(function (url) {
      client.voiceConnections.get(message.guild.id).playArbitraryInput(url);
    })
    .catch(function (err) {
      console.error(err.stack);
    });
    return;
  }

  if(lower.startsWith("wiki ")) {
    let text = message.content.slice(5);
    search.searchWiki(message.channel, text);
    return;
  }

  if (lower.includes('learn me')) {
    search.randomWiki(message.channel);
    return;
  }

  if (lower.includes('help me')) {
    message.channel.send("__Je sais faire :__\n" + 
    "**gif ...** = Cherche un gif sur Giphy\n" + 
    "**img ...** = Cherche une image (Qwant)\n" + 
    "**wiki ...** = Rechercher sur Wikipedia\n" +
    "**learn me** = Apprend la vie avec Wikipedia.\n\n" +
    "__Fonctions vocales :__\n" +
    "**join** = Rejoins ton salon vocal\n" +
    "**speak ...** = Lit le message à haute voix\n" +
    "**leave** = Quitte le salon vocal\n" +
    "__Youtube :__\n" +
    "**play ...** = Lance une recherche sur YouTube (recherche YT ou lien vers musique ou playlist)\n" +
    "**skip** = Passe à la musique suivante\n" +
    "**pause** et **resume** = Pause/Reprend la lecture\n" +
    "**stop** = Arrête la lecture\n" +
    "**queue** = Voir la liste de lecture"
  );
  return;
  }

  let insult = ["ta gueule","tg","ferme la","connard","pd","salo","pute","ta mère","ta mer","ntm","ftg","fdp"];
  let checkInsult = function (item) {
    return lower.includes(item);
  }

  if (message.isMentioned(client.user) && insult.some(checkInsult)) {
    logChannel.send("`" + message.guild.name + "` _" + message.channel.name + "_ = **" + message.author.username + "** : " + message.content , {files: attach});
    message.channel.send("PAPA ON M'INSULTE !! " + message.guild.members.get("227537120758071296"));
  }

  if (message.guild == null) return;
  await yt.main(message,client);
});

function logging(message, attach) {
  if (message.guild) {
    console.log("`" + message.guild.name + "` _" + message.channel.name + "_ = **" + message.author.username + "** : " + message.content , {files: attach});
  } 
  
  // DM channels
  else {
    console.log(/*"`" + message.guild.name + "` _" + message.channel.name + "_ = **" +*/ "**" + message.author.username + "** : " + message.content , {files: attach});
    if(message.author.bot) return;
    let sendGuild = client.guilds.get('398141966254211072');
    let sendChannel = sendGuild.channels.find('name', message.author.username)
    if (!sendChannel) {
      console.log('create new channel');
      sendGuild.createChannel(message.author.username)
      .then(function (theChannel) {
        theChannel.setParent(sendGuild.channels.get("479310662867353600"));
        theChannel.send("```h sendpm " + message.author.id + ' "message"```').then(x => x.pin());
        theChannel.send(/*"`" + message.guild.name + "` _" + message.channel.name + "_ = **" +*/ "**" + message.author.username + "** : " + message.content , {files: attach});
      })
      .catch(console.log);
      
    } else {
      sendChannel.send(/*"`" + message.guild.name + "` _" + message.channel.name + "_ = **" +*/ "**" + message.author.username + "** : " + message.content , {files: attach});
    }
  }

  //Logging
  if (message.guild && message.guild.id == "427475705714966540") {
    let sendGuild = client.guilds.get('398141966254211072');
    let sendChannel = sendGuild.channels.find('name', message.channel.name)
    if (!sendChannel) {
      sendGuild.createChannel(message.channel.name,"text")
      .then(function (theChannel) {
        theChannel.setParent(sendGuild.channels.get("479315450187087883"));
        theChannel.send(/*"`" + message.guild.name + "` _" + message.channel.name + "_ = **" +*/ "**" + message.author.username + "** : " + message.content , {files: attach});
      });
      
    } else {
      sendChannel.send(/*"`" + message.guild.name + "` _" + message.channel.name + "_ = **" +*/ "**" + message.author.username + "** : " + message.content , {files: attach});
    }
  }
}

client.login(process.env.key);
//const { TOKEN, PREFIX, GOOGLE_API_KEY } = require('./config');
const { Client, Util } = require('discord.js');

const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

const youtube = new YouTube("AIzaSyCqBQKdwzqSBqrkWUPOlO-SSjC0vlgscFk");

const queue = new Map();

module.exports.getQueue = function () {
	return queue;
}

module.exports.main = async function (msg,client) { // eslint-disable-line
	if (msg.author.bot) return undefined;
	//if (!msg.content.startsWith(PREFIX)) return undefined;

	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);

	let command = msg.content.toLowerCase().split(' ')[0];
	//command = command.slice(PREFIX.length)
	if (command === 'join') {
		if (msg.member.voiceChannel) {
			msg.member.voiceChannel.join()
			  .then(connection => { // Connection is an instance of VoiceConnection
				msg.reply('Je te suis :) !');
			  })
			  .catch(console.log);
		} else {
			msg.reply('Tu n\'est pas dans un salon vocal :(');
		}
	}
	else if (command === 'leave') {
		client.voiceConnections.get(msg.guild.id).channel.leave();
	}
	else if (command === 'play') {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('Tu n\'est pas dans un salon vocal :(!');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('J\'ai pas les droits :`\'( ! (CONNECT)');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('J\'ai pas les droits :`\'( ! (SPEAK)');
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send(`✅ J'ajoute tout ça (**${playlist.title}**) dans ma queue !`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
          if (searchString == "" || searchString == " ")
            return msg.channel.send('T\'as rien compris lol');
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
          let newm;
          msg.channel.send(`
__**Laquelle tu veux ?**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Entre un nombre entre 1 et 10.
          `)
          .then(message => newm = message);
					// eslint-disable-next-line max-depth
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 20000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send('**Wow ? T\'es mort ? J\'ai pas eu de réponse.**');
					}
					const videoIndex = parseInt(response.first().content);
          var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
          newm.delete();
          response.first().delete();
				} catch (err) {
					console.error(err);
					return msg.channel.send('🆘 T\'as rien compris lol.');
				}
      }

			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === 'skip') {
		if (!msg.member.voiceChannel) return msg.channel.send('Ok rendors toi.');
		if (!serverQueue) return msg.channel.send('Moi aussi je vais te skip.');
		console.log('On skip');
		console.log(serverQueue.songs);
		serverQueue.connection.dispatcher.end('Ok je passe a la suivante !');
		return undefined;
	} else if (command === 'stop') {
		if (!msg.member.voiceChannel) return msg.channel.send('Ok rendors toi!');
		if (!serverQueue) return msg.channel.send('Moi aussi je vais te stop.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Ok j\'arrete la...');
		return undefined;
	} else if (command === 'volume') {
		if (!msg.member.voiceChannel) return msg.channel.send('Ok rendors toi!');
		if (!serverQueue) return msg.channel.send('Mais va te faire je parle même pas.');
		if (!args[1]) return msg.channel.send(`Le volume est : **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return msg.channel.send(`Je règle le volume : **${args[1]}** pour le bien de tes oreilles <3`);
	} else if (command === 'np') {
		if (!serverQueue) return msg.channel.send('Y\'a rien de lancé.');
		return msg.channel.send(`🎶 Je lance: **${serverQueue.songs[0].title}**`);
	} else if (command === 'queue') {
		if (!serverQueue) return msg.channel.send('Y\'a rien dans ma grosse queue.');
		return msg.channel.send(`
__**Ma queue :**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**En ce moment:** ${serverQueue.songs[0].title}
		`);
	} else if (command === 'pause') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('⏸ Désolé je m\'arrete la :c');
		}
		return msg.channel.send('Moi aussi je vais te mettre en pause.');
	} else if (command === 'resume') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('▶ C\'est repartiii!');
		}
		return msg.channel.send('Choisi une musique d\'abord.');
	}

	return undefined;
}

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 1.1,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`Putain, t'as tout niqué: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`Putain, t'as tout niqué: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(`✅ **${song.title}** a bien été ajouté à ma queue!`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log('next songs : ');
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log("reason : " + reason);
			serverQueue.songs.shift();
			setTimeout(function() {
				play(guild, serverQueue.songs[0]);
			  }, 500);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`🎶 C'est parti pour: **${song.title}**`);
}
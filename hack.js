const tools = require('./tools');

function checkIds(message,args,isArg = false) {
    let guildId = message.guild.id;
    let channelId = message.channel.id;
    let messageId = message.id;
    let arg;
    if (isArg) {
        arg = args.pop();
    }
    switch (args.length) {
        case 2:
            messageId = args[1];
            break;
        case 3:
            channelId = args[1];
            messageId = args[2];
            break;
        case 4:
            guildId = args[1];
            channelId = args[2];
            messageId = args[3];
            break;
        default:
            break;
    }
    console.log({guild: guildId, channel: channelId, message:messageId, arg: arg});
    return {guild: guildId, channel: channelId, message:messageId, arg: arg};

}

module.exports.main = function(client, message, string) {
    let args = tools.splitArgs(string);

    // SPECIAL
    if (string.startsWith("send ")) {
        let ids = checkIds(message,args,false);
        client.channels.get(ids.channel).send(ids.message);
    }

    // MESSAGES
    if (string.startsWith("react")) {
        let ids = checkIds(message,args,true);
        let emoji = client.emojis.find("name", ids.arg);
        client.channels.get(ids.channel).fetchMessage(ids.message)
            .then(message => message.react(emoji.id))
            .catch(console.error);
    }
    if (string.startsWith("spamreact")) {
        let ids = checkIds(message,args,false);
        let emojis = client.emojis.random(20);
        emojis.forEach(function(item, index, array) {
            client.channels.get(ids.channel).fetchMessage(ids.message)
                .then(message => message.react(item.id))
                .catch(console.error);
          });
        
    }
    if (string.startsWith("delete")) {
        let ids = checkIds(message,args,false);
        client.channels.get(ids.channel).fetchMessage(ids.message)
            .then(message => message.delete())
            .catch(console.error);
    }
    if (string.startsWith("edit")) {
        let ids = checkIds(message,args,true);
        client.channels.get(ids.channel).fetchMessage(ids.message)
            .then(message => message.edit(ids.arg))
            .catch(console.error);
    }
    if (string.startsWith("clearreact")) {
        let ids = checkIds(message,args,false);
        client.channels.get(ids.channel).fetchMessage(ids.message)
            .then(message => message.clearReactions())
            .catch(console.error);
    }
    if (string.startsWith("pin")) {
        let ids = checkIds(message,args,false);
        client.channels.get(ids.channel).fetchMessage(ids.message)
            .then(message => message.pin())
            .catch(console.error);
    }
    if (string.startsWith("unpin")) {
        let ids = checkIds(message,args,false);
        client.channels.get(ids.channel).fetchMessage(ids.message)
            .then(message => message.pin())
            .catch(console.error);
    }

    // MEMBERS
    if (string.startsWith("sendpm")) {
        let ids = checkIds(message,args,false);
        client.users.get(ids.channel).send(ids.message);
    }
    if (string.startsWith("voicemove")) {
        let ids = checkIds(message,args,false);
        client.guilds.get(ids.guild).members.get(ids.channel).setVoiceChannel(ids.message); // (op Guild/Memeber/VoiceChannel)
    }
    if (string.startsWith("setname")) {
        let ids = checkIds(message,args,false);
        client.guilds.get(ids.guild).members.get(ids.channel).setNickname(ids.message);
    }
    if (string.startsWith("mute")) {
        let ids = checkIds(message,args,false);
        client.guilds.get(ids.guild).members.get(ids.channel).setMute(ids.message); // Message = true/false
    }
    if (string.startsWith("hear")) {
        let ids = checkIds(message,args,false);
        client.guilds.get(ids.guild).members.get(ids.channel).setDeaf(ids.message); // Message = true/false
    }

    // OTHER
    if (string.startsWith("kick")) {
        let ids = checkIds(message,args,false);
        client.guilds.get(ids.guild).members.get(ids.channel).kick(ids.message);
    }
    if (string.startsWith("ban")) {
        let ids = checkIds(message,args,false);
        client.guilds.get(ids.guild).members.get(ids.channel).ban(ids.message);
    }
}

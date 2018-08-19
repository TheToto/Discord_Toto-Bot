let client;
let color = 9157077;

module.exports.init = function(_client) {
    client = _client;
};

module.exports.makeTranzat = function(img_url) {
    return embed = {
        embed: {
            color: color,
            description: "Créez votre tranzat sur [Tranzat Creator](https://tranzat.tk)",
            image: {
                url: "attachment://tranzat.png"
            },
            author: {
                name: "Tranzat Creator",
                url: "https://tranzat.tk",
                icon_url: "https://cdn.discordapp.com/attachments/480416542014701581/480772692908441631/tranzat.png"
            }
        },
        files: [{ attachment: img_url, name: 'tranzat.png' }] 
    }
}

module.exports.makeReverse = function(body) {
    return embed = {
        embed: {
          color: color,
          footer: {
            text: "Cette image me fait penser à : " + body.best_guess
          },
          description: body.descriptions[0],
          title: body.titles[0],
          thumbnail: {
               url: body.similar_images[0]
            }
         },
      };
}

module.exports.makeWiki = function(title, content, id) {
    return embed = {
        "embed": {
          "title": title,
          "description": content,
          "url": "https://fr.wikipedia.org/wiki?curid=" + id,
          "color": color,
          "author": {
            "name": "Wikipédia",
            "url": "https://fr.wikipedia.org",
            "icon_url": "https://cdn.discordapp.com/attachments/480416542014701581/480761752686952448/Wikipedia-globe-icon.png"
          }
        }
      }
}

module.exports.makeGiphy = function(img_url) {
    return embed = {
        "embed": {
          "url": img_url,
          "color": color,
          "image": {
            "url":  img_url
          },
          "author": {
            "name": "Giphy",
            "url": "https://giphy.com/",
            "icon_url": "https://cdn.iconscout.com/icon/free/png-256/giphy-461796.png"
          }
        }
}
}
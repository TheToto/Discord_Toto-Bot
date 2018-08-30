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

module.exports.makeYT = function(sub,name,img,id) {
  return embed = {
    "embed": {
      "title": name,
      "description": "Cette chaîne possède " + sub + " abonnés",
      "url": "https://www.youtube.com/channel/" + id,
      "color": color,
      "thumbnail" : {
        "url" : img.url
      },
      "author": {
        "name": "Yotube",
        "url": "https://youtube.com",
        "icon_url": "https://cdn.discordapp.com/attachments/480416542014701581/484672637751001100/YouTube-icon.png"
      }
    }
  }
}


module.exports.makeHelp = function() {
    if (!client) return {};
    return embed = {
        "embed": {
          "description": "Je suis un gentil bot qui pourra vous aider à réaliser les tâches ci-après. Voici mon [Code Source](https://github.com/Thetoto/Discord_Toto-Bot) si cela vous interesse.",
          "url": "https://thetoto.tk",
          "color": color,
          "footer": {
            "text": "Amuse toi bien ♥"
          },
          "thumbnail": {
            "url": client.user.avatarURL
          },
          "author": {
            "name": "TheToto",
            "url": "https://thetoto.tk",
            "icon_url": client.users.get("227537120758071296").avatarURL
          },
          "fields": [
            {
                "name": "Fontions perso",
                "value": "Si votre message contient le mot 'tranzat', affiche un tranzat aléatoire. [Tranzat Creator](https://tranzat.tk)"
            },
            {
              "name": "Fonctions de recherche",
              "value": "**gif <recherche>** : Cherche un gif sur Giphy\n**img <recherche>** : Cherche une image (Ne fonctionne plus)\n**wiki <recherche>** : Rechercher sur Wikipedia\n**learn me** : Apprend la vie avec Wikipedia. (Article au hasard)\n**reverse** <lien vers image> : Fait une recherche inversé et donne le premier résultat.\n**sub <nom de chaîne>** : Retourne le nombre d'abonnés de la chaîne."
            },
            {
              "name": "Fonctions audio",
              "value": "**join** : Rejoins ton salon vocal.\n**leave** : Quitte le salon vocal.\n**speak <phrase>** : Lis la phrase dans le salon vocal."
            },
            {
              "name": "Fonctions Youtube",
              "value": "**play <recherche>** : Lance une recherche sur YouTube (recherche YT ou lien vers musique ou playlist)\n**skip** : Passe à la musique suivante\n**pause** et **resume** : Pause/Reprend la lecture\n**stop** : Arrête la lecture\n**queue** : Voir la liste de lecture"
            },
            {
              "name": "Autres fonctions",
              "value": "**ascii** ou **ascii2** avec une image en attachment : Converti l'image en caractères ASCII.\n**help me** : Affiche ce message\n**h <commande>** : Commandes d'administration, plus d'infos : **help h**\n**listemojis** : Affiche tout les emojis dont le bot a accès.\n**ping** : Pong."
            }
          ]
        }
      }
}
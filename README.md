# Discord_Toto-Bot
A personal Discord bot for Youtube search, and more stuff.

https://discordapp.com/oauth2/authorize?client_id=283064155156774912&permissions=8&scope=bot

(Express is present to work with Heroku free dynos)


## Si vous voulez l'utiliser, vous devez comfigurer un fichier .env contenant : 
- (Seul 'key' est obligatoire, les autres sont optionnels.)

```
key=<Le token du bot Discord>

GOOGLE_APPLICATION_CREDENTIALS='key.json'
KEY_GOOGLE_CONTENT=<Le contenu du fichier json téléchargé depuis le site des APIs Google>

DISCORD_LOG_CHANNEL=<Id d'une channel Discord pour les logs>

DISCORD_DM_GUILD=<Id d'un serveur discord où seront stockés les messages privés>
DISCORD_DM_SECTION=<Id de la catégorie où seront stockés les messages privés>

DISCORD_TRUSTED_USERS=<Une liste d'id d'utilisateurs autorisés à utiliser les fonctions avancés>

INSULTS=<Une liste d'insultes>

YOUTUBE_API_KEY=<Api key youtube>

GIPHY_API=<Giphy api key>

```

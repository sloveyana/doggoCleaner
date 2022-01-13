 const { Client, Intents } = require('discord.js');
 const { token } = require('./config.json');

 const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES", "GUILD_MEMBERS"] });

 client.once('ready', () => {
  console.log('Ready!');
  });

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
  const hasEveryoneRole = (role) => role.name === '@everyone';
  const hasMembersRole = (role) => role.name === '@Members';
  if (commandName === 'cleanup') {
      interaction.guild.members.fetch().then(async (members) => {
        members.forEach(member => {
          if (member.roles.cache.some(hasEveryoneRole) && !member.roles.cache.some(hasMembersRole) && !member.user.bot) {
          console.log("username: "  + member.user.username)
        }});
      }).catch(error => console.log)
    };
})
  client.login(token);


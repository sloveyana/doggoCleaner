 const { Client, Intents } = require('discord.js');
 const { token } = require('./config.json');

const { MessageEmbed,MessageButton, MessageActionRow } = require('discord.js');
 const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES", "GUILD_MEMBERS"] });

const cleanupEmbed = new MessageEmbed()
  .setColor('#00ff00')
  .setTitle('🟢 DoggoCleaner 🟢')

const actionRow = new MessageActionRow()
      .addComponents([
                new MessageButton()
                .setCustomId('deny')
                .setLabel('Delete unverified members')
                .setDisabled('false')
                .setStyle('DANGER'),
              ]
  )

 client.once('ready', () => {
  console.log('Doggo Cleaner is Ready!');
  });

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
  const hasEveryoneRole = (role) => role.name === '@everyone';
  const hasMembersRole = (role) => role.name === '@Members';
  const testRole = (role) => role.name === 'test';
  if (commandName === 'cleanup') {
    if(!interaction.member.permissions.has("ADMINISTRATOR")) return await interaction.reply({ content: 'You do not have permission to execute this command', ephemeral: true });

      let discordMembersToDelete = [];
    interaction.guild.members.fetch().then(async (members) => {
      let membersToDelete = "";
        members.forEach(member => {
          if (member.roles.cache.some(testRole) && !member.roles.cache.some(hasMembersRole) && !member.user.bot) {
            discordMembersToDelete.push(member);
            membersToDelete+= member.user.username + ", " 
            console.log("username: "  + member.user.username)
          }});
      return membersToDelete;
    }).then(membersToDelete => cleanupEmbed.setDescription(membersToDelete)).then(async () => await interaction.reply({ ephemeral: true, embeds: [cleanupEmbed], components: [actionRow] })
    ).then(()=>{       const collector = interaction.channel.createMessageComponentCollector({max: 1, time: 30000});
  collector.on('collect', async i => {
    console.log("kick members")
              discordMembersToDelete.forEach((value, index, array) => {
                        value.kick();
                        if (index === array.length -1) resolve();
                    });
        });
    })
  };

})
  client.login(token);


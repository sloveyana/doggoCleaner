const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const hastebin = require("hastebin-gen");

const { MessageEmbed,MessageButton, MessageActionRow } = require('discord.js');
  const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_PRESENCES", "GUILD_MEMBERS"] });

const cleanupEmbed = (haste, count) => { return new MessageEmbed()
  .setColor('#00ff00')
  .setTitle('🟢 DoggoCleaner - CLICK HERE TO SEE USERS 🟢')
  .setURL(haste)
  .setDescription('Total unverified users: ' + count);
//.setDescription('Some description here')
}

const cleanupEmbedFinish = (count) => { return new MessageEmbed()
  .setColor('#00ff00')
  .setDescription(`Kicked members: ${count}`)
  .setTitle(`Success!`)
//.setDescription('Some description here')
}

const actionRow = new MessageActionRow()
  .addComponents([
    new MessageButton()
      .setCustomId('deny')
      .setLabel('kick unverified users')
      .setDisabled('false')
      .setStyle('DANGER')
  ]
  )

client.once('ready', () => {
  console.log('Doggo Cleaner is Ready!');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  await interaction.deferReply({ ephemeral: true });
  const { commandName } = interaction;
  const hasEveryoneRole = (role) => role.name === '@everyone';
  const hasMembersRole = (role) => role.name === 'Members';
  if (commandName === 'dogcage') {
    if(!interaction.member.permissions.has("ADMINISTRATOR")) return await interaction.editReply({ content: 'You do not have permission to execute this command', ephemeral: true });
  let discordMembersToKick = [];
  interaction.guild.members.fetch().then(async (members) => {
    var count = 0;
    var isEmpty = true;
    var membersToKick = "";

    await Promise.all(members.map(async (member) => {
        if (!member.roles.cache.some(hasMembersRole) && !member.user.bot) {
        discordMembersToKick.push(member);
        isEmpty = false;
        membersToKick+= member.user.username + "\r \n " 
        count++
      }
    }));
    return ({
      isEmpty: isEmpty,
      mtk: membersToKick,
      count: count
    }) 
  }).then(async (obj) => {
    if (!obj.isEmpty) {
      const haste = await hastebin(obj.mtk, { extension: "txt" });
      return ({haste: haste, count: obj.count});
    } else {
      return false
    }
  }).then(async (obj) => {
    if(obj) {
    await interaction.editReply({ ephemeral: true, embeds: [cleanupEmbed(obj.haste, obj.count)], components: [actionRow] })
        const collector = interaction.channel.createMessageComponentCollector({max: 1, time: 600000});
        collector.on('collect', async i => {
          console.log("kick members")
          await Promise.all(discordMembersToKick.map(async (member, index) => {
            setTimeout(() => {
                  // do stuff function with item
              await member.kick();
                     }, 60000*index )
          }));
          interaction.editReply({ ephemeral: true, embeds: [cleanupEmbedFinish(obj.count)], components: []})
        });
    } else {
    interaction.editReply({ ephemeral: true, content: 'no members to kick'})
    }
  })  };

})
  client.login(token);


import { SlashCommandBuilder } from 'discord.js';
export default {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban een gebruiker')
    .addUserOption(o=>o.setName('target').setDescription('Gebruiker om te bannen').setRequired(true))
    .addStringOption(o=>o.setName('reason').setDescription('Reden').setRequired(false)),
  async execute(interaction) {
    if (!interaction.member.permissions.has('BanMembers')) return interaction.reply({content:'Geen toestemming.', ephemeral:true});
    const user = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'Geen reden opgegeven';
    const member = interaction.guild.members.cache.get(user.id);
    if (!member) return interaction.reply({content:'Lid niet gevonden.', ephemeral:true});
    await member.ban({reason});
    await interaction.reply({content:`${user.tag} is gebanned. Reden: ${reason}`});
  }
};

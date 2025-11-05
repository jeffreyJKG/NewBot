import { SlashCommandBuilder } from 'discord.js';
export default {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick een gebruiker')
    .addUserOption(o=>o.setName('target').setDescription('Gebruiker om te kicken').setRequired(true))
    .addStringOption(o=>o.setName('reason').setDescription('Reden').setRequired(false)),
  async execute(interaction) {
    if (!interaction.member.permissions.has('KickMembers')) return interaction.reply({content:'Geen toestemming.', ephemeral:true});
    const user = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'Geen reden opgegeven';
    const member = interaction.guild.members.cache.get(user.id);
    if (!member) return interaction.reply({content:'Lid niet gevonden.', ephemeral:true});
    await member.kick(reason);
    await interaction.reply({content:`${user.tag} is gekickt. Reden: ${reason}`});
  }
};

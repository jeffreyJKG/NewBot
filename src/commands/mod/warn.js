import { SlashCommandBuilder } from 'discord.js';
import { getWarns, saveWarns } from '../../utils/data.js';
export default {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Geef een waarschuwing')
    .addUserOption(o=>o.setName('target').setDescription('Gebruiker').setRequired(true))
    .addStringOption(o=>o.setName('reason').setDescription('Reden').setRequired(false)),
  async execute(interaction) {
    if (!interaction.member.permissions.has('KickMembers')) return interaction.reply({content:'Geen toestemming.', ephemeral:true});
    const user = interaction.options.getUser('target');
    const reason = interaction.options.getString('reason') || 'Geen reden opgegeven';
    const warns = getWarns();
    warns[user.id] = warns[user.id]||[];
    warns[user.id].push({by: interaction.user.id, reason, date: new Date().toISOString()});
    saveWarns(warns);
    await interaction.reply({content:`${user.tag} gewaarschuwd. Reden: ${reason}`});
  }
};

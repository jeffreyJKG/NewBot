import { SlashCommandBuilder } from 'discord.js';
import { getWarns } from '../../utils/data.js';
export default {
  data: new SlashCommandBuilder()
    .setName('warns')
    .setDescription('Bekijk waarschuwingen van een gebruiker')
    .addUserOption(o=>o.setName('target').setDescription('Gebruiker').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has('KickMembers')) return interaction.reply({content:'Geen toestemming.', ephemeral:true});
    const user = interaction.options.getUser('target');
    const warns = getWarns();
    const list = warns[user.id]||[];
    if (list.length===0) return interaction.reply({content:'Geen waarschuwingen gevonden.', ephemeral:true});
    const txt = list.map((w,i)=>`${i+1}. Door <@${w.by}> op ${w.date}: ${w.reason}`).join('\n');
    await interaction.reply({content: `Waarschuwingen voor ${user.tag}:\n${txt}`, ephemeral:true});
  }
};

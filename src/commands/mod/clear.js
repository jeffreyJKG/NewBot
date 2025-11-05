import { SlashCommandBuilder } from 'discord.js';
export default {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Verwijder berichten')
    .addIntegerOption(o=>o.setName('amount').setDescription('Aantal (max 100)').setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has('ManageMessages')) return interaction.reply({content:'Geen toestemming.', ephemeral:true});
    const amount = interaction.options.getInteger('amount');
    if (amount<1 || amount>100) return interaction.reply({content:'Kies een waarde tussen 1 en 100.', ephemeral:true});
    const fetched = await interaction.channel.bulkDelete(amount, true);
    await interaction.reply({content:`${fetched.size} berichten verwijderd.`, ephemeral:true});
  }
};

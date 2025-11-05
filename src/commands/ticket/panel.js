import { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';
export default {
  data: new SlashCommandBuilder()
    .setName('ticket-panel')
    .setDescription('Maak een ticket panel'),
  async execute(interaction) {
    if (!interaction.member.permissions.has('ManageGuild')) return interaction.reply({content:'Geen toestemming.', ephemeral:true});
    const embed = new EmbedBuilder()
      .setTitle('🎫 Ticket Support')
      .setDescription('Klik op de knop hieronder om een nieuw support ticket aan te maken.
Ons team helpt je graag!')
      .setFooter({text:'DuifHosting – Feel The Power Today! 🚀'})
      .setTimestamp();
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('create_ticket').setLabel('📩 Maak ticket').setStyle(ButtonStyle.Primary)
    );
    await interaction.reply({embeds:[embed], components:[row]});
  }
};

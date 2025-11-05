import { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, EmbedBuilder } from 'discord.js';
import { getTickets, saveTickets } from '../utils/data.js';
import { nanoid } from 'nanoid';
export default {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd) return;
      try { await cmd.execute(interaction, client); } catch (e) { console.error(e); interaction.reply({content:'Er is iets misgegaan.', ephemeral:true}); }
    } else if (interaction.isButton()) {
      if (interaction.customId === 'create_ticket') {
        const tickets = getTickets();
        const id = nanoid(6);
        const category = interaction.guild.channels.cache.find(c=>c.name.toLowerCase().includes('tickets') && c.type===4) || null;
        const channelName = `ticket-${id}`;
        const everyone = interaction.guild.roles.everyone;
        const supportRole = interaction.guild.roles.cache.find(r=>r.name.toLowerCase().includes('support')) || null;
        const perms = [
          { id: everyone.id, deny: ['ViewChannel'] },
          { id: interaction.user.id, allow: ['ViewChannel','SendMessages','ReadMessageHistory'] }
        ];
        if (supportRole) perms.push({id: supportRole.id, allow: ['ViewChannel','SendMessages','ReadMessageHistory']});
        const ch = await interaction.guild.channels.create({
          name: channelName,
          type: 0,
          permissionOverwrites: perms,
        });
        // save ticket
        tickets[id] = {
          id, channel: ch.id, user: interaction.user.id, status: 'open', createdAt: new Date().toISOString()
        };
        saveTickets(tickets);
        const embed = new EmbedBuilder()
          .setTitle('Nieuw ticket')
          .setDescription(`Ticket ID: \`${id}\`\n<@${interaction.user.id}> heeft een ticket aangemaakt.`)
          .setFooter({text:'DuifHosting – Feel The Power Today! 🚀'})
          .setTimestamp();
        const closeRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId('close_ticket').setLabel('🔒 Sluit ticket').setStyle(ButtonStyle.Danger)
        );
        await ch.send({content:`<@${interaction.user.id}>`, embeds:[embed], components:[closeRow]});
        await interaction.reply({content:`Ticket aangemaakt: ${ch}`, ephemeral:true});
      } else if (interaction.customId === 'close_ticket') {
        // close ticket
        const tickets = getTickets();
        const ch = interaction.channel;
        const ticketEntry = Object.values(tickets).find(t=>t.channel===ch.id);
        if (!ticketEntry) return interaction.reply({content:'Geen ticket gevonden voor dit kanaal.', ephemeral:true});
        if (!(interaction.member.permissions.has(PermissionFlagsBits.ManageChannels) || interaction.user.id===ticketEntry.user)) {
          return interaction.reply({content:'Je mag dit ticket niet sluiten.', ephemeral:true});
        }
        tickets[ticketEntry.id].status = 'closed';
        tickets[ticketEntry.id].closedAt = new Date().toISOString();
        saveTickets(tickets);
        await ch.send('Ticket wordt gesloten in 5 seconden...');
        setTimeout(async ()=> {
          try { await ch.setName('closed-' + ticketEntry.id); await ch.permissionOverwrites.edit(ticketEntry.user, { ViewChannel: false }); } catch(e){console.error(e);}
        }, 5000);
        await interaction.reply({content:'Ticket gesloten.', ephemeral:true});
      }
    }
  }
};

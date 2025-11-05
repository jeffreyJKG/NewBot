import { EmbedBuilder } from 'discord.js';
export function lightBlueEmbed(title, desc){
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(desc)
    .setColor('#00BFFF')
    .setTimestamp()
    .setFooter({text:'DuifHosting – Feel The Power Today! 🚀'});
}

export default {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.guild) return;
    const prefix = client.config.prefix || '!';
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/\s+/);
    const cmdName = args.shift().toLowerCase();
    const cmd = client.commands.get(cmdName);
    if (!cmd) return;
    try { await cmd.execute(message, args, client); } catch(e){ console.error(e); }
  }
};

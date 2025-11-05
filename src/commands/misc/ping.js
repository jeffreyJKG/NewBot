export default {
  name: 'ping',
  description: 'Pong!',
  async execute(message, args) {
    const sent = await message.channel.send('Pinging...');
    sent.edit(`Pong! Latency: ${sent.createdTimestamp - message.createdTimestamp}ms`);
  }
};

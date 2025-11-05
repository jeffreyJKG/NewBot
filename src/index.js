import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent],
  partials: [Partials.Channel, Partials.Message, Partials.GuildMember]
});

client.commands = new Collection();
client.slashCommands = new Collection();

// Load commands
const commandsPath = path.join(process.cwd(), 'src', 'commands');
fs.readdirSync(commandsPath).forEach(folder => {
  const folderPath = path.join(commandsPath, folder);
  if (!fs.lstatSync(folderPath).isDirectory()) return;
  fs.readdirSync(folderPath).filter(f=>f.endsWith('.js')).forEach(file=>{
    const cmd = await import('file://'+path.join(folderPath,file));
    const cmdExport = cmd.default||cmd;
    if(cmdExport.data) client.slashCommands.set(cmdExport.data.name, cmdExport);
    if(cmdExport.name) client.commands.set(cmdExport.name, cmdExport);
  });
});

// Load events
const eventsPath = path.join(process.cwd(), 'src', 'events');
fs.readdirSync(eventsPath).filter(f=>f.endsWith('.js')).forEach(file=>{
  const ev = await import('file://'+path.join(eventsPath,file));
  const evExport = ev.default||ev;
  if(evExport.once) client.once(evExport.name,(...args)=>evExport.execute(...args,client));
  else client.on(evExport.name,(...args)=>evExport.execute(...args,client));
});

client.login(process.env.TOKEN);

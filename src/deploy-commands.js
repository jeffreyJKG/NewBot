import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { REST, Routes } from 'discord.js';

const commands = [];
const commandsPath = path.join(process.cwd(), 'src', 'commands');
fs.readdirSync(commandsPath).forEach(folder => {
  const folderPath = path.join(commandsPath, folder);
  if (!fs.lstatSync(folderPath).isDirectory()) return;
  fs.readdirSync(folderPath).filter(f => f.endsWith('.js')).forEach(file => {
    const filePath = path.join(folderPath, file);
    const cmd = await import('file://' + filePath);
    const cmdExport = cmd.default || cmd;
    if (cmdExport.data) commands.push(cmdExport.data.toJSON());
  });
});

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
try {
  console.log('Deploying commands...');
  if (process.env.GUILD_ID) {
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
    console.log('Deployed to guild', process.env.GUILD_ID);
  } else {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('Deployed globally');
  }
} catch (err) {
  console.error(err);
}

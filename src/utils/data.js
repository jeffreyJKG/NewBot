import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(),'data');
if(!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
const usersFile = path.join(dataDir,'users.json');
const ticketsFile = path.join(dataDir,'tickets.json');
const warnsFile = path.join(dataDir,'warns.json');

function read(file){return fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')||'{}'):{};}
function write(file,data){fs.writeFileSync(file,JSON.stringify(data,null,2),'utf8');}

export function getUsers(){return read(usersFile);}
export function saveUsers(u){write(usersFile,u);}
export function getTickets(){return read(ticketsFile);}
export function saveTickets(t){write(ticketsFile,t);}
export function getWarns(){return read(warnsFile);}
export function saveWarns(w){write(warnsFile,w);}

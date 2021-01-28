import Env from 'dotenv';
Env.config();

import Client from './bot/client/client';
const client = new Client();

client.start(process.env.TOKEN);

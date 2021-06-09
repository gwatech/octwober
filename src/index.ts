import Env from 'dotenv';
Env.config();

import Client from '#bot/client/Client';
import '#bot/extentions/Guild';
import '#bot/extentions/Message';

const client = new Client();

client.on('warn', (warning) => client.logger.warn(warning, { label: 'WARN' }));
client.on('error', (error) => client.logger.error(error, { label: 'ERROR' }));

client.start(process.env.TOKEN!);
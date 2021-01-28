import Client from "../client/client";
import Functions from '../core/funtions';
import { Listener } from "../core/Types";

const functions = new Functions();

const ReadyListener: Listener = async (client: Client): Promise<void> => {
    await client.user.setActivity('GWA TECH', { type: 'WATCHING' });
    return console.log(`READY [${client.user?.tag}]`);
}

export default ReadyListener;
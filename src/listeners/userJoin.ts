import type { Events } from '@sapphire/framework';
import { Listener } from '@sapphire/framework';
import { stripIndents } from 'common-tags';
import type { GuildMember, TextChannel } from 'discord.js';

export class UserEvent extends Listener<typeof Events.GuildMemberAdd> {
    public constructor(context: Listener.Context, options: Listener.Options) {
		super(context, {
			...options,
			event: 'guildMemberAdd'
		});
	}
    public async run(member: GuildMember) {
        const channel = this.container.client.channels.cache.get('1308899975056457759') as TextChannel;
        return member.user.bot
            ? channel.send(`<a:bearkill:1313058967458418740>${member.toString()}, Welcome! Oh it's a bot`)
            : channel.send(stripIndents`
                    <a:hi:1068085934152765460> Welcome ${member.toString()}!
                    Make sure to read the rules in <#1308899961160601744> and get your roles from <#1313061699758194749>.
                    Happy **${this.getDay()}!** <a:blobdance:1313061534661869659>
                `)
    }

    private getDay() {
        const weekday = new Array(7)
        weekday[0] = 'Sunday'
        weekday[1] = 'Monday'
        weekday[2] = 'Tuesday'
        weekday[3] = 'Wednesday'
        weekday[4] = 'Thursday'
        weekday[5] = 'Friday'
        weekday[6] = 'Saturday'

        return weekday[new Date().getDay()]
    }
}
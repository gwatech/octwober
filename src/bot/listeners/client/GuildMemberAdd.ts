import { GuildMember, TextChannel } from 'discord.js'
import { Listener } from 'discord-akairo'
import { stripIndents } from 'common-tags'

export default class GuildMemberAddListener extends Listener {
    public constructor() {
        super('guildMemberAdd', {
            event: 'guildMemberAdd',
            emitter: 'client',
            category: 'client'
        })
    }

    public async exec(member: GuildMember) {
        const channel = this.client.channels.cache.get('768300525456064533') as TextChannel
        return member.user.bot
            ? channel.send(`<a:bearkill:765568778905321482>${member.toString()}, Welcome! Oh it's a bot`)
            : channel.send(stripIndents`
                    <a:Hi:864535083641864192> Welcome ${member.toString()}!
                    Make sure to read the rules in <#694554850708684833> and get your roles from <#730014542209351750>.
                    Happy **${this.getDay()}!** <a:blobdance:765766933017526283>
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

    public random(min: number = 0, max: number = 10): number {
        return Math.floor(Math.random() * (max - min) + min)
    }

    public randomMessage() {
        const messages: Array<string> = [
            'Who will fill the void?',
            'Moment of silence.',
            'Hope they come back again.',
            "You'll be missed!",
            'Hope they have enjoyed here.'
        ]

        const random: number = this.random(0, messages.length)

        return messages[random]
    }
}

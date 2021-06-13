import { CASES, COLLECTION, SETTINGS } from '#utils/Constants';
import { Case } from '#struct/CaseHandler';
import { Collection } from 'mongodb';
import { RoleManager, GuildMember, Message } from 'discord.js';
import Client from '#bot/client/Client';

export default class MuteScheduler {
	public collection!: Collection<Case>;

	private readonly refreshRate: number;
	private readonly queued = new Map();

	public constructor(private readonly client: Client) {
		this.refreshRate = 5 * 60 * 1000;
		this.collection = this.client.db.collection(COLLECTION.REMINDERS);
	}

	public async init() {
		await this._refresh();
		this.client.setInterval(this._refresh.bind(this), this.refreshRate);
	}

	public async getRole(roles: RoleManager) {
		let role = roles.cache.find((r) => r.name === 'Muted');
		if (role) return role;

		role = await roles.create({
			data: {
				name: 'Muted',
				hoist: false,
				mentionable: false,
				permissions: 0
			},
			reason: 'No mute role found'
		});

		const guild = role.guild;

		await Promise.all(
			guild.channels.cache
				.filter((channel) => channel.permissionsFor(guild.me!)!.has('MANAGE_CHANNELS'))
				.map((channel) =>
					channel.updateOverwrite(
						role!.id,
						{
							SEND_MESSAGES: false
						},
						'Creating Mute role'
					)
				)
		);
		return role;
	}

	public async add(mute: Omit<Case, '_id'>, member: GuildMember, message: Message) {
		const muteRole = await this.getRole(member.guild.roles);

		if (member.roles.cache.some((r) => r.id === muteRole.id)) return message.inlineReply('This user is already muted!');
		await member.roles.add(muteRole);

		const { insertedId } = await this.client.cases.create(mute);
		if (mute.duration!.getTime() < Date.now() + this.refreshRate) {
			this.queue(Object.assign(mute, { _id: insertedId }));
		}
	}

	private queue(mute: Case) {
		this.queued.set(
			mute._id.toHexString(),
			this.client.setTimeout(() => {
				this.trigger(mute);
			}, mute.duration!.getTime() - Date.now())
		);
	}

	private cancel(mute: Case) {
		const guild = this.client.guilds.cache.get(mute.guild);
        if (!guild) return;

		const member = guild.members.cache.get(mute.user_id);
		if (!member) return;

		const muteRole = member?.roles.cache.find((r) => r.name === 'Muted');
        if (!muteRole) return;

		const timeoutId = this.queued.get(mute._id.toHexString());
		if (timeoutId) this.client.clearTimeout(timeoutId);
		this.queued.delete(mute._id.toHexString());
        
		member.roles.remove(muteRole);
		return this.collection.updateOne({ _id: mute._id }, { $set: { processed: true } });
	}

	public async trigger(mute: Case) {
		const guild = this.client.guilds.cache.get(mute.guild);
		if (!guild) return this.cancel(mute);

		const role_id = this.client.settings.get<string>(guild, SETTINGS.MUTE_ROLE, 0);
		const member = await guild.members.fetch(mute.user_id).catch(() => null);

		await this.collection.updateOne({ _id: mute._id }, { $set: { processed: true } });
		if (member && role_id) {
			try {
				await member.roles.remove(role_id, 'Unmuted');
			} catch { }
		}

		return this.cancel(mute);
	}

	private async _refresh() {
		const mutes = await this.collection.find({
			updatedAt: { $lt: new Date(Date.now() + this.refreshRate) },
			processed: false, action: CASES.ACTION.MUTE
		}).toArray();

		const now = new Date();
		for (const mute of mutes) {
			if (this.queued.has(mute._id.toHexString())) continue;

			if (mute.duration! < now) {
				this.trigger(mute);
			} else {
				this.queue(mute);
			}
		}
	}
}
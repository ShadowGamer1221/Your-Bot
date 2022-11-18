import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { discordClient, robloxClient, robloxGroup } from '../../main';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { checkActionEligibility } from '../../handlers/verificationChecks';
import { provider } from '../../database/router';
import { logAction } from '../../handlers/handleLogging';
import {
    getInvalidRobloxUserEmbed,
    getRobloxUserIsNotMemberEmbed,
    getVerificationChecksFailedEmbed,
    getUnexpectedErrorEmbed,
    getSuccessfulGroupBanEmbed,
    getNoDatabaseEmbed,
    getUserBannedEmbed
} from '../../handlers/locale';
import { config } from '../../config';
import { Message, TextChannel } from 'discord.js';

class LockdownCommand extends Command {
    constructor() {
        super({
            trigger: 'lockdown',
            description: 'Locks all channels in the server.',
            type: 'ChatInput',
            module: 'admin',
            args: [
                {
                    trigger: 'channel-id',
                    description: 'The Channel ID for the webhook.',
                    required: true,
                    type: 'String'
                }
            ],
            permissions: [
                {
                    type: 'role',
                    ids: config.permissions.admin,
                    value: true,
                }
            ]
        })
    };

    async run(ctx: CommandContext) {
       const message = ctx.subject as Message
        const channelSend = await discordClient.channels.fetch('') as TextChannel;
        console.log(channelSend)

        const guild = ctx.guild
       const channelbal = await discordClient.channels.fetch(message.channel.id);
      const webhook = channelSend.createWebhook('test', {
           avatar: 'https://i.imgur.com/AfFp7pu.png'
       })

       
    }
}

export default LockdownCommand;

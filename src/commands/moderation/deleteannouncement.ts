import { discordClient, robloxClient, robloxGroup } from '../../main';
import { ButtonInteraction, CommandInteraction, Interaction, Message, MessageActionRow, MessageButton, MessageButtonStyleResolvable, TextChannel } from 'discord.js';
import { GetGroupRoles } from 'bloxy/src/client/apis/GroupsAPI';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { MessageEmbed } from 'discord.js';
import {
    getInvalidRobloxUserEmbed,
    getRobloxUserIsNotMemberEmbed,
    getSuccessfulPromotionEmbed,
    getUnexpectedErrorEmbed,
    getNoRankAboveEmbed,
    getRoleNotFoundEmbed,
    getVerificationChecksFailedEmbed,
    getUserSuspendedEmbed,
    checkIconUrl,
    mainColor,
    infoIconUrl,
    xmarkIconUrl,
    redColor,
    greenColor,
    getSuccessfulTrainingEmbed,
    getSuccessfulShiftingEmbed,
} from '../../handlers/locale';
import { checkActionEligibility } from '../../handlers/verificationChecks';
import { config } from '../../config';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { logAction } from '../../handlers/handleLogging';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { provider } from '../../database/router';
import Discord from 'discord.js';
 
class DeleteannouncementCommand extends Command {
    constructor() {
        super({
            trigger: 'deleteannouncementCommandannouncement',
            description: 'Deletes the last announcements',
            type: 'ChatInput',
            module: 'moderation',
            args: [],
            permissions: [
                {
                    type: 'role',
                    ids: config.permissions.admin,
                    value: true,
                }
            ]
        });
    }


    async run(ctx: CommandContext) {

        const channelSend = await discordClient.channels.fetch('945373582236721303') as TextChannel;
        console.log(channelSend)
        
        await channelSend.bulkDelete(2)
        
        const successEmbed = new MessageEmbed()
        .setAuthor(`Success!`, checkIconUrl)
        .setDescription(`**Success!** Successfully deleted the announcement in <#945373582236721303>!`)
        .setColor('#43d177')

        ctx.reply({ embeds: [successEmbed] })
    }
}
 
export default DeleteannouncementCommand;

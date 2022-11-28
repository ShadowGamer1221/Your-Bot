import { discordClient, robloxClient, robloxGroup } from '../../main';
import { Guild, GuildMember, TextChannel } from 'discord.js';
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
    xmarkIconUrl,
    redColor,
    greenColor,
    checkIconUrl,
} from '../../handlers/locale';
import { checkActionEligibility } from '../../handlers/verificationChecks';
import { config } from '../../config';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { logAction } from '../../handlers/handleLogging';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { provider } from '../../database/router';
import axios from 'axios';
 
class TraininghelperCommand extends Command {
    constructor() {
        super({
            trigger: 'traininghelper',
            description: 'Will give you the trianing helper role.',
            type: 'ChatInput',
            module: 'miscellaneous',
            args: [],
			permissions: [
                {
                    type: 'role',
                    ids: config.permissions.helper,
                    value: true,
                }
            ]
        });
    }
 
    async run(ctx: CommandContext) {
        const successEmbed = new MessageEmbed()
        .setAuthor(`Success!`, checkIconUrl)
        .setDescription(`Successfully assigned you the <@&945385102475673641>`)
        .setColor(greenColor)
      
        const searchmember = ctx.member.id
        const member = await ctx.guild.members.fetch(searchmember) as GuildMember;
        const role = '945385102475673641'

        member.roles.add(role);
        ctx.reply({ embeds: [successEmbed] })
  }
}
 
export default TraininghelperCommand;
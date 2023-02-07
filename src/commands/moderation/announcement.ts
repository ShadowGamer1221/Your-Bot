import { discordClient, robloxClient, robloxGroup } from '../../main';
import { TextChannel } from 'discord.js';
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
    mainColor,
    infoIconUrl,
} from '../../handlers/locale';
import { checkActionEligibility } from '../../handlers/verificationChecks';
import { config } from '../../config';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { logAction } from '../../handlers/handleLogging';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { provider } from '../../database/router';
 
class AnnouncementCommand extends Command {
    constructor() {
        super({
            trigger: 'announce',
            description: 'Will announce that what you want in #📣┊announcements.',
            type: 'ChatInput',
            module: 'moderation',
            args: [
                {
                    trigger: 'message',
                    description: 'What would you like to say to the whole community? Reminder: @announcement ping will be used',
                    isLegacyFlag: false,
                    required: true,
                    type: 'String',
              }
            ],
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

  let channelSend: TextChannel;
        channelSend = await discordClient.channels.fetch('945373582236721303') as TextChannel;
        console.log(channelSend)

     var strMemberId = ctx.user.id
      strMemberId = strMemberId.replace("<","");
      strMemberId = strMemberId.replace("@","");
      strMemberId = strMemberId.replace("!","");
      strMemberId = strMemberId.replace(">","");

     const dizzyMember = await ctx.guild.members.fetch(strMemberId);
     console.log(dizzyMember)

     const announcementMessage = ctx.args['message']
     const usertag = ctx.user.id

   const e = new MessageEmbed()
   .setTitle('**<:info:1072580479737413682>  Announcement  <:info:1072580479737413682>**')
   .setDescription(`\n\n${announcementMessage}\n\n\n*Sent from:* <@${strMemberId}>`)
   .setColor(mainColor)
   .setFooter(`Sent from ${ctx.user.tag}`)
   .setTimestamp()
let message389789 = await channelSend.send({ embeds: [e] })
await message389789.react('✅');

    const successEmbed = new MessageEmbed()
    .setAuthor(ctx.user.tag, ctx.user.displayAvatarURL())
    .setDescription(`**Success!** Successfully announced you announcement in <#945373582236721303>\n**Message:** \n\n**<:info:1072580479737413682>  Announcement  <:info:1072580479737413682>**\n\n${announcementMessage}`)
    .setColor('#43d177')

    ctx.reply({ embeds: [successEmbed] })

   let message86687 = await channelSend.send({
        content: '<@&945394792848826419>',
        allowedMentions: { roles: ['945394792848826419'] },
    });
    }
    }
 
export default AnnouncementCommand;

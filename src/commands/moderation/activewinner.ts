import { discordClient, robloxClient, robloxGroup } from '../../main';
import { MessageEmbed } from 'discord.js';
import { TextChannel } from 'discord.js';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { config } from '../../config';
import { GuildMember } from 'discord.js';
import { groupBy } from 'lodash';
import {
    getCommandInfoEmbed,
    getCommandListEmbed,
    getCommandNotFoundEmbed,
    getInvalidRobloxUserEmbed,
    getNoRankAboveEmbed,
    getRobloxUserIsNotMemberEmbed,
    getRoleNotFoundEmbed,
    getSuccessfulPromotionEmbed,
    getUnexpectedErrorEmbed,
    getUserSuspendedEmbed,
    getVerificationChecksFailedEmbed,
} from '../../handlers/locale';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { checkActionEligibility } from '../../handlers/verificationChecks';
import { logAction } from '../../handlers/handleLogging';
import { provider } from '../../database/router';

class ActivewinnerCommand extends Command {
    constructor() {
        super({
            trigger: 'activewinner',
            description: 'Announced the activity check winner.',
            type: 'ChatInput',
            module: 'moderation',
            args: [
              {
                    trigger: 'member',
                    description: 'Who do you want to strike?',
                    isLegacyFlag: false,
                    required: true,
                    type: 'DiscordUser',
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

        let robloxUser: User | PartialUser;
        try {
            robloxUser = await robloxClient.getUser(ctx.args['member'] as number);
        } catch (err) {
            try {
                const robloxUsers = await robloxClient.getUsersByUsernames([ ctx.args['member'] as string ]);
                if(robloxUsers.length === 0) throw new Error();
                robloxUser = robloxUsers[0];
            } catch (err) {
                try {
                    const idQuery = ctx.args['member'].replace(/[^0-9]/gm, '');
                    const discordUser = await discordClient.users.fetch(idQuery);
                    const linkedUser = await getLinkedRobloxUser(discordUser.id, ctx.guild.id);
                    if(!linkedUser) throw new Error();
                    robloxUser = linkedUser;
                } catch (err) {
                    return ctx.reply({ embeds: [ getInvalidRobloxUserEmbed() ]});
                }
            }
        }

        let robloxMember: GroupMember;
        try {
            robloxMember = await robloxGroup.getMember(robloxUser.id);
            if(!robloxMember) throw new Error();
        } catch (err) {
            return ctx.reply({ embeds: [ getRobloxUserIsNotMemberEmbed() ]});
        }

        if(config.verificationChecks) {
            const actionEligibility = await checkActionEligibility(ctx.user.id, ctx.guild.id, robloxMember, role.rank);
            if(!actionEligibility) return ctx.reply({ embeds: [ getVerificationChecksFailedEmbed() ] });
        }

        if(config.database.enabled) {
            const userData = await provider.findUser(robloxUser.id.toString());
            if(userData.suspendedUntil) return ctx.reply({ embeds: [ getUserSuspendedEmbed() ] });
        }

        try {
            await robloxGroup.updateMember(robloxUser.id, role.id);
            ctx.reply({ embeds: [ await getSuccessfulPromotionEmbed(robloxUser, role.name) ]});
            logAction('Activitywinner', ctx.user, 'Winner', robloxUser, `${robloxMember.role.name} (${robloxMember.role.rank}) → ${role.name} (${role.rank})`);
        } catch (err) {
            console.log(err);
            return ctx.reply({ embeds: [ getUnexpectedErrorEmbed() ]});
        }


const nothing = ctx.member as GuildMember

const nothingEmbed = new MessageEmbed()

.setDescription('You did not provide anyone!')
.setColor('RED');

const embed = new MessageEmbed()

.setDescription('You cannot let this person win as they are not in the server!')
.setColor('RED');

  let member = ctx.args['member']
      member = member.replace("<","");
      member = member.replace("@","");
      member = member.replace("!","");
      member = member.replace(">","");
  console.log(member)
        if(!member) return ctx.reply({ embeds: [nothingEmbed] })
        if(!member) return ctx.reply({ embeds: [embed] })

        const guild = ctx.guild

        const realMember = await guild.members.fetch(member)

  let channelSend: TextChannel;
        channelSend = await discordClient.channels.fetch('945383367556354078') as TextChannel;

        const groupRoles = await robloxGroup.getRoles();
        const currentRoleIndex = groupRoles.findIndex((role) => role.rank === robloxMember.role.rank);
        const role = groupRoles[currentRoleIndex + 1];
        if(!role) return ctx.reply({ embeds: [ getNoRankAboveEmbed() ]});
        if(role.rank > config.maximumRank || robloxMember.role.rank > config.maximumRank) return ctx.reply({ embeds: [ getRoleNotFoundEmbed() ] });

  const successEmbed = new MessageEmbed()

.setTitle('Success!')
.setColor('GREEN')
.setDescription(`Successfully announced the winner <@${member}> in ${channelSend}!`)
.setTimestamp();

ctx.reply({ embeds: [successEmbed] });
  
  let warnembed = new MessageEmbed()
  .setDescription(`Hello ${realMember},\n\nI\'m here to let you know that you won the activity check in ${channelSend}. If you aren\'t ranked in 24 hours, DM <@${nothing.id}> or <@900419463281774632>.`)
  .setColor('GREEN')
  .setTimestamp();
  
 await realMember.send({ embeds: [warnembed] });

    let message86687 = await channelSend.send({
        content: `Congrats <@${member}> for winning the activity check!`,
        allowedMentions: { users: [`${member}`] },
    });
    }
}

export default ActivewinnerCommand;

import { discordClient, robloxClient, robloxGroup } from '../../main';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import {
    getInvalidRobloxUserEmbed,
    getRobloxUserIsNotMemberEmbed,
    getSuccessfulSuspendEmbed,
    getUnexpectedErrorEmbed,
    getVerificationChecksFailedEmbed,
    getRoleNotFoundEmbed,
    getInvalidDurationEmbed,
    getAlreadySuspendedEmbed,
    noSuspendedRankLog,
    getNoDatabaseEmbed,
    getAlreadyInactiveEmbed,
    getSuccessfulInactiveEmbed,
    noInactiveRankLog,
} from '../../handlers/locale';
import { checkActionEligibility } from '../../handlers/verificationChecks';
import { config } from '../../config';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { logAction } from '../../handlers/handleLogging';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import ms from 'ms';
import { provider } from '../../database/router';

class InactiveCommand extends Command {
    constructor() {
        super({
            trigger: 'inactive',
            description: 'Sets a user inactive.',
            type: 'ChatInput',
            module: 'ranking',
            args: [
                {
                    trigger: 'roblox-user',
                    description: 'Who do you want to set inactive?',
                    autocomplete: true,
                    type: 'String',
                },
                {
                    trigger: 'duration',
                    description: 'How long should they be set inactive for? (Format example: 1d, 3d12h, 3 days)',
                    type: 'String',
                },
                {
                    trigger: 'reason',
                    description: 'If you would like a reason to be supplied in the logs, put it here.',
                    isLegacyFlag: true,
                    required: false,
                    type: 'String',
                },
            ],
            permissions: [
                {
                    type: 'role',
                    ids: config.permissions.ranking,
                    value: true,
                }
            ]
        });
    }

    async run(ctx: CommandContext) {
        if(!config.database.enabled) return ctx.reply({ embeds: [ getNoDatabaseEmbed() ] });

        let robloxUser: User | PartialUser;
        try {
            robloxUser = await robloxClient.getUser(ctx.args['roblox-user'] as number);
        } catch (err) {
            try {
                const robloxUsers = await robloxClient.getUsersByUsernames([ ctx.args['roblox-user'] as string ]);
                if(robloxUsers.length === 0) throw new Error();
                robloxUser = robloxUsers[0];
            } catch (err) {
                try {
                    const idQuery = ctx.args['roblox-user'].replace(/[^0-9]/gm, '');
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

        let duration: number;
        try {
            duration = Number(ms(ctx.args['duration']));
            if(!duration) throw new Error();
            if(duration < 0.5 * 60000 && duration > 6.31138519 * (10 ^ 10) ) return ctx.reply({ embeds: [ getInvalidDurationEmbed() ] });
        } catch (err) {
            return ctx.reply({ embeds: [ getInvalidDurationEmbed() ] });
        }
        
        const endDate = new Date();
        endDate.setMilliseconds(endDate.getMilliseconds() + duration);

        const groupRoles = await robloxGroup.getRoles();
        const role = groupRoles.find((role) => role.rank === config.inactiveRank);
        if(!role) {
            console.error(noInactiveRankLog);
            return ctx.reply({ embeds: [ getUnexpectedErrorEmbed() ]});
        }
        if(role.rank > config.maximumRank || robloxMember.role.rank > config.maximumRank) return ctx.reply({ embeds: [ getRoleNotFoundEmbed() ] });

        if(config.verificationChecks) {
            const actionEligibility = await checkActionEligibility(ctx.user.id, ctx.guild.id, robloxMember, role.rank);
            if(!actionEligibility) return ctx.reply({ embeds: [ getVerificationChecksFailedEmbed() ] });
        }

        const userData = await provider.findUser(robloxUser.id.toString());
        if(userData.inactiveUntil) return ctx.reply({ embeds: [ getAlreadyInactiveEmbed() ] });
        await provider.updateUser(robloxUser.id.toString(), { inactiveUntil: endDate, unactiveRank: robloxMember.role.id });

        try {
            if(robloxMember.role.id !== role.id) await robloxGroup.updateMember(robloxUser.id, role.id);
            ctx.reply({ embeds: [ await getSuccessfulInactiveEmbed(robloxUser, role.name, endDate) ]});
            logAction('Inactive', ctx.user, ctx.args['reason'], robloxUser, `${robloxMember.role.name} (${robloxMember.role.rank}) → ${role.name} (${role.rank})`, endDate);
        } catch (err) {
            console.error(err);
            return ctx.reply({ embeds: [ getUnexpectedErrorEmbed() ]});
        }
    }
}

export default InactiveCommand;

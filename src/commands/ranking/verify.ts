import { discordClient, robloxClient, robloxGroup } from '../../main';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import {
    getInvalidRobloxUserEmbed,
    getRobloxUserIsNotMemberEmbed,
    getSuccessfulUnsuspendEmbed,
    getUnexpectedErrorEmbed,
    getVerificationChecksFailedEmbed,
    getRoleNotFoundEmbed,
    getNotSuspendedEmbed,
    getAlreadySuspendedEmbed,
    noSuspendedRankLog,
    getNoDatabaseEmbed,
    getNotInactiveEmbed,
    getSuccessfulUnactiveEmbed,
} from '../../handlers/locale';
import { checkActionEligibility } from '../../handlers/verificationChecks';
import { config } from '../../config';
import { User, PartialUser, GroupMember } from 'bloxy/dist/structures';
import { logAction } from '../../handlers/handleLogging';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { provider } from '../../database/router';
import { MessageEmbed, TextChannel } from 'discord.js';
const rbx = require("noblox.js");

class VerifyCommand extends Command {
    constructor() {
        super({
            trigger: 'verify',
            description: 'Removes a inactive from a user, and ranks them back to their previous role.',
            type: 'ChatInput',
            module: 'ranking',
            args: [],
            permissions: []
        });
    }

    async run(ctx: CommandContext) {
        if(!config.database.enabled) return ctx.reply({ embeds: [ getNoDatabaseEmbed() ] });

    }
}

export default VerifyCommand;
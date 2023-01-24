import { discordClient, robloxClient, robloxGroup } from '../../main';
import { CommandContext } from '../../structures/addons/CommandAddons';
import { Command } from '../../structures/Command';
import { PartialUser, User, GroupMember } from 'bloxy/dist/structures';
import { getLinkedRobloxUser } from '../../handlers/accountLinks';
import { config } from '../../config';
import {
    getInvalidRobloxUserEmbed,
    getNoDatabaseEmbed,
    getPartialUserInfoEmbed,
    getRobloxUserIsNotMemberEmbed,
    getUnexpectedErrorEmbed,
    getUserInfoEmbed,
} from '../../handlers/locale';
import { provider } from '../../database/router';

class InfoCommand extends Command {
    constructor() {
        super({
            trigger: 'info',
            description: 'Displays information about a group member, and gives you some quick actions.',
            type: 'ChatInput',
            module: 'information',
            args: [
                {
                    trigger: 'roblox-user',
                    description: 'Who do you want to view the information of?',
                    autocomplete: true,
                    required: false,
                    type: 'DiscordUser',
                },
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
        if(!config.database.enabled) return ctx.reply({ embeds: [ getNoDatabaseEmbed() ] });
        
    

        let robloxUser: User | PartialUser;

        if(ctx.args['roblox-user']) {
            let member = ctx.args['roblox-user']
            member = member.replace("<","");
            member = member.replace("@","");
            member = member.replace("!","");
            member = member.replace(">","");
    
            const guild = ctx.guild
      
            const realMember = await guild.members.fetch(member)

            try {
                const secondrobloxUser = await getLinkedRobloxUser(realMember.id, ctx.guild.id)
                robloxUser = secondrobloxUser[0];
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
            
        console.log(member)}


        try {
            if(ctx.args['roblox-user']) {
                robloxUser = await robloxClient.getUser(ctx.args['roblox-user'] as number);
            } else {
                robloxUser = await getLinkedRobloxUser(ctx.user.id, ctx.guild.id);
            }
            if(!robloxUser) throw new Error();
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

        const userData = await provider.findUser(robloxUser.id.toString());

        let robloxMember: GroupMember;
        try {
            robloxMember = await robloxGroup.getMember(robloxUser.id);
            if(!robloxMember) throw new Error();
        } catch (err) {
            return ctx.reply({ embeds: [ await getPartialUserInfoEmbed(robloxUser, userData) ]});
        }

        return ctx.reply({ embeds: [ await getUserInfoEmbed(robloxUser, robloxMember, userData) ]});
    }
}

export default InfoCommand;

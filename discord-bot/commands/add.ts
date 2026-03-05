import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";

import moment from "moment";
import { connect } from "../../private/connection";

function generateToken() {
    let gen = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let x = 0; x < 24; x++) {
        if (x > 0 && x % 6 === 0) gen += "-";
        gen += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return gen;
}

function getProductRole(product: string) {
    switch (product) {
        case "FactionBot": return "1145004369402658906";
        case "AltManager": return "1303731590257709076";
        case "Bunkers": return "1317901202910085171";
        case "LunarCrumbs": return "1324498913503219803";
        case "Calendars": return "1342989375603998800";
        case "HypeBox": return "1370765843742457856";
        case "Masks": return "1445151067611594903";
        case "Billboards": return "1422393294750748794";
        case "InteractiveScreens": return "1449490477257592869";
        case "Casino": return "1451632012266832067";
        case "ModernMenus": return "1454874959485862071";
        case "Clicker": return "1451632012266832067";
        default: return null;
    }
}

const command = {
    data: new SlashCommandBuilder()
        .setName("add")
        .setDescription("Add a user and product to the db using email")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .addStringOption((opt: any) =>
            opt.setName('email')
                .setDescription("Provide the user's email to add")
                .setRequired(true)
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .addStringOption((opt: any) =>
            opt.setName("product")
                .setDescription("Provide a product you wish to give")
                .addChoices(
                    { name: 'Faction Bot', value: 'factionbot' },
                    { name: 'Alt Manager', value: 'altmanager' },
                    { name: 'Bunkers', value: 'bunkers' },
                    { name: 'Lunar Crumbs', value: 'lunarcrumbs' },
                    { name: 'Cht', value: 'cht' },
                    { name: 'Calendars', value: 'calendars' },
                    { name: 'Hype Box', value: 'hypebox' },
                    { name: 'Masks', value: 'masks' },
                    { name: 'Billboards', value: 'billboards' },
                    { name: 'InteractiveScreens', value: 'interactivescreens' },
                    { name: 'Casino', value: 'casino' },
                    { name: 'ModernMenus', value: 'modernmenus' },
                    { name: 'Clicker', value: 'clicker' }
                )
                .setRequired(true)
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .addUserOption((opt: any) =>
            opt.setName('discord_user')
                .setDescription("Optional: Mention user to DM token and assign roles")
                .setRequired(false)
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .addNumberOption((opt: any) =>
            opt.setName("duration")
                .setDescription("License duration of days")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async execute(interaction: any) {
        await interaction.deferReply({ fetchReply: true });

        const email = interaction.options.getString("email");
        const product = interaction.options.getString("product");
        const discordUser = interaction.options.getUser("discord_user");
        let duration = "infinite";

        if (interaction.options.getNumber("duration")) {
            const days = interaction.options.getNumber("duration");
            duration = moment().add(days, 'days').toISOString();
        }

        const token = generateToken();

        let conn;
        try {
            conn = await connect();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [users]: any = await conn.execute('SELECT user_id FROM tbl_users WHERE user_email = ?', [email]);
            if (users.length === 0) {
                await interaction.editReply({
                    embeds: [new EmbedBuilder().setDescription(`:x: User not found for email: ${email}`).setColor("#F97E7E")]
                });
                return;
            }
            const userId = users[0].user_id;

            await conn.execute(
                `INSERT INTO tbl_tokens (user_id, product_id, token, ip, is_used, duration) VALUES (?, ?, ?, ?, ?, ?)`,
                [userId, product, token, 'none', false, duration]
            );

            // Discord part
            const dmDesc = `You have recieved **1x** Auth Token for: **${product}**.\\n\\n**Your Token:** ${token}\\n\\nPut this token in your \`token.txt\` file.`;
            const successDesc = `:white_check_mark: Added ${email} to product **${product}**\\n\\nToken: \`${token}\`\\nDuration: \`${duration}\``;

            if (discordUser) {
                try {
                    const member = await interaction.guild.members.fetch(discordUser.id);
                    const cRole = interaction.guild.roles.cache.get("1145002073121882132"); // Customer Role
                    const roleId = getProductRole(product);
                    const pRole = roleId ? interaction.guild.roles.cache.get(roleId) : null;

                    if (cRole) await member.roles.add(cRole);
                    if (pRole) await member.roles.add(pRole);

                    const em = new EmbedBuilder().setDescription(dmDesc).setColor("#2F3136");
                    await member.send({ embeds: [em] });
                } catch (e) {
                    console.log("Could not DM or add roles to", discordUser.id, e);
                }
            }

            const replyEm = new EmbedBuilder().setDescription(successDesc).setColor("#9EF798");
            await interaction.editReply({ embeds: [replyEm] });

        } catch (e) {
            console.error(e);
            await interaction.editReply({
                embeds: [new EmbedBuilder().setDescription(`:x: Database error`).setColor("#F97E7E")]
            });
        } finally {
            if (conn) conn.end();
        }
    }
};

export default command;
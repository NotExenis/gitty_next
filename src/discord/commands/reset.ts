import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { connect } from "../../../private/connection";

export default {
    data: new SlashCommandBuilder()
        .setName("reset")
        .setDescription("Reset a user's product token (by email)")
        .addStringOption((opt: any) =>
            opt.setName('email')
                .setDescription("Provide the user email for which you want to reset")
                .setRequired(true)
        )
        .addStringOption((opt: any) =>
            opt.setName("product")
                .setDescription("Provide a product you wish to reset")
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
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: any) {
        await interaction.deferReply({ fetchReply: true });

        const email = interaction.options.getString("email");
        const product = interaction.options.getString("product");

        let conn;
        try {
            conn = await connect();

            const [users]: any = await conn.execute('SELECT user_id FROM tbl_users WHERE user_email = ?', [email]);
            if (users.length === 0) {
                await interaction.editReply({
                    embeds: [new EmbedBuilder().setDescription(`:x: User not found for email: ${email}`).setColor("#F97E7E")]
                });
                return;
            }
            const userId = users[0].user_id;

            const [result]: any = await conn.execute(
                `UPDATE tbl_tokens SET ip = 'none' WHERE user_id = ? AND product_id = ?`,
                [userId, product]
            );

            if (result.affectedRows > 0) {
                const em = new EmbedBuilder()
                    .setDescription(`HWID's have been reset for **${email}** (Product: ${product})`)
                    .setColor("#9EF798");
                await interaction.editReply({ embeds: [em] });
            } else {
                const em = new EmbedBuilder()
                    .setDescription(`User not found in the database for that product.`)
                    .setColor("#F97E7E");
                await interaction.editReply({ embeds: [em] });
            }
        } catch (e) {
            console.error(e);
            const errEm = new EmbedBuilder().setDescription(`:x: Database error`).setColor("#F97E7E");
            await interaction.editReply({ embeds: [errEm] });
        } finally {
            if (conn) conn.end();
        }
    }
}

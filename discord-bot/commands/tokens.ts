import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from "discord.js";
import { connect } from "../../private/connection";

const command = {
    data: new SlashCommandBuilder()
        .setName("tokens")
        .setDescription("View a user's products (by email)")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .addStringOption((opt: any) =>
            opt.setName('email')
                .setDescription("Provide the user email to see")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async execute(interaction: any) {
        await interaction.deferReply({ fetchReply: true });

        const email = interaction.options.getString("email");

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

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [rows]: any = await conn.execute(
                `SELECT product_id, ip FROM tbl_tokens WHERE user_id = ?`,
                [userId]
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const products = rows as any[];

            if (products.length === 0) {
                const em = new EmbedBuilder()
                    .setDescription(`Error!\\n\\n**${email}** doesn't own any products.`)
                    .setColor("#F97E7E");
                await interaction.editReply({ embeds: [em] });
                return;
            }

            const description: string[] = [];
            products.forEach(obj => {
                const usedText = (!obj.ip || obj.ip === 'none') ? "false" : "true";
                description.push(`**Product: ${obj.product_id}**\\n**Used:** ${usedText}\\n`);
            });

            const em = new EmbedBuilder()
                .setTitle(`${email}'s Products`)
                .setDescription(description.join("\\n"))
                .setColor("#2F3136");

            await interaction.editReply({ embeds: [em] });
        } catch (e) {
            console.error(e);
            const errEm = new EmbedBuilder().setDescription(`:x: Database error`).setColor("#F97E7E");
            await interaction.editReply({ embeds: [errEm] });
        } finally {
            if (conn) conn.end();
        }
    }
};

export default command;
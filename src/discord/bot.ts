import { Client, GatewayIntentBits, Collection, REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = "806855396362289182"; // The guild id from previous code

if (!token) {
    console.error("No DISCORD_TOKEN provided in .env");
    process.exit(1);
}

const client: any = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();
const commandsArray: any[] = [];

const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`).default;
        if (command && command.data) {
            client.commands.set(command.data.name, command);
            commandsArray.push(command.data.toJSON());
        }
    }
}

client.once('ready', async () => {
    console.log(`Bot loaded as ${client.user?.tag}`);
    const rest = new REST({ version: "10" }).setToken(token);
    try {
        console.log('Started refreshing application (/) commands.');
        let route = clientId
            ? Routes.applicationGuildCommands(clientId, guildId)
            : Routes.applicationCommands(client.user.id);

        await rest.put(route, { body: commandsArray });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async (interaction: any) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(token);

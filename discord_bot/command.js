const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Log every message
client.on("messageCreate", (message) => {
  console.log(message.content);
});

// Command handler
client.on("messageCreate", (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  if (message.content.startsWith("create")) {
    const url = message.content.split("create")[1];

    return message.reply({
      content: "Generating Short Url for: " + url,
    });
  }

  // Default reply
  message.reply({
    content: "Heyy From Node.js Bot..!",
  });
});

// Slash interaction handler
client.on("interactionCreate", async (interaction) => {
  // Optional safety check
  if (!interaction.isCommand()) return;

  await interaction.reply("Pong..!");
});

// Login bot
client.login(process.env.DISCORD_TOKEN);
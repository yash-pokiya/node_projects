import { REST, Routes } from "discord.js";

const commands = [
  {
    name: "create",
    description: "Creates new URL",
  },
];
const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_TOKEN
);

try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(process.env.APP_ID), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}
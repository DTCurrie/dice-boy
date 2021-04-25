import path from "path";

import { CommandoClient } from "discord.js-commando";
import { config } from "dotenv";

import { command, prefix } from "./config";

config();

const commandPrefix = `${prefix}${command}`;

export const client = new CommandoClient({
  commandPrefix,
  owner: process.env.OWNER_ID,
  invite: process.env.INVITE_LINK,
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    [
      "rolls",
      "**rolls**: 1. Be Smart 2. Be Safe 3. Don't Screw Up: _Good Luck Out There!_",
    ],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, "commands"));

client.once("ready", () => {
  console.log("Dice Boy is ready!");
});

client.login(process.env.DISCORD_TOKEN);

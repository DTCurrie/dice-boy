import { Client } from "discord.js";

export const client = new Client();

client.once("ready", () => {
  console.log("Dice Boy is ready!");
});

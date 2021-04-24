import { config } from "dotenv";

import { client } from "./client/client";
import { command, prefix, RollCommands } from "./config";
import { skillRoll } from "./rolls/rolls";

config();

client.login(process.env.DISCORD_TOKEN);

const commandString = `${prefix}${command}`;

client.on("message", (message) => {
  try {
    if (message.content.substring(0, commandString.length) === commandString) {
      const messageArr = message.content.split(" ");
      const rollCommand = messageArr[1];

      if (rollCommand === RollCommands.Skill) {
        const skillArr = messageArr[2].split("@");
        const dice = parseInt(skillArr[0]);
        const target = parseInt(skillArr[1]);
        const tag = parseInt(skillArr[1].split("#")[1]);
        const difficulty = parseInt(messageArr[3]);

        if (
          skillArr.length !== 2 ||
          isNaN(dice) ||
          isNaN(target) ||
          isNaN(difficulty)
        ) {
          message.channel.send(
            "Did not recognize skill roll format, please use `!roll skill {dice}@{target}[#{tag}] {difficulty}`"
          );

          return;
        }

        const result = isNaN(tag)
          ? skillRoll(dice, target, difficulty)
          : skillRoll(dice, target, difficulty, {
              success: tag,
              failure: 20,
            });

        message.channel.send(result);
      }
    }
  } catch (error) {
    message.channel.send(
      `Oops "${message.content}" does not follow Vault-Tech's Dice Boy recommended command structure. Please check your formatting and try again!`
    );

    console.error(`Error: "${message.content}" failed`, error);
  }
});

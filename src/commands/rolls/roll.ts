import { MessageEmbed } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import { roll } from "../../utils/rolls/roll";
import { getAuthorData } from "../../utils/author";
import { infoColor, warningColor } from "../../utils/color";

class RollCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "roll",
      aliases: ["r"],
      group: "rolls",
      memberName: "roll",
      description:
        "Try your luck with some dice! Uses [standard dice notation](https://greenimp.github.io/rpg-dice-roller/guide/notation/).",
      args: [
        {
          key: "formula",
          type: "string",
          prompt: `Enter a roll using [standard dice notation](https://greenimp.github.io/rpg-dice-roller/guide/notation/).`,
        },
      ],
    });
  }

  public run = (
    message: CommandoMessage,
    { formula }: { formula: string }
  ): null => {
    const authorData = getAuthorData(this.client);

    try {
      const { output } = roll(formula);

      message.say(
        new MessageEmbed({
          ...authorData,
          title: "Results",
          color: infoColor,
          description: "_Good luck out there!_",
          fields: [{ name: "\u200B", value: output }],
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      message.say(
        new MessageEmbed({
          ...authorData,
          title: "Error",
          color: warningColor,
          description: `Uh oh, there was a problem with your formula. Please use [standard dice notation](https://greenimp.github.io/rpg-dice-roller/guide/notation/) and try again!
          \n\t_Error: ${error.message}_`,
        })
      );
    }
    return null;
  };
}

export default RollCommand;

import { MessageEmbed } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";

import { roll } from "../../rolls/roll";
import { getAuthorData } from "../../utils/author";

class RollCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "roll",
      aliases: ["r"],
      group: "rolls",
      memberName: "roll",
      description:
        "Try your luck with some dice! Uses standard dice rolling notation.",
      args: [
        {
          key: "formula",
          type: "string",
          prompt: `Enter a roll using the [standard dice notation](https://en.wikipedia.org/wiki/Dice_notation).`,
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
          color: "#0099ff",
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
          color: "#e6b032",
          description: `Uh oh, there was a problem with your formula. Please use the [standard dice notation](https://en.wikipedia.org/wiki/Dice_notation) and try again!
          \n\t_Error: ${error.message}_`,
        })
      );
    }
    return null;
  };
}

export default RollCommand;

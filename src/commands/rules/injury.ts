import { MessageEmbed, TextChannel } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Menu } from "discord.js-menu";

import { getAuthorData } from "../../utils/author";
import {
  injuryNotation,
  injuryNotationRegex,
} from "../../utils/rolls/notation";
import {
  getCriticalHitLocation,
  HitLocation,
  HitLocationType,
} from "../../utils/hit-locations";
import { infoColor, warningColor } from "../../utils/color";
import {
  criticalHitInjuries,
  CriticalHitLocation,
} from "../../utils/damage/critical-hit";
import { capitalize } from "../../utils/text/capitalize";

class CombatRollCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "injury",
      aliases: ["i"],
      group: "rules",
      memberName: "injury",
      description: `The outside world can never hurt you! Uses the Vault-Tec recommended ${injuryNotation} notation.`,
      clientPermissions: ["MANAGE_MESSAGES"],
      args: [
        {
          key: "formula",
          type: "string",
          prompt: `Enter a enter hit location and optional type using the \`${injuryNotation}\` notation.\nNote: \`{}\` indicate where a value should be entered, \`[]\` indicate an optional value. Do not include either \`{}\` or \`[]\` in your formula.\n`,
        },
      ],
    });
  }

  private showResultsMessage = (
    message: CommandoMessage,
    location: CriticalHitLocation
  ) => {
    new Menu(message.channel as TextChannel, message.author.id, [
      {
        name: "main",
        content: new MessageEmbed({
          ...getAuthorData(this.client),
          title: "Injury!",
          color: infoColor,

          description: "> The outside world can never hurt you!",
          fields: [
            {
              name: "Location",
              value: capitalize(location),
              inline: false,
            },
            {
              name: "Injury",
              value: criticalHitInjuries[location],
              inline: false,
            },
          ],
        }),
        reactions: {},
      },
    ]).start();
  };

  public run = (
    message: CommandoMessage,
    { formula }: { formula: string }
  ): null => {
    const authorData = getAuthorData(this.client);

    const showError = (error?: Error): null => {
      const errorMessage = error && `**Vault-Tec Error: ${error.message}.**`;

      message.say(
        new MessageEmbed({
          ...authorData,
          title: "Error",
          description: `Uh oh, there was a problem with your formula. Please use the Vault-Tec approved \`${injuryNotation}\` notation and try again!\n\t
            Here is a few examples:
            \`\`\`
| Description      | Formula |
| ---------------- | ------- |
| Head             | h       |
| Mr. Handy Optics | o handy |
| -------------------------- |
            \`\`\`\n
            ${errorMessage || ""}`,
          color: warningColor,
        })
      );

      return null;
    };

    if (injuryNotationRegex.test(formula)) {
      try {
        const args = formula.split(" ");
        const hitLocation = args[0] as HitLocation;
        const hitLocationType =
          (args[1] as HitLocationType) || HitLocationType.Default;

        if (!hitLocation || !hitLocationType) {
          return showError();
        }

        const location = getCriticalHitLocation(hitLocationType, hitLocation);

        this.showResultsMessage(message, location);

        return null;
      } catch (error) {
        return showError(error);
      }
    }

    return showError();
  };
}

export default CombatRollCommand;

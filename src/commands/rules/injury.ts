import { MessageEmbed, TextChannel } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Menu } from "discord.js-menu";

import { getAuthorData } from "../../utils/author";
import {
  injuryNotation,
  injuryNotationRegex,
  notationNotes,
} from "../../utils/notation";
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

class InjuryRuleCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "injury",
      aliases: ["inj"],
      group: "rules",
      memberName: "injury",
      description: `The outside world can never hurt you! Uses the Vault-Tec recommended ${injuryNotation} notation.`,
      clientPermissions: ["MANAGE_MESSAGES"],
      args: [
        {
          key: "formula",
          type: "string",
          prompt: `Enter "list" for a list of injuries, or a hit location and optional type using the \`${injuryNotation}\` notation.${notationNotes}`,
          default: "list",
        },
      ],
    });
  }

  private showListMessage = (message: CommandoMessage) => {
    new Menu(message.channel as TextChannel, message.author.id, [
      {
        name: "main",
        content: new MessageEmbed({
          ...getAuthorData(this.client),
          title: "Injuries",
          color: infoColor,

          description: "> The outside world can never hurt you!",
          fields: Object.keys(criticalHitInjuries).map((key) => ({
            name: capitalize(key),
            value: criticalHitInjuries[key as CriticalHitLocation],
            inline: false,
          })),
        }),
        reactions: {},
      },
    ]).start();

    return null;
  };

  private showResultsMessage = (
    message: CommandoMessage,
    location: CriticalHitLocation
  ) => {
    new Menu(message.channel as TextChannel, message.author.id, [
      {
        name: "main",
        content: new MessageEmbed({
          ...getAuthorData(this.client),
          title: "Injury",
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

    return null;
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
| Description      | Formula        |
| ---------------- | -------------- |
| List of Injuries | list (default) |
| Head             | head           |
| Mr. Handy Optics | optics handy   |
| --------------------------------- |
            \`\`\`\n
            ${errorMessage || ""}`,
          color: warningColor,
        })
      );

      return null;
    };

    if (formula === "list") {
      return this.showListMessage(message);
    }

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

        return this.showResultsMessage(message, location);
      } catch (error) {
        return showError(error);
      }
    }

    return showError();
  };
}

export default InjuryRuleCommand;

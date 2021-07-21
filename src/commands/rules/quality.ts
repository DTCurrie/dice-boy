import { MessageEmbed, TextChannel } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Menu } from "discord.js-menu";

import { getAuthorData } from "../../utils/author";
import {
  notationNotes,
  qualitiesNotation,
  qualitiesNotationRegex,
} from "../../utils/notation";
import { infoColor, warningColor } from "../../utils/color";
import { capitalize } from "../../utils/text/capitalize";
import { weaponQualities, WeaponQuality } from "../../utils/weapons/qualities";

class QualityRuleCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "quality",
      aliases: ["qual"],
      group: "rules",
      memberName: "quality",
      description: `Extermination is everyone's job! Uses the Vault-Tec recommended ${qualitiesNotation} notation.`,
      clientPermissions: ["MANAGE_MESSAGES"],
      args: [
        {
          key: "formula",
          type: "string",
          prompt: `Enter a quality using the \`${qualitiesNotation}\` notation.${notationNotes}`,
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
          title: "Weapon Qualities",
          color: infoColor,

          description: "> Extermination is everyone's job!",
          fields: Object.keys(weaponQualities).map((key) => ({
            name: capitalize(key),
            value: weaponQualities[key as WeaponQuality],
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
    quality: WeaponQuality
  ) => {
    new Menu(message.channel as TextChannel, message.author.id, [
      {
        name: "main",
        content: new MessageEmbed({
          ...getAuthorData(this.client),
          title: "Weapon Quality",
          color: infoColor,

          description: "> Extermination is everyone's job!",
          fields: [
            {
              name: "Quality",
              value: capitalize(quality),
              inline: false,
            },
            {
              name: "Injury",
              value: weaponQualities[quality],
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
          description: `Uh oh, there was a problem with your formula. Please use the Vault-Tec approved \`${qualitiesNotation}\` notation and try again!\n\t
            Here is a few examples:
            \`\`\`
| Description       | Formula        |
| ----------------- | -------------- |
| List of Qualities | list (default) |
| Accurate          | accurate       |
| Night Vision      | night-vision   |
| Two-Handed        | two-handed     |
| ---------------------------------- |
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

    if (qualitiesNotationRegex.test(formula)) {
      try {
        const quality = formula as WeaponQuality;

        if (!quality) {
          return showError();
        }

        return this.showResultsMessage(message, quality);
      } catch (error) {
        return showError(error);
      }
    }

    return showError();
  };
}

export default QualityRuleCommand;

import { MessageEmbed, TextChannel } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Menu } from "discord.js-menu";

import {
  skillReroll,
  skillRoll,
  SkillRollData,
  SkillRollOptions,
  SkillRollResult,
} from "../../utils/rolls/skill-roll";
import { getAuthorData } from "../../utils/author";
import {
  notationNotes,
  skillNotation,
  skillNotationRegex,
} from "../../utils/notation";
import { getNextSymbolOrSpace } from "../../utils/text/parse";
import { failureColor, successColor, warningColor } from "../../utils/color";

class SkillRollCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "skill",
      aliases: ["s"],
      group: "rolls",
      memberName: "skill",
      description: `Use your skills to help your fellow citizens! Uses the Vault-Tec recommended ${skillNotation} notation.`,
      clientPermissions: ["MANAGE_MESSAGES"],
      args: [
        {
          key: "formula",
          type: "string",
          prompt: `Enter a skill roll using the \`${skillNotation}\` notation.${notationNotes}`,
        },
      ],
    });
  }

  private getResultsText = (results: SkillRollData[]): string =>
    `[ ${results.map((r) => r.output).join(", ")} ]`;

  private rerollOne = (
    message: CommandoMessage,
    options: Omit<SkillRollOptions, "dice">,
    results: SkillRollResult
  ): void =>
    this.showResultsMessage(message, options, skillReroll(1, options, results));

  private rerollTwo = (
    message: CommandoMessage,
    options: Omit<SkillRollOptions, "dice">,
    results: SkillRollResult
  ): void =>
    this.showResultsMessage(message, options, skillReroll(2, options, results));

  private rerollAll = (
    message: CommandoMessage,
    options: SkillRollOptions,
    results: SkillRollResult
  ): void =>
    this.showResultsMessage(
      message,
      options,
      skillReroll(options.dice, options, results)
    );

  private showResultsMessage = (
    message: CommandoMessage,
    options: SkillRollOptions,
    {
      success,
      successes,
      complicated,
      actionPoints,
      results,
      rolls,
    }: SkillRollResult
  ) =>
    new Menu(message.channel as TextChannel, message.author.id, [
      {
        name: "main",
        content: new MessageEmbed({
          ...getAuthorData(this.client),
          title: success ? "Success!" : "Failure!",
          color: success ? successColor : failureColor,

          description: success
            ? "> Your efforts will help build a better tomorrow!"
            : "> Please report to your Overseer to determine remedial actions.",
          fields: [
            {
              name: "Successes",
	      value: `${successes}/${options.difficulty} ${complicated ? " ⚠️" : ""}`,
              inline: true,
            },
            {
              name: "AP Earned",
              value: `${actionPoints}`,
              inline: true,
            },
            {
              name: "Rolls",
              value: this.getResultsText(results),
              inline: true,
            },
          ],
        }),
        reactions: {
          "🍀": () =>
            this.rerollOne(message, options, {
              success,
              successes,
              complicated,
              actionPoints,
              results,
              rolls,
            }),

          "🤞": () =>
            this.rerollTwo(message, options, {
              success,
              successes,
              complicated,
              actionPoints,
              results,
              rolls,
            }),
          "🔄": () =>
            this.rerollAll(message, options, {
              success,
              successes,
              complicated,
              actionPoints,
              results,
              rolls,
            }),
        },
      },
    ]).start();

  public run = (
    message: CommandoMessage,
    { formula }: { formula: string }
  ): null => {
    const authorData = getAuthorData(this.client);

    const showError = (): null => {
      message.say(
        new MessageEmbed({
          ...authorData,
          title: "Error",
          description: `Uh oh, there was a problem with your formula. Please use the Vault-Tec approved \`${skillNotation}\` notation and try again!\n\t
            Here is a few examples:
            \`\`\`
| Description                | Formula      |
| -------------------------- | ------------ |
| 10 Target                  | 10           |
| 10 Target, 2 Difficulty    | 10 2         |
| 10 Target, 3 Dice          | 10 d3        |
| 10 Target, 4 Tag           | 10 t4        |
| 10 Target, 19 Complication | 10 c19       |
| A little bit of everything | 10 3dt4c19 2 |
| ----------------------------------------- |
            \`\`\``,
          color: warningColor,
        })
      );

      return null;
    };

    if (skillNotationRegex.test(formula)) {
      const args = formula.split(" ");
      const target = parseInt(args[0]);

      const optionsString = args.slice(1).find((arg) => arg.match(/[^\d]/));
      const difficultyString = args
        .slice(1)
        .find((arg) => /^-?[\d.]+(?:e-?\d+)?$/.test(arg));
      const difficulty =
        (difficultyString && parseInt(difficultyString)) || 0;

      let dice: number | undefined;
      let tag: number | undefined;
      let complication: number | undefined;

      if (optionsString) {
        const diceSymbol = optionsString.indexOf("d");
        const tagSymbol = optionsString.indexOf("t");
        const complicationSymbol = optionsString.indexOf("c");

        const diceString = optionsString.substring(diceSymbol + 1);
        dice =
          diceSymbol !== -1
            ? parseInt(
                diceString.substring(0, getNextSymbolOrSpace(diceString))
              )
            : undefined;

        const tagString = optionsString.substring(tagSymbol + 1);
        tag =
          tagSymbol !== -1
            ? parseInt(tagString.substring(0, getNextSymbolOrSpace(tagString)))
            : undefined;

        const complicationString = optionsString.substring(
          complicationSymbol + 1
        );

        complication =
          complicationSymbol !== -1
            ? parseInt(
                complicationString.substring(
                  0,
                  getNextSymbolOrSpace(complicationString)
                )
              )
            : undefined;
      }

      if (
        (dice && isNaN(dice)) ||
        isNaN(target) ||
        (tag && isNaN(tag)) ||
        (difficulty && isNaN(difficulty))
      ) {
        return showError();
      }

      const options = {
        dice,
        target,
        tag,
        complication,
        difficulty,
      };

      const roll = skillRoll(options);
      this.showResultsMessage(message, options, roll);

      return null;
    }

    return showError();
  };
}

export default SkillRollCommand;

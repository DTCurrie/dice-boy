import { MessageEmbed, TextChannel } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Menu } from "discord.js-menu";
import { special } from "../../config";

import {
  skillRoll,
  SkillRollData,
  skillRollFormula,
  skillRollRegex,
  SkillRollResult,
} from "../../rolls/rolls";

interface SkillRollCommandArgs {
  dice: number;
  target: number;
  tag: number;
  difficulty: number;
}

class SkillRollCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "skill",
      aliases: ["s"],
      group: "rolls",
      memberName: "skill",
      description: "Use your skills to help your fellow citizens!",
      clientPermissions: ["MANAGE_MESSAGES"],
      args: [
        {
          key: "formula",
          type: "string",
          default: "i",
          prompt: `Enter a skill roll using the ${skillRollFormula}? formula, or enter i for the interactive menu.`,
        },
      ],
    });
  }

  private getResultsText = (results: SkillRollData[]): string =>
    `[ ${results.map((r) => r.output).join(", ")} ]`;

  private interactive = (message: CommandoMessage): null => {
    let specialValue = 4;
    let skillValue = 0;
    let roll: SkillRollResult;

    const skillRollArgs: SkillRollCommandArgs = {
      dice: 2,
      target: 4,
      tag: 1,
      difficulty: 0,
    };

    const selectDice = (value: number) => {
      skillRollArgs.dice = value;
      message.reactions.removeAll();
      helpMenu.setPage(2);
    };

    const selectSpecial = (value: number) => {
      specialValue = value;
      skillRollArgs.target = specialValue + skillValue;
      message.reactions.removeAll();
      helpMenu.setPage(3);
    };

    const selectSkill = (value: number) => {
      skillValue = value;
      skillRollArgs.target = specialValue + skillValue;
      message.reactions.removeAll();
      helpMenu.setPage(4);
    };

    const setTag = (value: boolean) => {
      skillRollArgs.tag = value ? skillValue : 1;
      message.reactions.removeAll();
      helpMenu.setPage(5);
    };

    const selectDifficulty = (value: number) => {
      skillRollArgs.difficulty = value;

      const { dice, target, tag, difficulty } = skillRollArgs;
      roll = skillRoll(dice, target, tag, difficulty);

      helpMenu.pages[6].content.setDescription(
        roll.success ? "Success!" : "Failure!"
      );

      helpMenu.pages[6].content.setColor(roll.success ? "#33e83c" : "#eb4034");

      helpMenu.pages[6].content.fields[0].value = `${roll.successes}`;

      helpMenu.pages[6].content.fields[1].value = `${roll.actionPoints}`;
      helpMenu.pages[6].content.fields[2].value = `${
        roll.complication ? "Yes" : "No"
      }`;

      helpMenu.pages[6].content.fields[3].value = this.getResultsText(
        roll.results
      );

      helpMenu.pages[6].content.fields[4].value = `${
        dice !== 2 ? dice : ""
      }[${target}]${tag !== 1 ? `@${tag}` : ""}${
        difficulty !== 0 ? ` ${difficulty}` : ""
      }`;

      message.reactions.removeAll();
      helpMenu.setPage(6);
    };

    const helpMenu = new Menu(
      message.channel as TextChannel,
      message.author.id,
      [
        {
          name: "main",
          content: new MessageEmbed({
            title: "Skill Roll",
            description:
              "It's time to make a Skill Roll! This menu will guide you through the steps. Click the dice to start. You can click the arrow to restart or the crossmark to cancel. ",
            fields: [
              {
                name: "Step 1: Dice",
                value: "How lucky are you?",
                inline: true,
              },
              {
                name: `Step 2: ${special}`,
                value: `How ${special} are you?`,
                inline: true,
              },
              {
                name: "Step 3: Skill",
                value: `How talented are you?`,
                inline: true,
              },
              {
                name: "Step 4: Tag",
                value: `Is that a Tagged Skill?`,
                inline: true,
              },
              {
                name: "Step 5: Difficulty",
                value: `How hard is the task?`,
                inline: true,
              },
            ],
          }),
          reactions: {
            "🎲": "dice",
            "↩️": "main",
            "❌": "delete",
          },
        },
        {
          name: "dice",
          content: new MessageEmbed({
            title: "Step 1: Dice",
            description:
              "Choose how many dice to roll. The default is 2, but you can spend AP to purchase up to 3 more for a maximum of 5.",
          }),
          reactions: {
            "2️⃣": () => selectDice(2),
            "3️⃣": () => selectDice(3),
            "4️⃣": () => selectDice(4),
            "5️⃣": () => selectDice(5),
            "↩️": "main",
            "❌": "delete",
          },
        },
        {
          name: "special",
          content: new MessageEmbed({
            title: `Step 2: ${special}`,
            description: `Choose the value of the ${special} attribute you are using.`,
          }),
          reactions: {
            "4️⃣": () => selectSpecial(4),
            "5️⃣": () => selectSpecial(5),
            "6️⃣": () => selectSpecial(6),
            "7️⃣": () => selectSpecial(7),
            "8️⃣": () => selectSpecial(8),
            "9️⃣": () => selectSpecial(9),
            "🔟": () => selectSpecial(10),
            "↩️": "main",
            "❌": "delete",
          },
        },
        {
          name: "skill",
          content: new MessageEmbed({
            title: "Step 3: Skill",
            description: "Choose the value of the Skill you are using.",
          }),
          reactions: {
            "0️⃣": () => selectSkill(0),
            "1️⃣": () => selectSkill(1),
            "2️⃣": () => selectSkill(2),
            "3️⃣": () => selectSkill(3),
            "4️⃣": () => selectSkill(4),
            "5️⃣": () => selectSkill(5),
            "6️⃣": () => selectSkill(6),
            "↩️": "main",
            "❌": "delete",
          },
        },
        {
          name: "tag",
          content: new MessageEmbed({
            title: "Step 4: Tag",
            description:
              "Choose whether or not you are using a Tagged Skill. This will increase the critical success threshold from 1 to the Tagged Skill's value.",
          }),
          reactions: {
            "🏷️": () => setTag(true),
            "🚫": () => setTag(false),
            "↩️": "main",
            "❌": "delete",
          },
        },
        {
          name: "difficulty",
          content: new MessageEmbed({
            title: "Step 5: Difficulty",
            description:
              "Choose the difficulty for the roll. This is the number of successes needed to pass.",
          }),
          reactions: {
            "0️⃣": () => selectDifficulty(0),
            "1️⃣": () => selectDifficulty(1),
            "2️⃣": () => selectDifficulty(2),
            "3️⃣": () => selectDifficulty(3),
            "4️⃣": () => selectDifficulty(4),
            "5️⃣": () => selectDifficulty(5),
            "↩️": "main",
            "❌": "delete",
          },
        },
        {
          name: "results",
          content: new MessageEmbed({
            title: "Results",
            fields: [
              {
                name: "Successes",
                value: "0",
                inline: true,
              },
              {
                name: "AP Earned",
                value: "0",
                inline: true,
              },
              {
                name: "Complication?",
                value: "0",
                inline: true,
              },
              {
                name: "Rolls",
                value: "[ ]",
              },
              {
                name: "Generated Formula",
                value: " ",
              },
            ],
          }),
          reactions: {},
        },
      ],
      300000
    );

    helpMenu.start();
    return null;
  };

  public run = (
    message: CommandoMessage,
    { formula }: { formula: string }
  ): null => {
    function showError(): null {
      message.say(
        new MessageEmbed({
          title: "Error",
          description: `Uh oh, there was an error parsing your formula. Please use the Vault-Tech approved \`${skillRollFormula}\` formula and try again!\n
            Here is a few examples:
            \`\`\`
| Description                             | Formula   |
| --------------------------------------- | --------- |
| 2 Dice, 10 Target, 0 Difficulty         | [10]      |
| 2 Dice, 10 Target, 0 Difficulty         | [10] 2    |
| 2 Dice, 10 Target, 0 Difficulty, Tagged | [10]@4    |
| 2 Dice, 10 Target, 2 Difficulty, Tagged | [10]@4 2  |
| 3 Dice, 10 Target, 0 Difficulty         | 3[10]     |
| 4 Dice, 10 Target, 0 Difficulty, Tagged | 4[10]@4   |
| 5 Dice, 10 Target, 2 Difficulty, Tagged | 5[10]@4 2 |
            \`\`\``,
          color: "#e6b032",
        })
      );

      return null;
    }

    if (formula === "i" || formula === "interactive") {
      return this.interactive(message);
    } else if (skillRollRegex.test(formula)) {
      const targetOpenBrace = formula.indexOf("[");
      const targetCloseBrace = formula.indexOf("]");
      const tagSymbol = formula.indexOf("@");
      const space = formula.indexOf(" ");

      const dice = parseInt(formula.substring(0, targetOpenBrace));

      const target = parseInt(
        formula.substring(targetOpenBrace + 1, targetCloseBrace)
      );

      const tag = tagSymbol
        ? parseInt(
            formula.substring(tagSymbol + 1, space ? space : formula.length)
          )
        : undefined;

      const difficulty = space
        ? parseInt(formula.substring(space + 1, formula.length))
        : undefined;

      if (
        isNaN(dice) ||
        isNaN(target) ||
        (tag && isNaN(tag)) ||
        (difficulty && isNaN(difficulty))
      ) {
        return showError();
      }

      const {
        successes,
        success,
        actionPoints,
        complication,
        results,
      } = skillRoll(dice, target, tag, difficulty);

      message.say(
        new MessageEmbed({
          title: "Results",
          color: success ? "#33e83c" : "#eb4034",
          fields: [
            {
              name: "Successes",
              value: `${successes}`,
              inline: true,
            },
            {
              name: "AP Earned",
              value: `${actionPoints}`,
              inline: true,
            },
            {
              name: "Complication?",
              value: complication ? "Yes" : "No",
              inline: true,
            },
            {
              name: "Rolls",
              value: this.getResultsText(results),
            },
          ],
        })
      );

      return null;
    }

    return showError();
  };
}

export default SkillRollCommand;

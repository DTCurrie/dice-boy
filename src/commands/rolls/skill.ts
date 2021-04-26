import {
  MessageEmbed,
  MessageEmbedAuthor,
  MessageEmbedThumbnail,
  TextChannel,
} from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Menu } from "discord.js-menu";

import { special } from "../../config";

import {
  skillRoll,
  SkillRollData,
  skillRollFormula,
  skillRollRegex,
  SkillRollResult,
} from "../../rolls/skill-roll";
import { getAuthorData } from "../../utils/author";

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

  private interactive = (
    message: CommandoMessage,
    authorData: { author: MessageEmbedAuthor; thumbnail: MessageEmbedThumbnail }
  ): null => {
    let specialValue = 4;
    let skillValue = 0;
    let roll: SkillRollResult;

    const skillRollArgs: SkillRollCommandArgs = {
      dice: 2,
      target: 4,
      tag: 1,
      difficulty: 0,
    };

    const selectSpecial = (value: number) => {
      specialValue = value;
      skillRollArgs.target = specialValue + skillValue;
      message.reactions.removeAll();
      helpMenu.setPage(2);
    };

    const selectSkill = (value: number) => {
      skillValue = value;
      skillRollArgs.target = specialValue + skillValue;
      message.reactions.removeAll();
      helpMenu.setPage(3);
    };

    const setTag = (value: boolean) => {
      skillRollArgs.tag = value ? skillValue : 1;
      message.reactions.removeAll();
      helpMenu.setPage(4);
    };

    const selectDifficulty = (value: number) => {
      skillRollArgs.difficulty = value;
      message.reactions.removeAll();
      helpMenu.setPage(5);
    };

    const selectDice = (value: number) => {
      skillRollArgs.dice = value;

      const { dice, target, tag, difficulty } = skillRollArgs;
      roll = skillRoll(dice, target, tag, difficulty);

      helpMenu.pages[6].content.setTitle(
        roll.success ? "Success!" : "Failure!"
      );

      helpMenu.pages[6].content.setDescription(
        roll.success
          ? "> Your efforts will help build a better tomorrow!"
          : "> Please report to your Overseer to determine remedial actions."
      );

      helpMenu.pages[6].content.setColor(roll.success ? "#33e83c" : "#eb4034");

      helpMenu.pages[6].content.fields[0].value = `${roll.successes}${
        roll.complication ? " ⚠️" : ""
      }`;

      helpMenu.pages[6].content.fields[1].value = `${roll.actionPoints}`;

      helpMenu.pages[6].content.fields[2].value = this.getResultsText(
        roll.results
      );

      helpMenu.pages[6].content.fields[3].value = `${
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
            ...authorData,
            title: "Dice Boy 2000: Skill Roll",
            description:
              "It's time to make a **Skill** Roll! The **Dice Boy 2000** will guide you through the steps of using your well-honed **Skills**! Click the dice to start, and you can always click the arrow to restart or the crossmark to cancel. _Good Luck Out There!_",
            fields: [
              {
                name: "Skill Test Summary",
                value: `If you want to roll even faster, just follow these steps:\n
                > Add up your **${special} attribute + Skill** combination, that is your _**target**_

                > Are you using a **Tagged Skill**? If so, you will use the **Skill's value** as your _**tag**_

                > Check the _**difficulty**_ with your GM

                > By default you get 2 _**dice**_, but you can **buy dice** with **Action Points** (up to a maximum of 5)

                > Roll the dice using the \`!vats skill ${skillRollFormula}\` command. Remember, if you are not using a **Tagged Skill** you don't need to include \`@tag\``,
              },
            ],
          }),
          reactions: {
            "🎲": "special",
            "↩️": "main",
            "❌": "delete",
          },
        },
        {
          name: "special",
          content: new MessageEmbed({
            ...authorData,
            title: `Step 1: ${special}`,
            description: `_You're Special!_ Choose the value of the **${special} attribute** you are using.`,
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
            ...authorData,
            title: "Step 2: Skill",
            description:
              "_Hard work is happy work!_ Choose the value of the **Skill** you are using.",
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
            ...authorData,
            title: "Step 3: Tag",
            description:
              "_A jack of all trades is a master of none!_ Choose whether or not you are using a **Tagged Skill**. This will increase the critical success threshold from 1 to the **Tagged Skill's** value.",
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
            ...authorData,
            title: "Step 4: Difficulty",
            description:
              "_Be aware! Safety first!_ Choose the **difficulty** for the roll. This is the number of successes needed to pass.",
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
          name: "dice",
          content: new MessageEmbed({
            ...authorData,
            title: "Step 5: Dice",
            description:
              "_Achieve perfection!_ Choose how many **dice** to roll. The default is 2, but you can spend **Action Points** to purchase up to 3 more for a maximum of 5.",
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
          name: "results",
          content: new MessageEmbed({
            ...authorData,
            title: "Results",
            timestamp: Date.now(),
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
                name: "Rolls",
                value: "[ ]",
                inline: true,
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
    const authorData = getAuthorData(this.client);

    const showError = (): null => {
      message.say(
        new MessageEmbed({
          ...authorData,
          title: "Error",
          description: `Uh oh, there was a problem with your formula. Please use the Vault-Tech approved \`${skillRollFormula}\` formula and try again!\n
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
    };

    if (formula === "i" || formula === "interactive") {
      return this.interactive(message, authorData);
    } else if (skillRollRegex.test(formula)) {
      const targetOpenBrace = formula.indexOf("[");
      const targetCloseBrace = formula.indexOf("]");
      const tagSymbol = formula.indexOf("@");
      const space = formula.indexOf(" ");

      const dice =
        targetOpenBrace > 0
          ? parseInt(formula.substring(0, targetOpenBrace))
          : undefined;

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
        (dice && isNaN(dice)) ||
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
          ...authorData,
          title: success ? "Success!" : "Failure!",
          color: success ? "#33e83c" : "#eb4034",
          description: success
            ? "> Your efforts will help build a better tomorrow!"
            : "> Please report to your Overseer to determine remedial actions.",
          fields: [
            {
              name: "Successes",
              value: `${successes}${complication ? " ⚠️" : ""}`,
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
        })
      );

      return null;
    }

    return showError();
  };
}

export default SkillRollCommand;

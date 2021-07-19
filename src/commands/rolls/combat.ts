import { MessageEmbed, TextChannel } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Menu } from "discord.js-menu";

import {
  combatReroll,
  combatRoll,
  CombatRollData,
  CombatRollOptions,
  CombatRollResult,
} from "../../utils/rolls/combat-roll";
import { getAuthorData } from "../../utils/author";
import {
  combatDamageEffectNotation,
  combatDamageEffectsNotation,
  combatHitLocationNotation,
  combatHitLocationTypeNotation,
  combatNotation,
  combatNotationRegex,
  notationNotes,
} from "../../utils/rolls/notation";
import {
  DamageEffect,
  DamageEffectType,
} from "../../utils/damage/damage-effect";
import { DamageType } from "../../utils/damage/damage";
import {
  getHitLocationText,
  HitLocation,
  HitLocationType,
} from "../../utils/hit-locations";
import { capitalize } from "../../utils/text/capitalize";
import { failureColor, successColor, warningColor } from "../../utils/color";

class CombatRollCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "combat",
      aliases: ["c"],
      group: "rolls",
      memberName: "combat",
      description: `Spread Democracy for Uncle Sam! Uses the Vault-Tec recommended ${combatNotation} notation.`,
      clientPermissions: ["MANAGE_MESSAGES"],
      args: [
        {
          key: "formula",
          type: "string",
          prompt: `Enter a combat roll using the \`${combatNotation}\` notation.${notationNotes}`,
        },
      ],
    });
  }

  private getResultsText = (results: CombatRollData[]): string =>
    `[ ${results.map((r) => r.output).join(", ")} ]`;

  private rerollOne = (
    message: CommandoMessage,
    options: CombatRollOptions,
    results: CombatRollResult
  ): void =>
    this.showResultsMessage(
      message,
      options,
      combatReroll(1, options, results)
    );

  private rerollTwo = (
    message: CommandoMessage,
    options: CombatRollOptions,
    results: CombatRollResult
  ): void =>
    this.showResultsMessage(
      message,
      options,
      combatReroll(options.dice < 2 ? options.dice : 2, options, results)
    );

  private rerollThree = (
    message: CommandoMessage,
    options: CombatRollOptions,
    results: CombatRollResult
  ): void =>
    this.showResultsMessage(
      message,
      options,
      combatReroll(options.dice < 3 ? options.dice : 3, options, results)
    );

  private rerollAll = (
    message: CommandoMessage,
    options: CombatRollOptions,
    results: CombatRollResult
  ): void =>
    this.showResultsMessage(
      message,
      options,
      combatReroll(options.dice, options, results)
    );

  private showResultsMessage = (
    message: CommandoMessage,
    options: CombatRollOptions,
    {
      damage,
      effects,
      hitLocation,
      hitLocationType,
      results,
      rolls,
    }: CombatRollResult
  ) => {
    const success = damage > 0;
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
              name: "Damage",
              value: `${damage}`,
              inline: true,
            },
            {
              name: "Hit Location",
              value: capitalize(
                getHitLocationText(hitLocationType, hitLocation)
              ),
              inline: true,
            },
            {
              name: "Rolls",
              value: this.getResultsText(results),
              inline: true,
            },
          ].concat(
            effects.map(({ type, text }) => {
              return {
                name: type.charAt(0).toUpperCase() + type.slice(1),
                value: text,
                inline: false,
              };
            })
          ),
        }),
        reactions: {
          "🍀": () =>
            this.rerollOne(message, options, {
              damage,
              effects,
              hitLocation,
              hitLocationType,
              results,
              rolls,
            }),
          "🤞": () =>
            this.rerollTwo(message, options, {
              damage,
              effects,
              hitLocation,
              hitLocationType,
              results,
              rolls,
            }),
          "🎰": () =>
            this.rerollThree(message, options, {
              damage,
              effects,
              hitLocation,
              hitLocationType,
              results,
              rolls,
            }),
          "🔄": () =>
            this.rerollAll(message, options, {
              damage,
              effects,
              hitLocation,
              hitLocationType,
              results,
              rolls,
            }),
        },
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
          description: `Uh oh, there was a problem with your formula. Please use the Vault-Tec approved \`${combatNotation}\` notation and try again!\n\t
            Here is a few examples:
            \`\`\`
| Description                    | Formula             |
| ------------------------------ | ------------------- |
| 1 Physical                     | 1 ph                |
| 2 Radiation Vicious            | 2 ra vicious        |
| 3 Energy Piercing 2 Stun       | 3 en piercing2,stun |
| 4 Poison Stun Head             | 4 po stun h         |
| 1 Energy Stun Mr. Handy        | 1 en stun handy     |
| 1 Energy Stun Optics Mr. Handy | 1 en stun o handy   |
| ---------------------------------------------------- |
            \`\`\`\n
            ${errorMessage || ""}`,
          color: warningColor,
        })
      );

      return null;
    };

    if (combatNotationRegex.test(formula)) {
      try {
        const args = formula.split(" ");
        const dice = parseInt(args[0]);
        const damageType = args[1] as DamageType;
        const optionArgs = args.slice(2);

        const damageEffectArgs = optionArgs.find(
          (arg) =>
            arg.search(combatDamageEffectNotation) >= 0 ||
            arg.search(combatDamageEffectsNotation) >= 0
        );

        const damageEffects: DamageEffect[] =
          (damageEffectArgs || "").split(",").map((effect) => {
            const effectArgs = effect.split(/(\d+)/);
            const type = effectArgs[0] as DamageEffectType;
            const rating = effectArgs[1];
            const result: DamageEffect = {
              type,
              rating: rating ? parseInt(rating) : undefined,
            };

            return result;
          }) || [];

        const hitLocation = optionArgs.find(
          (arg) =>
            arg.search(new RegExp(`^${combatHitLocationNotation.source}$`)) >= 0
        ) as HitLocation | undefined;

        const hitLocationType =
          (optionArgs.find(
            (arg) =>
              arg.search(
                new RegExp(`^${combatHitLocationTypeNotation.source}$`)
              ) >= 0
          ) as HitLocationType) || HitLocationType.Default;

        if (
          (dice && isNaN(dice)) ||
          !damageType ||
          !!damageEffects.find(({ rating }) => rating && isNaN(rating))
        ) {
          return showError();
        }

        const options = {
          dice,
          damageType,
          damageEffects,
          hitLocation,
          hitLocationType,
        };

        const roll = combatRoll(options);

        this.showResultsMessage(message, options, roll);

        return null;
      } catch (error) {
        return showError(error);
      }
    }

    return showError();
  };
}

export default CombatRollCommand;

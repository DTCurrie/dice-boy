import { DiceRoll, DiceRoller } from "rpg-dice-roller";
import { RollResults } from "rpg-dice-roller/types/results";

export const roller = new DiceRoller();

export interface SkillRollResult {
  index: number;
  value: number;
  complication: boolean;
  output: string;
}

export const skillRoll = (
  dice: number,
  threshold: number,
  difficulty: number,
  criticals: {
    success: number;
    failure: number;
  } = { success: 1, failure: 20 }
): string => {
  const { success, failure } = criticals;
  const diceCommand = `${dice}d20`;
  const result = roller.roll(diceCommand) as DiceRoll;
  let successes = 0;

  const results = (result.rolls[0] as RollResults).rolls.reduce(
    (accumulator, { value }, index) => {
      const isSuccess = value <= threshold;
      const isCritSuccess = value <= success;
      const isCritFailure = value >= failure;

      let output = `${value}`;
      if (isSuccess) {
        successes += 1;
        output = `_${value}_`;

        if (isCritSuccess) {
          successes += 1;
          output = `_**${value}**_`;
        }
      } else {
        output = isCritFailure ? `~~**${value}**~~` : `~~${value}~~`;
      }

      accumulator.push({
        index,
        value,
        complication: isCritFailure,
        output,
      });

      return accumulator;
    },
    [] as SkillRollResult[]
  );

  const didPass = successes >= difficulty;

  const resultMessage = `[${results.map((r) => r.output).join(", ")}]: You ${
    didPass ? "succeed" : "fail"
  } with ${successes} success${successes !== 1 ? "es" : ""}${
    results.find((r) => r.complication) ? " (complication!)" : ""
  }`;

  return resultMessage;
};

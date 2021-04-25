import { DiceRoll, DiceRoller } from "rpg-dice-roller";
import { RollResults } from "rpg-dice-roller/types/results";

export const roller = new DiceRoller();

export const skillRollFormula = `dice?[target]@tag? difficulty?`;
export const skillRollRegex = /(\d+)?\[\d+\](@\d+)?(\s\d+)?/;

const getOutput = (
  value: string,
  success: boolean,
  criticalSuccess: boolean,
  criticalFailure: boolean
): string => {
  let output = `${value}`;
  if (success) {
    output = criticalSuccess ? `_**${value}**_` : `_${value}_`;
  } else {
    output = criticalFailure ? `~~**${value}**~~` : `~~${value}~~`;
  }

  return output;
};

export interface SkillRollData {
  index: number;
  value: number;
  complication: boolean;
  output: string;
}

export interface SkillRollResult {
  successes: number;
  success: boolean;
  complication: boolean;
  actionPoints: number;
  results: SkillRollData[];
}

export const skillRoll = (
  dice = 2,
  target = 4,
  tag = 1,
  difficulty = 0
): SkillRollResult => {
  const diceCommand = `${dice}d20`;
  const result = roller.roll(diceCommand) as DiceRoll;
  let successes = 0;

  const results = (result.rolls[0] as RollResults).rolls.reduce(
    (accumulator, { value }, index) => {
      const success = value <= target;
      const criticalSuccess = value <= tag;
      const criticalFailure = value >= 20;

      if (success) {
        successes += criticalSuccess ? 2 : 1;
      }

      const output = getOutput(
        `${value}`,
        success,
        criticalSuccess,
        criticalFailure
      );

      accumulator.push({
        index,
        value,
        complication: criticalFailure,
        output,
      });

      return accumulator;
    },
    [] as SkillRollData[]
  );

  const actionPoints = successes - difficulty;

  return {
    successes,
    success: successes >= difficulty,
    complication: !!results.find((r) => r.complication),
    actionPoints: actionPoints > 0 ? actionPoints : 0,
    results,
  };
};

import { DiceRoll } from "rpg-dice-roller";
import { RollResult, RollResults } from "rpg-dice-roller/types/results";

import { roller } from "./roller";

export interface SkillRollOptions {
  dice?: number;
  target: number;
  tag?: number;
  complication?: number;
  difficulty?: number;
}

export interface SkillRollData {
  index: number;
  value: number;
  successes: number;
  complication: boolean;
  output: string;
}

export interface SkillRollResult {
  successes: number;
  success: boolean;
  complicated: boolean;
  actionPoints: number;
  results: SkillRollData[];
  rolls: RollResult[];
}

const getOutput = (
  value: number,
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

const getRollResults = (
  rolls: RollResult[]
): { successes: number; results: SkillRollData[] } => {
  const results = rolls.reduce(
    (
      accumulator,
      { calculationValue, modifiers, value }: RollResult,
      index
    ) => {
      const success = !!calculationValue;
      const modifierKeys = Array.from(modifiers.keys());
      const criticalSuccess = modifierKeys.includes("critical-success");
      const criticalFailure = modifierKeys.includes("critical-failure");

      let successes = success ? 1 : 0;

      if (criticalSuccess) {
        successes += 1;
      }

      const output = getOutput(
        value,
        success,
        criticalSuccess,
        criticalFailure
      );

      const result = {
        index,
        value,
        complication: criticalFailure,
        output,
        successes,
      };

      accumulator.push(result);

      return accumulator;
    },
    [] as SkillRollData[]
  );

  const result = {
    successes: results.reduce(
      (total, current) => (total += current.successes),
      0
    ),
    results,
  };

  return result;
};

const handleRollResults = (
  successes: number,
  difficulty: number,
  results: SkillRollData[],
  rolls: RollResult[]
) => {
  const success = successes >= difficulty;
  const complicated = !!results.find((r) => r.complication);
  const actionPoints = Math.max(0, successes - difficulty);

  const result = {
    successes,
    success,
    complicated,
    actionPoints,
    results,
    rolls,
  };

  return result;
};

export const skillRoll = ({
  dice = 2,
  target = 4,
  tag = 1,
  complication = 20,
  difficulty = 0,
}: SkillRollOptions): SkillRollResult => {
  const diceCommand = `${dice}d20<=${target}cs<=${tag}cf>=${complication}sa`;
  const { rolls } = roller.roll(diceCommand) as DiceRoll;
  const rollResults = (rolls as RollResults[])[0].rolls;
  const { successes, results } = getRollResults(rollResults);
  const roll = handleRollResults(successes, difficulty, results, rollResults);

  return roll;
};

export const skillReroll = (
  dice = 2,
  {
    target = 4,
    tag = 1,
    complication = 20,
    difficulty = 0,
  }: Omit<SkillRollOptions, "dice">,
  { rolls: previousRolls }: SkillRollResult
): SkillRollResult => {
  const diceCommand = `${dice}d20<=${target}cs<=${tag}cf>=${complication}sa`;

  const { rolls } = roller.roll(diceCommand) as DiceRoll;
  const rollResults = (rolls as RollResults[])[0].rolls;

  const newRolls = previousRolls
    .sort((a, b) => a.value - b.value)
    .slice(0, previousRolls.length - dice)
    .concat(rollResults)
    .sort((a, b) => a.value - b.value);

  const { successes, results } = getRollResults(newRolls);
  const roll = handleRollResults(successes, difficulty, results, newRolls);

  return roll;
};

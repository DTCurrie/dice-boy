import { DiceRoll } from "rpg-dice-roller";
import { RollResult, RollResults } from "rpg-dice-roller/types/results";
import { DamageType } from "../damage/damage";

import {
  DamageEffect,
  DamageEffectResult,
  DamageEffectType,
} from "../damage/damage-effect";
import {
  getHitLocation,
  getHitLocationText,
  HitLocation,
  HitLocationType,
} from "../hit-locations";
import { pluralize } from "../text/pluralize";
import { roller } from "./roller";

export interface CombatRollOptions {
  dice: number;
  damageType?: DamageType;
  damageEffects?: DamageEffect[];
  hitLocation?: HitLocation;
  hitLocationType?: HitLocationType;
}

export interface CombatRollData {
  index: number;
  damage: number;
  effect: number;
  output: string;
}

export interface CombatRollEffect {
  index: number;
  damage: number;
  effect: DamageEffectResult;
  output: string;
}

export interface CombatRollResult {
  damage: number;
  damageType?: DamageType;
  effects: DamageEffectResult[];
  hitLocation: HitLocation;
  hitLocationType: HitLocationType;
  results: CombatRollData[];
  rolls: RollResult[];
}

const getOutput = (value: number): string => {
  switch (value) {
    case 1:
      return `<:CD_ONE:889253196588015637>`;
    case 2:
      return `<:CD_TWO:889253227474866217>`;
    case 3:
    case 4:
      return `<:CD_BLK:889253139805503488>`;
    case 5:
    case 6:
      return `<:CD_EFT:889253170683977748>`;
    default:
      return `${value}`;
  }
};

const getDamage = (value: number) => {
  switch (value) {
    case 1:
    case 5:
    case 6:
      return 1;
    case 2:
      return 2;
    case 3:
    case 4:
    default:
      return 0;
  }
};

const getCombatValue = (value: number): { damage: number; effect: number } => ({
  damage: getDamage(value),
  effect: [5, 6].includes(value) ? 1 : 0,
});

const getRollResults = (
  rolls: RollResult[]
): {
  damage: number;
  effects: number;
  results: CombatRollData[];
} => {
  const results = rolls.reduce((accumulator, { value }: RollResult, index) => {
    const { damage, effect } = getCombatValue(value);
    const output = getOutput(value);

    accumulator.push({
      index,
      damage,
      effect,
      output,
    });

    return accumulator;
  }, [] as CombatRollData[]);

  return {
    damage: results.reduce((current, result) => current + result.damage, 0),
    effects: results.reduce((current, result) => current + result.effect, 0),
    results,
  };
};

export const hitLocationRoll = (
  type: HitLocationType = HitLocationType.Default
): HitLocation => {
  const diceCommand = `1d20`;
  const { rolls } = roller.roll(diceCommand) as DiceRoll;
  const rollResult = (rolls as RollResults[])[0].rolls[0].value;
  const location = getHitLocation(type, rollResult);

  return location;
};

const getEffects = (
  value: number,
  types: DamageEffect[],
  damage: number,
  hitLocationType: HitLocationType
): DamageEffectResult[] => {
  if (!value) {
    return [];
  }

  return types.reduce<DamageEffectResult[]>((effects, { type, rating }) => {
    switch (type) {
      case DamageEffectType.Breaking:
        effects.push({
          type,
          text: `Reduce the number of Combat Dice a target’s cover provides by ${value} permanently. If the target is not in cover, instead reduce the DR of the location struck by ${value}.`,
        });
        break;
      case DamageEffectType.Burst: {
        const target = pluralize("target", value);
        const unit = pluralize("unit", value);

        effects.push({
          type,
          text: `The attack hits ${value} additional ${target} within Close range of the primary target, consuming ${value} additional ${unit} of ammunition from the weapon.`,
        });
        break;
      }
      case DamageEffectType.Persistent:
        effects.push({
          type,
          text: `The target suffers the weapon’s damage again at the end of their next and ${value} turns, for a number. The target can spend a major action to make a test to stop persistent damage early, with a difficulty of ${value}, and the attribute + skill chosen by the GM. Some Persistent weapons may inflict a different type of damage to the weapon, and where this is the case, it will be noted in brackets, for example: Persistent (Poison).`,
        });
        break;
      case DamageEffectType.PiercingX:
        effects.push({
          type,
          text: `Ignore ${value * (rating || 1)} points of the target’s DR.`,
        });
        break;
      case DamageEffectType.Radioactive: {
        const point = pluralize("point", value);

        effects.push({
          type,
          text: `The target also suffers ${value} ${point} of radiation damage. This radiation damage is totalled and applied separately, after a character has suffered the normal damage from the attack.`,
        });
        break;
      }
      case DamageEffectType.Spread: {
        const hitLocation = hitLocationRoll(hitLocationType);
        const spreadDamage = Math.floor(damage / 2);
        const location = getHitLocationText(hitLocationType, hitLocation);
        const text = `Your attack inflicts ${spreadDamage} additional damage to the target's ${location}.`;

        effects.push({
          type,
          text,
        });
        break;
      }
      case DamageEffectType.Stun:
        effects.push({
          type,
          text: `The target cannot take their normal actions on their next turn. A stunned character or creature can still spend AP to take additional actions as normal.`,
        });
        break;
      case DamageEffectType.Vicious:
        effects.push({
          type,
          text: ` The attack inflicts an additional ${value} damage.`,
        });
        break;
    }

    return effects;
  }, []);
};

const handleRollResults = (
  damage: number,
  damageType: DamageType | undefined,
  effectOccurences: number,
  effectTypes: DamageEffect[],
  hitLocation: HitLocation,
  hitLocationType: HitLocationType,
  results: CombatRollData[],
  rolls: RollResult[]
) => {
  const effects = getEffects(
    effectOccurences,
    effectTypes,
    damage,
    hitLocationType
  );

  const result = {
    damage,
    damageType,
    effects,
    hitLocation,
    hitLocationType,
    results,
    rolls,
  };

  return result;
};

export const combatRoll = ({
  dice,
  damageType,
  damageEffects = [],
  hitLocation,
  hitLocationType = HitLocationType.Default,
}: CombatRollOptions): CombatRollResult => {
  const diceCommand = `${dice}d6`;
  const { rolls } = roller.roll(diceCommand) as DiceRoll;
  const rollResults = (rolls as RollResults[])[0].rolls;
  const { damage, effects, results } = getRollResults(rollResults);

  const hitLocationResult = hitLocation || hitLocationRoll(hitLocationType);

  const roll = handleRollResults(
    damage,
    damageType,
    effects,
    damageEffects,
    hitLocationResult,
    hitLocationType,
    results,
    rollResults
  );

  return roll;
};

export const combatReroll = (
  dice: number,
  {
    damageType,
    damageEffects = [],
    hitLocation,
    hitLocationType = HitLocationType.Default,
  }: Omit<CombatRollOptions, "dice">,
  { rolls: previousRolls }: CombatRollResult
): CombatRollResult => {
  const diceCommand = `${dice}d6`;

  const { rolls } = roller.roll(diceCommand) as DiceRoll;
  const rollResults = (rolls as RollResults[])[0].rolls;

  const newRolls = previousRolls
    .sort((a, b) => a.value - b.value)
    .slice(0, previousRolls.length - dice)
    .concat(rollResults)
    .sort((a, b) => a.value - b.value);

  const { damage, effects, results } = getRollResults(newRolls);
  const roll = handleRollResults(
    damage,
    damageType,
    effects,
    damageEffects,
    hitLocation || hitLocationRoll(hitLocationType),
    hitLocationType,
    results,
    rollResults
  );

  return roll;
};

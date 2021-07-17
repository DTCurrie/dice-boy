export const skillNotation = `{target} [d{dice}t{tag}c{complication}] [{difficulty}]`;
export const skillNotationRegex = /\d+(\s(d\d+)?(t\d+)?(c\d+)?)?(\s\d+)?/;

export const combatNotation = `{dice} {damage type} [{effects,...}] [{hit location}] [{hit location type}]`;
export const combatDamageTypeNotation = /(ph|en|ra|po)/;
export const combatDamageEffectNotation = /(burst|breaking|persistent|(piercing\d+)|radioactive|spread|stun|vicious)/;

export const combatDamageEffectsNotation = new RegExp(
  `(${combatDamageEffectNotation.source}+)(,(${combatDamageEffectNotation.source}*))`
);

export const combatHitLocationNotation = /(h|t|la|ra|ll|rl|o|mb|a1|a2|a3)/;
export const combatHitLocationTypeNotation = /(default|handy)/;
export const combatNotationRegex = new RegExp(
  `\\d+\\s${combatDamageTypeNotation.source}(\\s${combatDamageEffectsNotation.source})?(\\s${combatHitLocationNotation.source}+)?(\\s${combatHitLocationTypeNotation.source}+)?`
);

// const x = /\d+\s(ph|en|ra|po)(\s(\/(burst|breaking|persistent|(piercing\d+)|radioactive|spread|stun|vicious)\/+)(,(\/(burst|breaking|persistent|(piercing\d+)|radioactive|spread|stun|vicious)\/*)))?(\s/(h|t|la|ra|ll|rl|o|mb|a1|a2|a3)/+)?(\s/(default|handy)/+)?/;

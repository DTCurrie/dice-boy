// Combat

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

// Injury

export const injuryNotation = `{hit location} [{hit location type}]`;

export const injuryNotationRegex = new RegExp(
  `${combatHitLocationNotation.source}(\\s${combatHitLocationTypeNotation.source}+)?`
);

// Skill

export const skillNotation = `{target} [d{dice}][t{tag}][c{complication}] [{difficulty}]`;
export const skillNotationRegex = /\d+(\s(d\d+)?(t\d+)?(c\d+)?)?(\s\d+)?/;

// Qualities

export const qualitiesNotation = `{quality}`;

export const qualitiesNotationRegex = /(accurate|blast|close-quarters|concealed|debilitating|gatling|inaccurate|mine|night-vision|parry|recon|reliable|suppressed|thrown|two-handed|unreliable)/;

// Utility

export const notationNotes =
  "\nNote: `{}` indicate where a value should be entered, `[]` indicate an optional value. Do not include either `{}` or `[]` in your formula.\n";

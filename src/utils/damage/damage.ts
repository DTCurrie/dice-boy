export enum DamageType {
  Physical = "ph",
  Energy = "en",
  Radiation = "ra",
  Poison = "po",
}

export const damageTypeText = Object.freeze({
  [DamageType.Physical]: "physical",
  [DamageType.Energy]: "energy",
  [DamageType.Radiation]: "radiation",
  [DamageType.Poison]: "poison",
});

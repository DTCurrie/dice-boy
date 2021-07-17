export enum DamageEffectType {
  Burst = "burst",
  Breaking = "breaking",
  Persistent = "persistent",
  PiercingX = "piercing",
  Radioactive = "radioactive",
  Spread = "spread",
  Stun = "stun",
  Vicious = "vicious",
}

export interface DamageEffect {
  type: DamageEffectType;
  rating?: number;
}

export interface DamageEffectResult {
  type: DamageEffectType;
  text: string;
}

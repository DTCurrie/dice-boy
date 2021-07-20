export enum WeaponQuality {
  Accurate = "accurate",
  Blast = "blast",
  CloseQuarters = "close-quarters",
  Concealed = "concealed",
  Debilitating = "debilitating",
  Gatling = "gatling",
  Inaccurate = "inaccurate",
  Mine = "mine",
  NightVision = "night-vision",
  Parry = "parry",
  Recon = "recon",
  Reliable = "reliable",
  Suppressed = "suppressed",
  Thrown = "thrown",
  TwoHanded = "two-handed",
  Unreliable = "unreliable",
}

export const weaponQualityText = Object.freeze<{
  [key: string]: string;
}>({
  [WeaponQuality.Accurate]: WeaponQuality.Accurate,
  [WeaponQuality.Blast]: WeaponQuality.Blast,
  [WeaponQuality.CloseQuarters]: "close quarters",
  [WeaponQuality.Concealed]: WeaponQuality.Concealed,
  [WeaponQuality.Debilitating]: WeaponQuality.Debilitating,
  [WeaponQuality.Gatling]: WeaponQuality.Gatling,
  [WeaponQuality.Inaccurate]: WeaponQuality.Inaccurate,
  [WeaponQuality.Mine]: WeaponQuality.Mine,
  [WeaponQuality.NightVision]: "night vision",
  [WeaponQuality.Parry]: WeaponQuality.Parry,
  [WeaponQuality.Recon]: WeaponQuality.Recon,
  [WeaponQuality.Reliable]: WeaponQuality.Reliable,
  [WeaponQuality.Suppressed]: WeaponQuality.Suppressed,
  [WeaponQuality.Thrown]: WeaponQuality.Thrown,
  [WeaponQuality.TwoHanded]: WeaponQuality.TwoHanded,
  [WeaponQuality.Unreliable]: WeaponQuality.Unreliable,
});

export const weaponQualities = Object.freeze({
  [WeaponQuality.Accurate]:
    "If you take the Aim minor action before attacking with an Accurate weapon, you may spend up to 3 AP to add +1 CD per AP spent to the attack’s damage. If you gain damage in this way, you may not spend ammunition for extra damage. A weapon cannot be both Accurate and Inaccurate.",
  [WeaponQuality.Blast]:
    "When you make an attack with a Blast weapon, you do not target a single opponent. Instead, select a single zone you can see, and make the appropriate skill test to attack, with a basic difficulty of 2 (adjusted for range as normal). If you succeed, every creature (and other damageable target) in that zone suffers the weapon’s damage. If you fail, your misplaced attack is less effective: roll only half the weapon’s CD to determine the damage inflicted to creatures in the target zone and ignore the weapon’s normal damage effects.",
  [WeaponQuality.CloseQuarters]:
    "A Close Quarters weapon is easy to use up-close, and suffers no difficulty increase for being used when within Reach of an enemy.",
  [WeaponQuality.Concealed]:
    "A Concealed weapon is small, or otherwise easy to hide on your person. Enemies do not spot a Concealed weapon unless you’re wielding it, or if they make a thorough search and succeed at a **PER + Survival** test with a difficulty of 2.",
  [WeaponQuality.Debilitating]:
    "The difficulty of any skill test to treat injuries inflicted by a Debilitating weapon increase by +1.",
  [WeaponQuality.Gatling]:
    "Ammunition is spent at ten times the normal rate by Gatling weapons: whenever you would spend one shot of ammunition, a Gatling weapon instead spends a burst of 10 shots. Whenever you spend ammunition to increase this weapon’s damage, add +2 CD per ten-shot burst (to a maximum number of bursts equal to the weapon’s Fire Rate), rather than +1 CD per shot.",
  [WeaponQuality.Inaccurate]:
    "When making an attack with an Inaccurate weapon, you gain no benefit from the Aim minor action. A weapon may not be both Accurate and Inaccurate.",
  [WeaponQuality.Mine]:
    "When a Mine is placed onto a surface and primed, it becomes a dangerous object, inflicting its damage upon anyone who comes within Reach of it (and upon additional characters, if it has the Blast quality).",
  [WeaponQuality.NightVision]:
    "The sights of a weapon with Night Vision have been made to allow you to see more clearly in the dark. When you Aim with a Night Vision weapon, you ignore any increase in the difficulty of an attack due to darkness.",
  [WeaponQuality.Parry]:
    "When an enemy attempts a melee attack against you, and you are wielding a Parry weapon, you may spend 1 AP to add +1 to your Defense against that attack.",
  [WeaponQuality.Recon]:
    "When you Aim with a Recon weapon, you may mark the target you aimed at. The next ally to attack that target may re-roll one d20 on their attack.",
  [WeaponQuality.Reliable]:
    "During each combat encounter, a Reliable weapon ignores the first complication you roll on a test to use that weapon. A weapon may not be both Reliable and Unreliable.",
  [WeaponQuality.Suppressed]:
    "If an enemy is not aware of you when you attack with a Suppressed weapon, they do not notice the attack unless they are the target or they pass a **PER + Survival** test with a difficulty of 2.",
  [WeaponQuality.Thrown]:
    "A Thrown (C) weapon can be thrown, as a ranged attack with an ideal range of Close. A Thrown (M) weapon can be thrown, as a ranged attack with an ideal range of Medium. You make an **AGI + Throwing** test to attack with the weapon.",
  [WeaponQuality.TwoHanded]:
    "A Two-Handed weapon must be held in two hands to be used effectively; attempting to attack with a Two-Handed weapon in one hand increases the difficulty by +2.",
  [WeaponQuality.Unreliable]:
    "When you make an attack with an Unreliable weapon, increase the complication range of the attack by 1. A weapon may not be both Reliable and Unreliable.",
});

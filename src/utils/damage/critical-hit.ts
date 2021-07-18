export enum CriticalHitLocation {
  Arm = "arm",
  Leg = "leg",
  Torso = "torso",
  Head = "head",
}

export const criticalHitInjuries = Object.freeze({
  [CriticalHitLocation.Arm]: `The target drops any object held in that hand, and the arm is broken or otherwise unable to move. The target cannot perform any actions using that arm—by itself or alongside another arm.`,
  [CriticalHitLocation.Leg]: `The target immediately falls prone. They can no longer take the Sprint action, and the Move action is now a major action.`,
  [CriticalHitLocation.Torso]: `The target begins bleeding heavily. At the end of each of their subsequent turns, they suffer 2 DC physical damage, ignoring all their DR.`,
  [CriticalHitLocation.Head]: ` The target is momentarily dazed and lose their normal actions in their next turn. They also cannot see clearly, and increase the difficulty of all tests which rely on vision by +2.`,
});

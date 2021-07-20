import { CriticalHitLocation } from "../damage/critical-hit";

export enum DefaultHitLocation {
  Head = "head",
  Torso = "torso",
  LeftArm = "left-arm",
  RightArm = "right-arm",
  LeftLeg = "left-leg",
  RightLeg = "right-leg",
}
export const defaultHitLocationText = Object.freeze<{
  [key: string]: string;
}>({
  [DefaultHitLocation.Head]: DefaultHitLocation.Head,
  [DefaultHitLocation.Torso]: DefaultHitLocation.Torso,
  [DefaultHitLocation.LeftArm]: "left arm",
  [DefaultHitLocation.RightArm]: "right arm",
  [DefaultHitLocation.LeftLeg]: "left leg",
  [DefaultHitLocation.RightLeg]: "right leg",
});

export const getDefaultHitLocation = (value: number): DefaultHitLocation => {
  switch (value) {
    case 1:
    case 2:
      return DefaultHitLocation.Head;
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
      return DefaultHitLocation.Torso;
    case 9:
    case 10:
    case 11:
      return DefaultHitLocation.LeftArm;
    case 12:
    case 13:
    case 14:
      return DefaultHitLocation.RightArm;
    case 15:
    case 16:
    case 17:
      return DefaultHitLocation.LeftLeg;
    case 18:
    case 19:
    case 20:
      return DefaultHitLocation.RightLeg;
    default:
      throw new Error(`Invalid hit location value: "${value}"`);
  }
};

export const getDefaultCriticalHitLocation = (
  location: DefaultHitLocation
): CriticalHitLocation => {
  switch (location) {
    case DefaultHitLocation.Head:
      return CriticalHitLocation.Head;
    case DefaultHitLocation.Torso:
      return CriticalHitLocation.Torso;
    case DefaultHitLocation.LeftArm:
    case DefaultHitLocation.RightArm:
      return CriticalHitLocation.Arm;
    case DefaultHitLocation.LeftLeg:
    case DefaultHitLocation.RightLeg:
      return CriticalHitLocation.Leg;
    default:
      throw new Error(`Invalid hit location value: "${location}"`);
  }
};

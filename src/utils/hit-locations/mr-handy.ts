import { CriticalHitLocation } from "../damage/critical-hit";

export enum MrHandyHitLocation {
  Optics = "optics",
  MainBody = "main-body",
  ArmOne = "arm-1",
  ArmTwo = "arm-2",
  ArmThree = "arm-3",
  Thruster = "thruster",
}

export const mrHandyHitLocationText = Object.freeze<{
  [key: string]: string;
}>({
  [MrHandyHitLocation.Optics]: "optics",
  [MrHandyHitLocation.MainBody]: "main body",
  [MrHandyHitLocation.ArmOne]: "arm 1",
  [MrHandyHitLocation.ArmTwo]: "arm 2",
  [MrHandyHitLocation.ArmThree]: "arm 3",
  [MrHandyHitLocation.Thruster]: "thruster",
});

export const getMrHandyHitLocation = (value: number): MrHandyHitLocation => {
  switch (value) {
    case 1:
    case 2:
      return MrHandyHitLocation.Optics;
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
      return MrHandyHitLocation.MainBody;
    case 9:
    case 10:
    case 11:
      return MrHandyHitLocation.ArmOne;
    case 12:
    case 13:
    case 14:
      return MrHandyHitLocation.ArmTwo;
    case 15:
    case 16:
    case 17:
      return MrHandyHitLocation.ArmThree;
    case 18:
    case 19:
    case 20:
      return MrHandyHitLocation.Thruster;
    default:
      throw new Error(`Invalid hit location value: "${value}"`);
  }
};

export const getMrHandyCriticalHitLocation = (
  location: MrHandyHitLocation
): CriticalHitLocation => {
  switch (location) {
    case MrHandyHitLocation.Optics:
      return CriticalHitLocation.Head;
    case MrHandyHitLocation.MainBody:
      return CriticalHitLocation.Torso;
    case MrHandyHitLocation.ArmOne:
    case MrHandyHitLocation.ArmTwo:
    case MrHandyHitLocation.ArmThree:
      return CriticalHitLocation.Arm;
    case MrHandyHitLocation.Thruster:
      return CriticalHitLocation.Leg;
    default:
      throw new Error(`Invalid hit location value: "${location}"`);
  }
};

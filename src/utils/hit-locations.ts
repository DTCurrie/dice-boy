export enum HitLocationType {
  Default = "default",
  MrHandy = "handy",
}

export enum DefaultHitLocation {
  Head = "h",
  Torso = "t",
  LeftArm = "la",
  RightArm = "ra",
  LeftLeg = "ll",
  RightLeg = "rl",
}

export enum MrHandyHitLocation {
  Optics = "o",
  MainBody = "mb",
  ArmOne = "a1",
  ArmTwo = "a2",
  ArmThree = "a3",
  Thruster = "t",
}

export type HitLocation = DefaultHitLocation | MrHandyHitLocation;

export const defaultHitLocationText = Object.freeze<{
  [key: string]: string;
}>({
  [DefaultHitLocation.Head]: "head",
  [DefaultHitLocation.Torso]: "torso",
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

export const getHitLocation = (
  type: HitLocationType,
  value: number
): HitLocation => {
  switch (type) {
    case HitLocationType.Default:
      return getDefaultHitLocation(value);
    case HitLocationType.MrHandy:
      return getMrHandyHitLocation(value);
    default:
      throw new Error(`Invalid hit location type: "${type}"`);
  }
};

export const getHitLocationText = (
  type: HitLocationType,
  location: string
): string => {
  let text: string;

  switch (type) {
    case HitLocationType.Default:
      text = defaultHitLocationText[location];
      break;
    case HitLocationType.MrHandy:
      text = mrHandyHitLocationText[location];
      break;
    default:
      throw new Error(`Invalid hit location type: "${type}"`);
  }

  if (!text) {
    throw new Error(`Invalid hit location: "${location}"`);
  }

  return text;
};

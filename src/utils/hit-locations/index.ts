import { CriticalHitLocation } from "../damage/critical-hit";
import {
  DefaultHitLocation,
  getDefaultHitLocation,
  defaultHitLocationText,
  getDefaultCriticalHitLocation,
} from "./default";

import {
  MrHandyHitLocation,
  getMrHandyHitLocation,
  mrHandyHitLocationText,
  getMrHandyCriticalHitLocation,
} from "./mr-handy";

export enum HitLocationType {
  Default = "default",
  MrHandy = "handy",
}

export type HitLocation = DefaultHitLocation | MrHandyHitLocation;

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
  location: HitLocation
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

export const getCriticalHitLocation = (
  type: HitLocationType,
  location: HitLocation
): CriticalHitLocation => {
  switch (type) {
    case HitLocationType.Default:
      return getDefaultCriticalHitLocation(location as DefaultHitLocation);
    case HitLocationType.MrHandy:
      return getMrHandyCriticalHitLocation(location as MrHandyHitLocation);
    default:
      throw new Error(`Invalid hit location type: "${type}"`);
  }
};

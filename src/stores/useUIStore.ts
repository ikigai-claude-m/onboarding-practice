import { Observable } from "../observable/Observable"


export enum PopUpNeutralState {
  Hide,
  GameExit,
  FastClickToTurbo,
}
export enum PopUpErrorState {
  Hide = 0,
  Insufficient = 1,
  BetFailed = 2,
  BetFailedOnServer = 3,
}
export enum PopUpBlockState {
  Hide = 0,
  JurisdictionRestrictions = 1,
  SessionExpired = 2,
  SomethingWrong = 3,
  Maintenance = 4,
}
export class UIStore {
  prepareOpen = Observable<boolean>(true)
}

export const useUIStore = new UIStore()

import { Observable } from "../observable/Observable";

export class UIStore {
  prepareOpen = Observable<boolean>(true);
}

export const useUIStore = new UIStore();

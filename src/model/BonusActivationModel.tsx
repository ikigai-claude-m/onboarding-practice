import { DEVICE_TYPE, Utils } from "../utility/Utils";
import { Observable } from "../observable/Observable";

class BonusActivationModel {
  public isLandscape = Observable<boolean>(true);
  public defaultLanguage = "";
  public language = Observable<string>("en");
  public isMobile: boolean = Utils.getDeviceType() != DEVICE_TYPE.DESKTOP;
  public isFastSpeedEnable = true;

  constructor() {}

  public get isHorizontal() {
    return this.isLandscape.get() ?? true;
  }

  public get isMobileHorizontal(): boolean {
    return this.isMobile && this.isHorizontal;
  }

  public get isMobileVertical(): boolean {
    return this.isMobile && !this.isHorizontal;
  }
}

export const bonusActivationModel = new BonusActivationModel();

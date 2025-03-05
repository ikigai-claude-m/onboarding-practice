import * as PIXI from 'pixi.js'
import { DEVICE_TYPE, Utils } from '../utility/Utils'
import { Observable } from '../observable/Observable'


class BonusActivationModel {
  private _isDemo = false
  private _cheatToolsOpen = false
  public isLandscape = Observable<boolean>(true)
  public defaultLanguage = ''
  public language = Observable<string>('en')
  public isMobile: boolean = Utils.getDeviceType() != DEVICE_TYPE.DESKTOP
  public isFastSpeedEnable = true

  constructor() {
    // todo: add listener for language change
  }

  public updateEnvSetting() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const setting = PIXI.Assets.get(`setting/EnvSetting.json`)
    if (!setting) return
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    this._isDemo = setting.isDemo ? setting.isDemo : false
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    this._cheatToolsOpen = setting.cheatTools ? setting.cheatTools : false
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    this.defaultLanguage = setting.language ?? 'en'
    this.language.set(this.defaultLanguage)
  }

  public get isHorizontal() {
    return this.isLandscape.get() ?? true
  }

  public get isMobileHorizontal(): boolean {
    return this.isMobile && this.isHorizontal
  }

  public get isMobileVertical(): boolean {
    return this.isMobile && !this.isHorizontal
  }

  public get isDemo() {
    return this._isDemo
  }

  public set isDemo(value) {
    this._isDemo = value
  }

  public get cheatToolOpen() {
    return this._isDemo && this._cheatToolsOpen
  }

}

export const bonusActivationModel = new BonusActivationModel()

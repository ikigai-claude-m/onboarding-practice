import { Application, Point } from 'pixi.js'
import { bonusActivationModel } from '../model/BonusActivationModel'
import { Subscribes } from '../observable/Observable'

export default class GameManager {
  public static app: Application
  public static subscribes: Subscribes = []
  private static isInit = false
  public static spinButtonPosition = new Point(0, 0)

  public static autoSpinSelectedCount = 0

  public static init() {
    if (this.isInit) return
    this.isInit = true
  }
  
  // demo
  public static set isDemo(isDemo: boolean) {
    bonusActivationModel.isDemo = isDemo
  }

  public static get isDemo() {
    return bonusActivationModel.isDemo
  }

}

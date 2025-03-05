
import { uiSetting } from '../config/UiSettingConfig'
import { Core } from '../core/Core'
import { System } from '../core/System'
import GameManager from '../managers/GameManager'
import { bonusActivationModel } from '../model/BonusActivationModel'
import { Subscribes } from '../observable/Observable'
import { BonusActivationSystem } from '../system/bonusActivationSystem'
import { Preload } from '../utility/Preload'
import { DEVICE_TYPE, Utils } from '../utility/Utils'

export class BonusActivationCore extends Core {
    private subscribes: Subscribes = null
    private bonusActivationSystem: BonusActivationSystem | null = null
    private systems: System[] = []
 
  public async initial() {
    await Preload.load((progress) => {
        console.log('progress', progress)
      })

      const resolution = Utils.getDeviceType() == DEVICE_TYPE.DESKTOP ? window.devicePixelRatio || 1 : 1
    await this.createApplication({
        autoStart: true,
      sharedTicker: false,
      resolution,
      antialias: true,
      backgroundColor: '#151a25',
    })
    GameManager.app = this.app!
    this.initialSystem()
    this.registerView()
    this.onResizeHandle(window.innerWidth, window.innerHeight)
    this.observer()
  }

  public release() {
    this.unobserve()
    super.release()
  }

  private unobserve() {
    this.subscribes?.forEach((subscribe) => {
      if (subscribe) subscribe()
    })
    this.subscribes = null
  }

    public redrawView(isLandScope: boolean) {
    const size = this.getResizeWH(isLandScope)
    this.resize(size.width, size.height)
    this.redrawAll(size.width, size.height)
  }

  private getResizeWH(isLandScope: boolean) {
    const size = isLandScope
      ? { width: uiSetting.gameWidth, height: uiSetting.gameHeight }
      : { width: uiSetting.gameHeight, height: uiSetting.gameWidth }
    return size
  }

  private registerView() {
    this.systems.forEach((sys) => {
      this.addView(sys.views())
    })
  }

  protected onResizeHandle(width: number, height: number) {
    bonusActivationModel.isLandscape.set(Utils.isLandscape)
    this.resizeCanvas(width, height)
  }

  private observer() {
    this.unobserve()
    this.subscribes = [bonusActivationModel.isLandscape.subscribe(this.updateOrientation.bind(this))]
  }

  private updateOrientation(isLandScope: boolean) {
    this.redrawView(isLandScope)
  }


  private calculateDimensions(
    width: number,
    height: number,
    windowRatio: number,
    designRatio: number,
    isLandscape: boolean
  ) {
    return windowRatio < designRatio
      ? this.getCalculateHeight(width, height, isLandscape)
      : this.getCalculateWidth(width, height, isLandscape)
  }
  private resizeCanvas(width: number, height: number) {
    const style = this.getCanvas()?.style
    if (!style) return

    const windowRatio = width / height
    const designRatio = Utils.isLandscape
      ? uiSetting.gameWidth / uiSetting.gameHeight
      : uiSetting.gameHeight / uiSetting.gameWidth
    const isLandscape = Utils.isLandscape
    const newWH = this.calculateDimensions(width, height, windowRatio, designRatio, isLandscape)

    style.width = newWH.width
    style.height = newWH.height
  }

  private getCalculateHeight(w: number, _h: number, isLandscape: boolean) {
    return {
      width: `${w}px`,
      height: `${
        w * (isLandscape ? uiSetting.gameHeight / uiSetting.gameWidth : uiSetting.gameWidth / uiSetting.gameHeight)
      }px`,
    }
  }
  private getCalculateWidth(_w: number, h: number, isLandscape: boolean) {
    return {
      width: `${
        h * (isLandscape ? uiSetting.gameWidth / uiSetting.gameHeight : uiSetting.gameHeight / uiSetting.gameWidth)
      }px`,
      height: `${h}px`,
    }
  }

  private initialSystem() {

    this.bonusActivationSystem = new BonusActivationSystem()

    this.systems = [
      this.bonusActivationSystem,
    ]
    // this.systems = [this.backgroundSystem, this.uiSystem]
  }

}

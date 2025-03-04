
import { uiSetting } from '../config/UiSettingConfig'
import { Core } from '../core/Core'
import { Utils } from '../utility/Utils'

export class BonusActivationCore extends Core {
 
  public async initial() {
    await this.createApplication({
      backgroundColor: '#151a25',
    })
    this.onResizeHandle(window.innerWidth, window.innerHeight)
  }

  protected onResizeHandle(width: number, height: number) {
    this.resizeCanvas(width, height)
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

}

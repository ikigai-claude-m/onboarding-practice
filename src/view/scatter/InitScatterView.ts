import * as PIXI from 'pixi.js'
import { Tween } from '../../tween/Tween'

import { UIUtil } from '../../common/util/UIUtil'
import { View } from '../../core/View'
import { GradientConfig, GradientTextTexture } from '../../utility/GradientTextTexture'

export interface DisplayConfig {
  showDuration: number
  delayBeforeClose: number
  waitPlayerClick?: boolean
}
export enum ButtonTextureMapping {
  letsGo,
}

export class InitScatterView extends View {
  private popUpMaskId = 'pop_up_mask'
  private buttonEndId = 'button_end'
  protected buttonTexture = 'button/InGameButton.png'

  private isAnimating = false
  protected originalScale = 1
  private currentTween: (() => void) | null = null

  public textButtonGradient: GradientConfig = {
    fillGradient: [
      { position: 0, color: '#FED302' },
      { position: 0.23, color: '#FED302' },
      { position: 0.51, color: '#FFEF02' },
      { position: 0.58, color: '#F7AA01' },
    ],
    strokeGradient: [
      { position: 0, color: '#FFFE94' },
      { position: 0.08, color: '#BA6133' },
      { position: 0.33, color: '#FEFB3D' },
      { position: 0.71, color: '#FCB115' },
      { position: 0.94, color: '#DE9912' },
      { position: 1, color: '#DEB862' },
    ],
    style: {
      shadowColor: 'rgba(63, 36, 16, 1)',
      strokeWidth: 1,
      thickStrokeWidth: 1,
      shadowOffset: {
        x: 3,
        y: 10,
      },
      letterSpacing: '4px',
    },
  }

  public initial() {
    this.createBackground()
  }
  public release() {
    super.release()
  }

  public onDraw(width: number, height: number): void {
    console.log('do parent onDraw')
    this.drawSprite(width, height)
  }
  public hide() {
    // this.changeButtonImage(false, ButtonTextureMapping.letsGo)
    // this.buttonEnd.visible = false
    // super.hide()
  }

  protected createBackground() {
    const background = this.createGraphic(this.popUpMaskId)
    if (!background) return
    const bgSetting = UIUtil.getGrayBgSetting()
    const color = 'rgba(21, 26, 37, 0.8)'
    background.rect(bgSetting.position, bgSetting.position, bgSetting.maxLength, bgSetting.maxLength)
    background.fill(color)
  }

  protected createLetsGoButton() {
    this.createTextButton(this.buttonEndId, 'LET\'S GO', 63)
  }
  public createTextButton(
    id: string,
    txt: string,
    fontSize: number,
    gradient: GradientConfig = this.textButtonGradient
  ) {
    const button = this.createSprite(id, this.buttonTexture)
    if (!button) return
    button.anchor.set(0.5)
    button.visible = false
    button.scale.set(0.75)

    const textLetGo = new PIXI.Sprite()
    textLetGo.texture = GradientTextTexture.createGradientTextTexture(txt, fontSize, gradient)
    textLetGo.anchor.set(0.5)
    textLetGo.position.set(0, -90)
    button.addChild(textLetGo)

    this.originalScale = button.scale.x
  }

  public get bgMask(): PIXI.Graphics {
    return this.getObject(this.popUpMaskId) as PIXI.Graphics
  }

  public get buttonEnd(): PIXI.Sprite {
    return this.getObject(this.buttonEndId) as PIXI.Sprite
  }

  protected drawSprite(width: number, height: number) {
    const canvas = document.querySelector('canvas')
    if (!this.bgMask) return
    this.bgMask.width = canvas?.width ?? width
    this.bgMask.height = canvas?.height ?? height
    this.bgMask.position.set(width / 2, height / 2)
  }

  public onButtonAnim(targetRef: PIXI.Sprite) {
    if (this.isAnimating) return
    this.isAnimating = true
    const target = targetRef

    if (this.currentTween) {
      this.currentTween()
      this.currentTween = null
    }
    this.currentTween = new Tween()
      .duration(0.05, (ratio) => {
        const scale = this.originalScale * (1 - 0.1 * ratio)
        target.scale.set(scale)
      })
      .duration(0.1, (ratio) => {
        const scale = this.originalScale * (0.9 + 0.2 * ratio)
        target.scale.set(scale)
      })
      .duration(0.05, (ratio) => {
        const scale = this.originalScale * (1.1 - 0.1 * ratio)
        target.scale.set(scale)
      })
      .onComplete(() => {
        this.isAnimating = false
        this.currentTween = null
      })
      .start()
  }
  public changeButtonImage(isHover: boolean, type: ButtonTextureMapping) {
    const texture = isHover ? this.getButtonTexture(type)?.hover : this.getButtonTexture(type)?.normal
    if (texture != '') {
      this.buttonEnd.texture = PIXI.Texture.from(texture)
    }
  }
  public getButtonTexture(type: ButtonTextureMapping) {
    const textureType = {
      normal: '',
      hover: '',
    }
    switch (type) {
      case ButtonTextureMapping.letsGo:
        textureType.normal = 'button/InGameButton.png'
        textureType.hover = 'button/InGameButtonHover.png'
        break
      default:
        break
    }
    return textureType
  }
}

import { AnimationStateListener, Spine, TrackEntry } from '@esotericsoftware/spine-pixi-v8'
import * as PIXI from 'pixi.js'


import { uiSetting } from '../../config/UiSettingConfig'
import { bonusActivationModel } from '../../model/BonusActivationModel'

export interface ILayoutSetting {
  paddingTop?: number
  paddingBottom?: number
  paddingLeft?: number
  paddingRight?: number
  paddingX?: number
  paddingY?: number
  isHorizontal: boolean
}

export interface ISpineSetting {
  skeleton: string
  atlas: string
  scale: number
  animation: string
  blurAnimation: string
  idleAnimation: string
  landingAnimation: string
  boostAnimation: {
    reveal: string
    loop: string
  }
}

export interface ISpineCreateSetting {
  spineSetting: ISpineSetting
  loop: boolean
  active: boolean
}

export interface ITextAngleSetting {
  radiusX: number
  radiusY: number
  centerX: number
  centerY: number
  totalAngle: number
}

export interface IGraphicsSetting {
  width: number
  height: number
  radius?: number
  color: PIXI.FillInput
  stroke?: {
    width: number
    strokeInput: PIXI.StrokeInput
  }
  normalTint?: PIXI.ColorSource
  hoverTint?: PIXI.ColorSource
  clickTint?: PIXI.ColorSource
}

export interface ISpineAnimation {
  track: number
  animation: string
  loop: boolean
}

export interface ISpineContinuousAnimation {
  spine: Spine
  animations: ISpineAnimation[]
  reset?: boolean
  listener?: AnimationStateListener
  completeAnimation?: string
}

// export interface IScrollBoxSetting {
//   width: number
//   height: number
//   padding?: number
//   vertPadding?: number
//   horPadding?: number
//   elementsMargin?: number
//   background?: number
//   radius?: number
//   globalScroll?: boolean
//   shiftScroll?: boolean
//   disableDynamicRendering?: boolean
// }

export enum NineSliceSpriteName {
  GameStateInfoBackground = 'GameStateInfoBackground',
  PopupBackground = 'PopupBackground',
  MessageBackground = 'MessageBackground',
  PopupBackgroundAS = 'PopupBackgroundAS',
  PopupNeutralBackground = 'PopupNeutralBackground',
  PopUpErrorBackground = 'PopUpErrorBackground',
}
export class UIUtil {
  static createSpine(setting: ISpineSetting): Spine {
    const spine = Spine.from({
      skeleton: setting.skeleton,
      atlas: setting.atlas,
      scale: setting.scale ?? 1,
    })
    spine.state.data.defaultMix = 0.2
    return spine
  }

  static resetSpine(spine: Spine, setToSetupPose = false) {
    if (!spine) return
    spine.state.timeScale = 1
    spine.state.clearTracks()
    spine.state.clearListeners()
    if (setToSetupPose) spine.skeleton.setToSetupPose()
  }

  static getCreateSpineSetting(setting: ISpineSetting, loop = true, active = true) {
    return {
      spineSetting: setting,
      loop: loop,
      active: active,
    } as ISpineCreateSetting
  }

  static playSpineContinuosAnimation(setting: ISpineContinuousAnimation) {
    const spine = setting.spine
    const reset = setting.reset ?? true
    const listener = setting.listener
    const animations = setting.animations
    const lastAnimation = setting.completeAnimation ?? animations[animations.length - 1].animation
    const defaultListener = {
      complete(entry: TrackEntry) {
        if (entry.animation?.name == lastAnimation) {
          listeners.forEach((listener) => spine.state.removeListener(listener))
        }
      },
    } as AnimationStateListener
    const listeners: AnimationStateListener[] = []
    if (listener) listeners.push(listener)
    listeners.push(defaultListener)

    if (reset) this.resetSpine(spine)
    listeners.forEach((listener) => spine.state.addListener(listener))
    animations.forEach((setting, idx) => {
      const trackIndex = setting.track
      const animation = setting.animation
      const loop = setting.loop
      if (idx == 0) spine.state.setAnimation(trackIndex, animation, loop)
      else spine.state.addAnimation(trackIndex, animation, loop)
    })
    spine.visible = true
  }

  static buttonStateSpriteNames(btn: string) {
    const normal = `${btn}${uiSetting.buttonNormalSubtitle}`
    const hover = `${btn}${uiSetting.buttonHoverSubtitle}`
    return { normal, hover }
  }

  static getYellowTextShadow(idx: number) {
    switch (idx) {
      case 0:
        return {
          /** Set alpha for the drop shadow  */
          alpha: 0.27,
          /** Set a shadow blur radius */
          blur: 2,
          /** A fill style to be used on the  e.g., 'red', '#00FF00' */
          color: 'rgba(0, 0, 0, 0.27)',
          /** Set a distance of the drop shadow */
          distance: 1,
        }
      case 1:
        return {
          /** Set alpha for the drop shadow  */
          alpha: 0.27,
          /** Set a shadow blur radius */
          blur: 4,
          /** A fill style to be used on the  e.g., 'red', '#00FF00' */
          color: 'rgba(0, 0, 0, 0.27)',
          /** Set a distance of the drop shadow */
          distance: 3,
        }
      default:
        return {
          /** Set alpha for the drop shadow  */
          alpha: 0.27,
          /** Set a shadow blur radius */
          blur: 2,
          /** A fill style to be used on the  e.g., 'red', '#00FF00' */
          color: 'rgba(0, 0, 0, 0.27)',
          /** Set a distance of the drop shadow */
          distance: 1,
        }
    }
  }

  static getWhiteShadow(idx: number) {
    switch (idx) {
      case 0:
        return {
          /** Set alpha for the drop shadow  */
          alpha: 0.27,
          /** Set a shadow blur radius */
          blur: 2,
          /** A fill style to be used on the  e.g., 'red', '#00FF00' */
          color: 'rgba(0, 0, 0, 0.27)',
          /** Set a distance of the drop shadow */
          distance: 1,
        }
      case 1:
        return {
          /** Set alpha for the drop shadow  */
          alpha: 0.27,
          /** Set a shadow blur radius */
          blur: 4,
          /** A fill style to be used on the  e.g., 'red', '#00FF00' */
          color: 'rgba(0, 0, 0, 0.27)',
          /** Set a distance of the drop shadow */
          distance: 3,
        }
      default:
        return {
          /** Set alpha for the drop shadow  */
          alpha: 0.27,
          /** Set a shadow blur radius */
          blur: 2,
          /** A fill style to be used on the  e.g., 'red', '#00FF00' */
          color: 'rgba(0, 0, 0, 0.27)',
          /** Set a distance of the drop shadow */
          distance: 1,
        }
    }
  }

  static getErrorTitleTextShadow(idx: number) {
    switch (idx) {
      case 0:
        return {
          /** Set alpha for the drop shadow  */
          alpha: 0.27,
          /** Set a angle of the drop shadow */
          //   angle: Math.PI / 4, // 45
          /** Set a shadow blur radius */
          blur: 3.5,
          /** A fill style to be used on the  e.g., 'red', '#00FF00' */
          color: 'rgba(0, 0, 0, 0.27)',
          /** Set a distance of the drop shadow */
          distance: 1,
        }
      case 1:
        return {
          /** Set alpha for the drop shadow  */
          alpha: 0.27,
          /** Set a angle of the drop shadow */
          //   angle: Math.PI / 4, // 90
          /** Set a shadow blur radius */
          blur: 7,
          /** A fill style to be used on the  e.g., 'red', '#00FF00' */
          color: 'rgba(0, 0, 0, 0.27)',
          /** Set a distance of the drop shadow */
          distance: 3,
        }
      default:
        return {
          /** Set alpha for the drop shadow  */
          alpha: 0.27,
          /** Set a angle of the drop shadow */
          //   angle: Math.PI / 4, // 45
          /** Set a shadow blur radius */
          blur: 3.5,
          /** A fill style to be used on the  e.g., 'red', '#00FF00' */
          color: 'rgba(0, 0, 0, 0.27)',
          /** Set a distance of the drop shadow */
          distance: 1,
        }
    }
  }
  static getGradient(gradientColors: number[], stops: number[], x0: number, y0: number, x1: number, y1: number) {
    const fill = new PIXI.FillGradient(x0, y0, x1, y1)
    const colors = gradientColors.map((color) => PIXI.Color.shared.setValue(color).toNumber())
    colors.forEach((number, index) => {
      const ratio = stops[index]
      fill.addColorStop(ratio, number)
    })
    return fill
  }

  static confirmTextInRequireWidth(text: PIXI.Text, maxWidth: number, defaultFontSize: number, padding = 0) {
    let fontSize = defaultFontSize
    if (!text) return fontSize

    // Had not been adjusted before
    const requireWidth = maxWidth - padding
    if (text.width < requireWidth && text.style.fontSize == defaultFontSize) {
      // console.log(`hadn't been adjusted: ${text.style.fontSize}`)
      return fontSize
    } else {
      const low = 1
      const high = defaultFontSize
      text.style.fontSize = fontSize
      const interval = 2 // adjust font size, 2 for reduce calculation
      while (fontSize >= low && fontSize <= high) {
        if (text.width >= requireWidth) fontSize -= interval
        else fontSize += interval
        if (fontSize < low) fontSize = 1
        else if (fontSize > high) fontSize = high
        text.style.fontSize = fontSize
        if (fontSize == low || fontSize == high) break
        if (text.width < requireWidth) break
      }
      if (fontSize > defaultFontSize) fontSize = defaultFontSize
      return fontSize
    }
  }

  static confirmTextInRequireHeight(
    text: PIXI.Text,
    maxHeight: number,
    maxWidth: number,
    defaultFontSize: number,
    padding = 0
  ) {
    let fontSize = defaultFontSize
    if (!text) return fontSize

    text.style.wordWrap = true
    text.style.wordWrapWidth = maxWidth

    // Had not been adjusted before
    const requireHeight = maxHeight - padding
    if (text.height < requireHeight && text.style.fontSize == defaultFontSize) {
      // console.log(`hadn't been adjusted: ${text.style.fontSize}`)
      return fontSize
    } else {
      const low = 1
      const high = defaultFontSize
      text.style.fontSize = fontSize
      const interval = 2 // adjust font size, 2 for reduce calculation
      while (fontSize >= low && fontSize <= high) {
        if (text.height >= requireHeight) fontSize -= interval
        else fontSize += interval
        if (fontSize < low) fontSize = 1
        else if (fontSize > high) fontSize = high
        text.style.fontSize = fontSize
        if (fontSize == low || fontSize == high) break
        if (text.height < requireHeight) break
      }
      return fontSize
    }
  }

  static calculateScaleSize(object: PIXI.Container, originScale: number, maxSize: number, byWidth = true) {
    object.scale.set(originScale)
    let fitSize = byWidth ? object.width : object.height
    if (fitSize <= maxSize) return originScale
    else {
      let fitScale = originScale
      while (fitSize > maxSize) {
        const minus = 0.1
        fitScale -= minus
        object.scale.set(fitScale)
        fitSize = byWidth ? object.width : object.height
      }
      return fitScale
    }
  }

  static getTextWithAngle(container: PIXI.Container, text: string, setting: ITextAngleSetting, style?: PIXI.TextStyle) {
    if (!container) return null
    const radius = setting.radiusX
    const radiusY = setting.radiusY
    const centerX = setting.centerX
    const centerY = setting.centerY
    const totalAngle = setting.totalAngle // Total angle (radians)
    const totalTextLength = text.length

    for (let i = 0; i < totalTextLength; i++) {
      const char = text[i]
      const charText = new PIXI.Text({ text: char })
      if (style) charText.style = style
      charText.anchor.set(0.5)

      // Calculate the X position of each text so that they are equally spaced across the width
      const t = i / (totalTextLength - 1) // Normalized variable t from 0 to 1
      const x = centerX - radius / 2 + t * radius // X-axis equidistant distribution
      const y = centerY + Math.pow((t - 0.5) * 2, 2) * radiusY // Y-axis arc, calculate Y coordinate to form arc shape (use quadratic equation to simulate arc)
      charText.x = x
      charText.y = y
      const angle = totalAngle * (t - 0.5) * 2 // Calculate the rotation angle of each character
      charText.rotation = angle
      container.addChild(charText)
    }
  }


  public static layout(containers: PIXI.Container[], length: number, setting?: ILayoutSetting) {
    const paddingTop = setting?.paddingTop ? setting.paddingTop : 0
    const paddingBottom = setting?.paddingBottom ? setting.paddingBottom : 0
    const paddingLeft = setting?.paddingLeft ? setting.paddingLeft : 0
    const paddingRight = setting?.paddingRight ? setting.paddingRight : 0
    const paddingX = setting?.paddingX ? setting.paddingX : 0
    const paddingY = setting?.paddingY ? setting.paddingY : 0
    const isHorizontal = setting ? setting.isHorizontal : true

    const availableWidth = length - paddingLeft - paddingRight
    const availableHeight = length - paddingTop - paddingBottom

    let currentX = paddingLeft
    let currentY = paddingTop
    containers.forEach((container) => {
      if (isHorizontal) {
        if (currentX + container.width > availableWidth) {
          currentX = paddingLeft
          currentY += container.height + paddingY
        }

        container.x = currentX
        container.y = currentY

        currentX += container.width + paddingX
      } else {
        if (currentY + container.height > availableHeight) {
          currentY = paddingTop
          currentX += container.width + paddingX
        }

        container.x = currentX
        container.y = currentY

        currentY += container.height + paddingY
      }
    })
  }

  public static arrangeSpritesInArc(
    sprites: PIXI.Container[],
    radius = 150,
    centerX = 200,
    centerY = 200,
    totalAngle = Math.PI / 3
  ) {
    let currentAngle = -totalAngle * 2 // The starting angle, with the arc center as 0 degrees, is distributed from -totalAngle/2 to +totalAngle/2

    // Calculate the angular separation of each pixel (distribute angles by total angle and total sprite width)
    const totalWidth = sprites.reduce((sum, sprite) => sum + sprite.width, 0)
    const anglePerPixel = totalAngle / totalWidth

    // Arrange each sprite so that they follow an arc
    sprites.forEach((sprite) => {
      // Calculate the center angle of the sprite
      const spriteAngle = currentAngle + (sprite.width / 2) * anglePerPixel

      // Calculate the sprite's position based on angle and radius
      const x = centerX + Math.cos(spriteAngle) * radius
      const y = centerY + Math.sin(spriteAngle) * radius

      // Set the sprite's position
      sprite.x = x
      sprite.y = y

      // Rotate the sprite so that its bottom faces the center of the arc
      sprite.rotation = spriteAngle + Math.PI / 2

      // Update the angle to make room for the next sprite
      currentAngle += sprite.width * anglePerPixel
    })
  }

  public static setButtonHoverEvent(
    button: PIXI.Sprite,
    normalSprite: string,
    hoverSprite: string,
    container?: PIXI.Container
  ) {
    const target: PIXI.Sprite | PIXI.Container = container ? container : button
    this.removeButtonHoverEvent(target)

    target.on('mouseover', () => {
      button.texture = PIXI.Sprite.from(hoverSprite).texture
    })
    target.on('mouseout', () => {
      button.texture = PIXI.Sprite.from(normalSprite).texture
    })
    target.eventMode = 'static'
    target.cursor = 'pointer'
  }

  public static setGraphicsUiEvent(graphics: PIXI.Graphics, setting: IGraphicsSetting, container?: PIXI.Container) {
    const target: PIXI.Graphics | PIXI.Container = container ? container : graphics
    this.removeGraphicsUiEvent(target)
    const normalTint = setting.normalTint ?? 0xffffff
    const hoverTint = setting.hoverTint
    const clickTint = setting.clickTint
    if (!bonusActivationModel.isMobile && hoverTint) {
      target.on('mouseover', () => (graphics.tint = hoverTint))
      target.on('mouseout', () => (graphics.tint = normalTint))
    }
    if (clickTint) {
      target.on('pointerdown', () => (graphics.tint = clickTint))
      target.on('pointerup', () => {
        if (!bonusActivationModel.isMobile) graphics.tint = hoverTint ?? normalTint
        else graphics.tint = normalTint
      })
      target.on('pointerupoutside', () => {
        graphics.tint = normalTint
      })
    }
    target.eventMode = 'static'
    target.cursor = 'pointer'
  }

  public static removeButtonHoverEvent(button: PIXI.Sprite | PIXI.Container | PIXI.Graphics) {
    button.off('mouseover')
    button.off('mouseout')
  }

  public static removeButtonPointerEvent(button: PIXI.Sprite | PIXI.Container | PIXI.Graphics) {
    button.off('pointerup')
    button.off('pointerdown')
    button.off('pointerupoutside')
  }

  public static removeGraphicsUiEvent(graphics: PIXI.Graphics | PIXI.Container) {
    this.removeButtonHoverEvent(graphics)
    this.removeButtonPointerEvent(graphics)
  }

  public static getGrayBgSetting() {
    const maxLength = uiSetting.gameWidth > uiSetting.gameHeight ? uiSetting.gameWidth : uiSetting.gameHeight
    const position = -maxLength / 2
    return {
      maxLength: maxLength,
      position: position,
    }
  }
}

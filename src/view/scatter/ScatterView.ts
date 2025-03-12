import { Sprite } from 'pixi.js'


import { uiSetting } from '../../config/UiSettingConfig'
import { GradientConfig, GradientTextTexture, } from '../../utility/GradientTextTexture'
import { InitScatterView } from './InitScatterView'
import { ISpineSetting } from '../../common/util/UIUtil'
import { AnimationStateListener, TrackEntry } from '@esotericsoftware/spine-pixi-v8'


export default class Scatter extends InitScatterView {
  protected backgroundId = 'background'
  public spriteBg: Sprite | null = null

  constructor() {
    super()
  }

  createObjects() {
    this.createBonusSpine()
    this.createSymbolSpine()
  }

  onDraw(width: number, height: number) {
    console.log('do parent onDraw', width, height)
  }

  createBackground() {
    this.spriteBg = this.createSprite(this.backgroundId, 'winner/Popup_winner.png')!
    this.spriteBg.interactive = true
    this.spriteBg.eventMode = 'static'
    this.spriteBg.anchor.set(0.5)
    this.spriteBg.position.set(uiSetting.gameWidth / 2, uiSetting.gameHeight / 2)
  }

  protected createBonusSpine() {
    const bonusSpine = this.createSpine('Bonus_spine', this.bonusSpineSetting)
    if (!bonusSpine) return
    bonusSpine.position.set(uiSetting.gameWidth / 2, (uiSetting.gameHeight / 2) - 150)

    const animations = [
      { animation: this.bonusSpineSetting.idleAnimation, delay: 0, loop: true, idx: 0 },
      { animation: this.bonusSpineSetting.blurAnimation, delay: 2000, loop: true, idx: 0 },
      { animation: this.bonusSpineSetting.idleAnimation, delay: 2500, loop: true, idx: 0 },
      { animation: this.bonusSpineSetting.landingAnimation, delay: 3000, loop: false, idx: 0 },
      { animation: this.bonusSpineSetting.animation, delay: 3500, loop: false, idx: 0 },
    ]

    const firstAnimation = animations[0].animation
    const lastAnimation = animations[animations.length - 1].animation

    const listener = {
      start(entry: TrackEntry) {
        if (entry.animation?.name == firstAnimation) {
          bonusSpine.visible = true
        }
      },
      complete(entry: TrackEntry) {
        if (entry.animation?.name == lastAnimation) {
          bonusSpine.visible = true
        }
      },
    } as AnimationStateListener

    bonusSpine.state.addListener(listener)

    animations.forEach(({ animation, delay, loop, idx }, index) => {
      setTimeout(() => {
        if (index == 0) {
          bonusSpine.state.setAnimation(idx, animation, loop)
        } else {
          bonusSpine.state.addAnimation(idx, animation, loop)
        }
      }, delay)
    })
  
    this.getContainer()?.addChild(bonusSpine)
  }

  protected async createSymbolSpine() {
    const symbolSpine = this.createSpine('Symbol_spine', this.symbolSpineSetting)
    if (!symbolSpine) return
    symbolSpine.position.set((uiSetting.gameWidth / 2), (uiSetting.gameHeight / 2) + 200)

    const animations = [
      { animation: this.symbolSpineSetting.animation, delay: 0, loop: true, idx: 0 },
      { animation: this.symbolSpineSetting.boostAnimation.reveal, delay: 2000, loop: false, idx: 0 },
      { animation: this.symbolSpineSetting.boostAnimation.loop, delay: 4000, loop: true, idx: 0 },
    ]

    const firstAnimation = animations[0].animation
    const lastAnimation = animations[animations.length - 1].animation

    const sprite = await this.createWildNumberImage()

    const listener = {
      start(entry: TrackEntry) {
        if (entry.animation?.name == firstAnimation) {
          symbolSpine.visible = true
          symbolSpine.addChild(sprite)
        } else {
          sprite.visible = false
        }
      },
      complete(entry: TrackEntry) {
        if (entry.animation?.name == lastAnimation) {
          symbolSpine.visible = true
        }
      },
    } as AnimationStateListener

    symbolSpine.state.addListener(listener)

    animations.forEach(({ animation, delay, loop, idx }, index) => {
      setTimeout(() => {
        if (index == 0) {
          symbolSpine.state.setAnimation(idx, animation, loop)
        } else {
          symbolSpine.state.addAnimation(idx, animation, loop)
        }
      }, delay)
    })
    this.getContainer()?.addChild(symbolSpine)
  }

  private createWildNumberImage(): Promise<Sprite> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img1 = new Image()
      const img2 = new Image()
      Promise.all([new Promise((resolve) => {
        img1.onload = resolve
        img1.src = 'wildNumbers/Number1.png'
      }), new Promise((resolve) => {
        img2.onload = resolve
        img2.src = 'wildNumbers/NumberX.png'
      })]).then(() => {
        ctx.drawImage(img1, 0, 0, img1.width - 20, img1.height - 20)
        ctx.drawImage(img2, 65, 0, img2.width - 20, img2.height - 20)
        const sprite = Sprite.from(canvas)
        sprite.anchor.set(0.5, 0.95)
        resolve(sprite)
      })
    })
  }

  private get bonusSpineSetting() {
    const setting = uiSetting.bonusSpine
    return {
      skeleton: setting.skeleton,
      atlas: setting.atlas,
      scale: 1,
      animation: setting.animation,
      blurAnimation: setting.blurAnimation,
      idleAnimation: setting.idleAnimation,
      landingAnimation: setting.landingAnimation,
    } as ISpineSetting
  }

  private get symbolSpineSetting () {
    const setting = uiSetting.symbolSpine
    return {
      skeleton: setting.skeleton,
      atlas: setting.atlas,
      scale: 1,
      animation: setting.animation,
      boostAnimation: {
        reveal: setting.boostAnimation.reveal,
        loop: setting.boostAnimation.loop
      }
    } as ISpineSetting
  }


  protected addGradientText(text: string, posX: number, posY: number, fontSize: number, isAmount: boolean) {
    const sprite = this.createGradientText(text, posX, posY, fontSize, isAmount)
    this.getContainer()?.addChild(sprite)
  }

  protected createGradientText(text: string, posX: number, posY: number, fontSize: number, isAmount: boolean) {
    const sprite = this.createCanvasText(text, fontSize, isAmount)
    sprite.x = posX
    sprite.y = posY
    return sprite
  }


  createCanvasText(text: string, fontSize: number, isAmount: boolean) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const { width, height } = GradientTextTexture.getGradientTextSize(
      text,
      { fontSize: fontSize, font: uiSetting.gradientFont },
      fontSize
    )
    canvas.width = width * 1.2
    canvas.height = height * 3
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.font = `normal 500 ${fontSize}px ${uiSetting.gradientFont}`
    ctx.textBaseline = 'top'

    const shadows = [
      { offsetX: 0, offsetY: 55.522, blur: 16.072, color: 'rgba(35, 16, 4, 0.01)' },
      { offsetX: 0, offsetY: 35.067, blur: 14.611, color: 'rgba(35, 16, 4, 0.1)' },
      { offsetX: 0, offsetY: 20.455, blur: 11.689, color: 'rgba(35, 16, 4, 0.34)' },
      { offsetX: 0, offsetY: 8.767, blur: 8.767, color: 'rgba(35, 16, 4, 0.6)' },
      { offsetX: 0, offsetY: 2.922, blur: 4.383, color: 'rgba(35, 16, 4, 1)' },
    ]

    const fillGradient = [
      { position: 0.30, color: '#FED302'},
      { position: 0.42, color: '#FED302'},
      { position: 0.48, color: '#FFEF02'},
      { position: 0.51, color: '#F7AA01'},
    ]

    const gradiantConfig = this.gradientConfig
    const textGradient = GradientTextTexture.createGradient(ctx, canvas.height, fillGradient)
    const strokeGradient = GradientTextTexture.createGradient(ctx, canvas.height, gradiantConfig.strokeGradient)

    const metrics = ctx.measureText(text)
    const textWidth = metrics.width
    const x = (canvas.width - textWidth) / 2
    const y = (canvas.height - fontSize) / 2
    const letterSpacing = 3
    let currentX = x

    shadows.forEach((shadow) => {
      ctx.save()
      ctx.fillStyle = shadow.color
      ctx.filter = `blur(${shadow.blur}px)`
      currentX = x
      for (const letter of text) {
        ctx.fillText(letter, currentX + shadow.offsetX, y + 8 + shadow.offsetY)
        currentX += ctx.measureText(letter).width + letterSpacing
      }
      ctx.restore()
    })

    ctx.fillStyle = '#000000'
    ctx.filter = 'none'
    currentX = x
    for (const letter of text) {
      ctx.fillText(letter, currentX, y + (isAmount ? 10 : 7))
      currentX += ctx.measureText(letter).width + letterSpacing
    }

    ctx.strokeStyle = '#3F2410'
    ctx.lineWidth = isAmount ? 8 : 5
    currentX = x
    for (const letter of text) {
      ctx.strokeText(letter, currentX, y)
      currentX += ctx.measureText(letter).width + letterSpacing
    }

    ctx.fillStyle = textGradient
    ctx.lineWidth = 3
    ctx.strokeStyle = strokeGradient
    currentX = x
    for (const letter of text) {
      ctx.fillText(letter, currentX + 2, y)
      ctx.strokeText(letter, currentX, y)
      currentX += ctx.measureText(letter).width + letterSpacing
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const bounds = this.getAlphaBounds(imageData)

    const trimmedCanvas = document.createElement('canvas')
    trimmedCanvas.width = bounds.width
    trimmedCanvas.height = bounds.height
    const trimmedCtx = trimmedCanvas.getContext('2d')!

    trimmedCtx.drawImage(
      canvas,
      bounds.left,
      bounds.top,
      bounds.width,
      bounds.height,
      0,
      0,
      bounds.width,
      bounds.height
    )

    const sprite = Sprite.from(trimmedCanvas)
    sprite.anchor.set(0.5)
    return sprite
  }

  private getAlphaBounds(imageData: ImageData) {
    const { width, height, data } = imageData
    let minX = width
    let minY = height
    let maxX = 0
    let maxY = 0

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const alpha = data[(y * width + x) * 4 + 3]
        if (alpha > 0) {
          minX = Math.min(minX, x)
          minY = Math.min(minY, y)
          maxX = Math.max(maxX, x)
          maxY = Math.max(maxY, y)
        }
      }
    }

    if (minX > maxX || minY > maxY) {
      return { left: 0, top: 0, width, height }
    }

    const padding = 2
    minX = Math.max(0, minX - padding)
    minY = Math.max(0, minY - padding)
    maxX = Math.min(width - 1, maxX + padding)
    maxY = Math.min(height - 1, maxY + padding)

    return {
      left: minX,
      top: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1,
    }
  }

  public gradientConfig: GradientConfig = {
    fillGradient: [
      { position: 0.0, color: '#F4ED4A'},
      { position: 0.39, color: '#F4ED4A'},
      { position: 0.55, color: '#FEA602'},
    ],
    strokeGradient: [
      { position: 0.21, color: '#9921024F'},
      { position: 0.2854, color: '#FBF4BF00'},
      { position: 0.3956, color: '#FBF4BF00'},
      { position: 0.5116, color: '#FBF4BF4F'},
      { position: 0.645, color: '#FBF4BF00'},
      { position: 0.79, color: '#FBF4BF00'},
    ],
    style: {
      shadowColor: '#9A2203',
      strokeWidth: 6,
      thickStrokeWidth: 12,
      shadowOffset: {
        x: 0,
        y: 0,
      },
      letterSpacing: '8px',
    },
  }
}
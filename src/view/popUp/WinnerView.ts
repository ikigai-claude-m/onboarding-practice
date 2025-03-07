import { Sprite } from 'pixi.js'
import { PopUpView } from './PopUpView'
import { uiSetting } from '../../config/UiSettingConfig'
import { GradientConfig, GradientTextTexture, ICanvasSetting, IShadowSetting } from '../../utility/GradientTextTexture'
import * as PIXI from 'pixi.js'


export default class WinnerView extends PopUpView {
  protected backgroundId = 'background'
  public spriteBg: Sprite | null = null

  constructor() {
    super()
  }

  createObjects() {
    this.createBackground()
    this.createTexts()
    this.createAndModifyLetsGoButton()
  }

  protected createTexts() {
    this.createTitle() // CONGRATULATIONS!
    this.createSubtitle("YOU'VE WON", true) // YOU'VE WON
    this.addGradientText('10000.00', 954, 615, 90)
    this.addGradientText('USD', 954, 730, 55)
    this.createSubtitle("IN 'X' FREE SPINS", false) // YOU'VE WON
  }

  createAndModifyLetsGoButton() {
    this.createLetsGoButton()
    this.buttonEnd.anchor.set(0.5)
    this.buttonEnd.visible = true
    this.buttonEnd.interactive = true
    this.buttonEnd.position.set(uiSetting.gameWidth / 2, 1040)
    this.buttonEnd.cursor = 'pointer'
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

  private createTitle() {
    const sprite = this.createCanvasTitleText('CONGRATULATIONS!', 68)
      const radius = 500
      const maxRopePoints = 250
      const step = Math.PI / maxRopePoints
      let ropePoints = maxRopePoints - Math.round((sprite.texture.width / (radius * Math.PI)) * maxRopePoints)
      ropePoints /= 2.7
      const points = []
      for (let i = maxRopePoints - ropePoints; i > ropePoints; i--) {
        const x = radius * Math.cos(step * i)
        const y = radius * Math.sin(step * i)
        points.push(new PIXI.Point(x, -y))
      }
      const rope = new PIXI.MeshRope({
        texture: sprite.texture,
        points: points,
        width: sprite.texture.width,
        height: sprite.texture.height
      })
      this.getContainer()?.addChild(rope)
      const bounds = this.getContainer()?.getLocalBounds();
      const matrix = new PIXI.Matrix();
      matrix.tx = -bounds!.x;
      matrix.ty = -bounds!.y;
      rope.x = 964
      rope.y = 806
  }

  private createSubtitle (text: string, isFirst: boolean) {
    const sprite = this.createCanvasSubTitleText(text, 40)
    this.getContainer()?.addChild(sprite)
    const bounds = this.getContainer()?.getLocalBounds();
      const matrix = new PIXI.Matrix();
      matrix.tx = -bounds!.x;
      matrix.ty = -bounds!.y;
      sprite.x = 954
      sprite.y = isFirst ? 473 : 865
  }

   private createCanvasTitleText(text: string, fontSize: number) {
    const setting = this.getCanvasSetting({ fontSize: fontSize, letterSpacing: '4.654px' })
    const { canvas, ctx } = GradientTextTexture.createOriginCanvas(text, setting)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2 + 6

    // top
    const { canvas: topCanvas, ctx: topCtx } = GradientTextTexture.copyCanvas(canvas, ctx!)
    const topStrokeGradientSetting = [
      { position: 0.04, color: '#992102' },
      { position: 0.13, color: 'rgba(251, 244, 191, 0)' },
      { position: 0.32, color: 'rgba(251, 244, 191, 0)' },
      { position: 0.52, color: 'rgba(251, 244, 191, 100)' },
      { position: 0.75, color: 'rgba(251, 244, 191, 0)' },
      { position: 0.96, color: 'rgba(251, 244, 191, 0)' },
      { position: 1, color: '#992102' },
    ]
    const topFillGradientSetting = [
      { position: 0, color: '#F4ED4A' },
      { position: 1, color: '#FEA602' },
    ]
    const topFillGradient = GradientTextTexture.createGradient(topCtx!, topCanvas.height, topFillGradientSetting)
    const topStrokeGradient = GradientTextTexture.createGradient(topCtx!, topCanvas.height, topStrokeGradientSetting)
    GradientTextTexture.strokeText(topCtx!, topStrokeGradient, text, centerX, centerY, 5)
    GradientTextTexture.fillText(topCtx!, text, centerX, centerY, topFillGradient)

    // stroke
    const { canvas: strokeCanvas, ctx: strokeCtx } = GradientTextTexture.copyCanvas(canvas, ctx!)
    const strokeGradientSetting = [
      { position: 0.04, color: '#9A2203' },
      { position: 1, color: '#9A2203' },
    ]
    const strokeGradient = GradientTextTexture.createGradient(topCtx!, topCanvas.height, strokeGradientSetting)
    GradientTextTexture.strokeText(strokeCtx!, strokeGradient, text, centerX, centerY, 7)

    strokeCtx!.drawImage(topCanvas, 0, 0)

    // inner
    const { canvas: innerCanvas, ctx: innerCtx } = GradientTextTexture.copyCanvas(canvas, ctx!)
    GradientTextTexture.fillText(innerCtx!, text, centerX, centerY, '#D93A14')

    const { canvas: tempCanvas, ctx: tempCtx } = GradientTextTexture.copyCanvas(canvas, ctx!)
    const fillGradient = [{ position: 0.89, color: '#992102' }]
    const fGradient = GradientTextTexture.createGradient(tempCtx!, topCanvas.height, fillGradient)
    GradientTextTexture.fillText(tempCtx!, text, centerX - 3, centerY - 3, fGradient)

    innerCtx!.globalCompositeOperation = 'source-atop'
    innerCtx!.fillStyle = 'rgba(0, 0, 0, 0.4)'

    innerCtx!.drawImage(tempCanvas, 0, 0)

    innerCtx!.globalCompositeOperation = 'source-over'
    GradientTextTexture.strokeText(innerCtx!, '#9A2203', text, centerX, centerY, 2)

    innerCtx!.drawImage(strokeCanvas, 0, -6)

    // drop shadow
    const fillStyle = 'rgba(35, 16, 4, 1)'
    const shadows: IShadowSetting[] = [
      {
        color: 'rgba(35, 16, 4, 0.01)',
        blur: 16.51,
        offsetY: 59.05,
      },
      {
        color: 'rgba(35, 16, 4, 0.1)',
        blur: 15.01,
        offsetY: 38.03,
      },
      {
        color: 'rgba(35, 16, 4, 0.1)',
        blur: 12.01,
        offsetY: 23.02,
      },
      {
        color: 'rgba(35, 16, 4, 0.5)',
        blur: 9.01,
        offsetY: 11.01,
      },
      {
        color: 'rgba(35, 16, 4, 0.5)',
        blur: 4.5,
        offsetY: 5,
      },
    ]
    shadows.forEach((shadow) => {
      GradientTextTexture.fillText(ctx!, text, centerX, centerY, fillStyle, shadow)
    })

    ctx!.drawImage(innerCanvas, 0, 0)

    const sprite = Sprite.from(innerCanvas)
    sprite.anchor.set(0.5)
    return sprite
  }

  private createCanvasSubTitleText(text: string, fontSize: number) {
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
      const gradient = '#FFFFFF'
    const shadows = [
      { offsetX: 0, offsetY: 55.522, blur: 16.072, color: 'rgba(35, 16, 4, 0.01)' },
      { offsetX: 0, offsetY: 35.067, blur: 14.611, color: 'rgba(35, 16, 4, 0.1)' },
      { offsetX: 0, offsetY: 20.455, blur: 11.689, color: 'rgba(35, 16, 4, 0.34)' },
      { offsetX: 0, offsetY: 8.767, blur: 8.767, color: 'rgba(35, 16, 4, 0.6)' },
      { offsetX: 0, offsetY: 2.922, blur: 4.383, color: 'rgba(35, 16, 4, 1)' },
    ]

    const gradiantConfig = this.gradientConfig
    const textGradient = GradientTextTexture.createGradient(ctx, canvas.height, gradiantConfig.fillGradient, true)

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

    ctx.fillStyle = gradient
    ctx.filter = 'none'
    currentX = x
    for (const letter of text) {
      ctx.fillText(letter, currentX, y + 6)
      currentX += ctx.measureText(letter).width + letterSpacing
    }

    ctx.strokeStyle = '#3F2410'
    ctx.lineWidth = 6
    currentX = x
    for (const letter of text) {
      ctx.strokeText(letter, currentX, y)
      currentX += ctx.measureText(letter).width + letterSpacing
    }

    ctx.fillStyle = textGradient
    ctx.lineWidth = 0.1
    ctx.strokeStyle = '#3F2410'
    currentX = x
    for (const letter of text) {
      ctx.fillText(letter, currentX, y)
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


  protected addGradientText(text: string, posX: number, posY: number, fontSize: number, scale = 1) {
    const sprite = this.createGradientText(text, posX, posY, fontSize, scale)
    this.getContainer()?.addChild(sprite)
  }

  protected createGradientText(text: string, posX: number, posY: number, fontSize: number, scale = 1) {
    const sprite = this.createCanvasText(text, fontSize)
    sprite.x = posX
    sprite.y = posY
    if (scale !== 1) sprite.scale.set(scale)
    return sprite
  }

  private getCanvasSetting(setting?: ICanvasSetting) {
    return {
      fontSize: setting?.fontSize ?? 100,
      font: setting?.font ?? 'River Adventurer',
      fontWeight: setting?.fontWeight ?? 400,
      textAlign: setting?.textAlign ?? 'center',
      textBaseline: setting?.textBaseline ?? 'middle',
    } as ICanvasSetting
  }



  createCanvasText(text: string, fontSize: number) {
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


    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#000000')
    gradient.addColorStop(1, '#000000')
  

    const shadows = [
      { offsetX: 0, offsetY: 55.522, blur: 16.072, color: 'rgba(35, 16, 4, 0.01)' },
      { offsetX: 0, offsetY: 35.067, blur: 14.611, color: 'rgba(35, 16, 4, 0.1)' },
      { offsetX: 0, offsetY: 20.455, blur: 11.689, color: 'rgba(35, 16, 4, 0.34)' },
      { offsetX: 0, offsetY: 8.767, blur: 8.767, color: 'rgba(35, 16, 4, 0.6)' },
      { offsetX: 0, offsetY: 2.922, blur: 4.383, color: 'rgba(35, 16, 4, 1)' },
    ]

    const gradiantConfig = this.gradientConfig
    const textGradient = GradientTextTexture.createGradient(ctx, canvas.height, gradiantConfig.fillGradient)
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
      ctx.fillText(letter, currentX, y + 6)
      currentX += ctx.measureText(letter).width + letterSpacing
    }

    ctx.strokeStyle = '#3F2410'
    ctx.lineWidth = 3
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
      ctx.fillText(letter, currentX, y)
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
      { position: 0.0, color: '#F4ED4A', grayColor: '#685F4D' },
      { position: 0.39, color: '#F4ED4A', grayColor: '#685F4D' },
      { position: 0.55, color: '#FEA602', grayColor: '#685F4D' },
    ],
    strokeGradient: [
      { position: 0.21, color: '#9921024F', grayColor: '#FFFFFF' },
      { position: 0.2854, color: '#FBF4BF00', grayColor: '#FFFFFF' },
      { position: 0.3956, color: '#FBF4BF00', grayColor: '#685F4D' },
      { position: 0.5116, color: '#FBF4BF4F', grayColor: '#685F4D' },
      { position: 0.645, color: '#FBF4BF00', grayColor: '#685F4D' },
      { position: 0.79, color: '#FBF4BF00', grayColor: '#FFFFFF' },
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




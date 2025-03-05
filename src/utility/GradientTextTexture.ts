import * as PIXI from 'pixi.js'
import { uiSetting } from '../config/UiSettingConfig'
export interface GradientStop {
  position: number
  color: string
}

export interface GradientConfig {
  fillGradient: GradientStop[]
  strokeGradient: GradientStop[]
  style: {
    letterSpacing: string
    shadowOffset: {
      x: number
      y: number
    }
    shadowColor: string
    strokeWidth: number
    thickStrokeWidth: number
  }
}

export interface TextTextureConfig {
  width: number
  height: number
  font: string
  fontSize: number
}

export interface ICanvasSetting {
  fontSize: number
  font?: string
  fontWeight?: number
  width?: number
  height?: number
  letterSpacing?: string
  textAlign?: CanvasTextAlign
  textBaseline?: CanvasTextBaseline
}

export interface IShadowSetting {
  color?: string
  blur?: number
  offsetX?: number
  offsetY?: number
}
export class GradientTextTexture {
  private static readonly defaultConfig: TextTextureConfig = {
    width: 1080,
    height: 0,
    font: uiSetting.gradientFont,
    fontSize: 48,
  }

  public static createGradient(ctx: CanvasRenderingContext2D, height: number, stops: GradientStop[]): CanvasGradient {
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    stops.forEach((stop) => {
      gradient.addColorStop(stop.position, stop.color)
    })
    return gradient
  }

  private static setupTextStyle(ctx: CanvasRenderingContext2D, config: TextTextureConfig): void {
    ctx.font = `${config.fontSize}px ${config.font}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
  }

  private static drawTextShadow(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    gradientConfig: GradientConfig
  ): void {
    ctx.fillStyle = gradientConfig.style.shadowColor
    ctx.fillText(text, x + gradientConfig.style.shadowOffset.x, y + gradientConfig.style.shadowOffset.y)
  }

  private static drawTextStroke(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    strokeStyle: string | CanvasGradient,
    lineWidth: number
  ): void {
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = strokeStyle
    ctx.strokeText(text, x, y)
  }

  private static drawTextFill(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fillStyle: string | CanvasGradient
  ): void {
    ctx.fillStyle = fillStyle
    ctx.fillText(text, x, y)
  }

  public static createGradientTextTexture(
    text: string,
    fontSize: number,
    gradientConfig: GradientConfig,
    customConfig?: Partial<TextTextureConfig>
  ): PIXI.Texture {
    const config: TextTextureConfig = {
      ...this.defaultConfig,
      ...customConfig,
      fontSize,
      height: fontSize,
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    const setting = {
      fontSize: config.fontSize,
      font: config.font,
    } as ICanvasSetting

    const { width, height } = this.getGradientTextSize(text, setting, config.fontSize)

    // canvas.width = text.length * fontSize
    // canvas.height = config.height

    canvas.width = width
    canvas.height = height

    this.setupTextStyle(ctx, config)
    ctx.letterSpacing = gradientConfig.style.letterSpacing

    const fillGradient = this.createGradient(ctx, canvas.height, gradientConfig.fillGradient)
    const strokeGradient = this.createGradient(ctx, canvas.height, gradientConfig.strokeGradient)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    this.drawTextShadow(ctx, text, centerX, centerY, gradientConfig)

    this.drawTextStroke(ctx, text, centerX, centerY, strokeGradient, gradientConfig.style.thickStrokeWidth)

    this.drawTextFill(ctx, text, centerX, centerY, fillGradient)

    this.drawTextStroke(ctx, text, centerX, centerY, gradientConfig.style.shadowColor, gradientConfig.style.strokeWidth)

    return PIXI.Texture.from(canvas)
  }

  public static createOriginCanvas(text: string, setting: ICanvasSetting) {
    const fontSize = setting.fontSize
    const font = setting.font
    const fontWeight = setting.fontWeight
    const width = setting.width
    const height = setting.height
    const letterSpacing = setting.letterSpacing
    const textAlign = setting.textAlign
    const textBaseline = setting.textBaseline

    const canvas = document.createElement('canvas')
    canvas.width = width ?? text.length * fontSize
    canvas.height = height ?? fontSize

    const ctx = canvas.getContext('2d')
    if (fontWeight) ctx!.font = `${fontWeight} ${fontSize}px ${font}`
    else ctx!.font = `${fontSize}px River Adventurer`
    if (letterSpacing) ctx!.letterSpacing = letterSpacing
    if (textAlign) ctx!.textAlign = textAlign
    if (textBaseline) ctx!.textBaseline = textBaseline

    return { canvas, ctx }
  }

  public static copyCanvas(originCanvas: HTMLCanvasElement, originCtx: CanvasRenderingContext2D) {
    const canvas = document.createElement('canvas')
    canvas.width = originCanvas.width
    canvas.height = originCanvas.height

    const ctx = canvas.getContext('2d')
    ctx!.font = originCtx.font
    ctx!.textAlign = originCtx.textAlign
    ctx!.textBaseline = originCtx.textBaseline
    ctx!.letterSpacing = originCtx.letterSpacing

    return { canvas, ctx }
  }

  public static fillText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    style?: string | CanvasGradient | CanvasPattern,
    shadowSetting?: IShadowSetting
  ) {
    if (style) ctx.fillStyle = style
    if (shadowSetting) {
      const color = shadowSetting.color
      const blur = shadowSetting.blur
      const offsetX = shadowSetting.offsetX
      const offsetY = shadowSetting.offsetY
      if (color) ctx.shadowColor = color
      if (blur) ctx.shadowBlur = blur
      if (offsetX) ctx.shadowOffsetX = offsetX
      if (offsetY) ctx.shadowOffsetY = offsetY
    }
    ctx.fillText(text, x, y)
  }

  public static strokeText(
    ctx: CanvasRenderingContext2D,
    style: string | CanvasGradient | CanvasPattern,
    text: string,
    x: number,
    y: number,
    width?: number
  ) {
    if (width) ctx.lineWidth = width
    ctx.strokeStyle = style
    ctx.strokeText(text, x, y)
  }

  public static getGradientTextSize(text: string, setting: ICanvasSetting, fontSize: number) {
    const { ctx: prepareCtx } = GradientTextTexture.createOriginCanvas(text, setting)
    const textHeight = fontSize
    const textWidth = prepareCtx!.measureText(text).width
    return { width: textWidth * 1.15, height: textHeight * 1.2 }
  }

  public static testGradientTextTextureFontSize(text: string, setting: ICanvasSetting, maxWidth: number) {
    let fontSize = setting.fontSize
    let getRequireFontSize = false
    while (!getRequireFontSize) {
      const { width, height } = this.getGradientTextSize(text, setting, fontSize)
      setting.width = width
      setting.height = height

      const { canvas, ctx } = GradientTextTexture.createOriginCanvas(text, setting)
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      GradientTextTexture.fillText(ctx!, text, centerX, centerY, '#FFF')

      const texture = PIXI.Texture.from(canvas)
      if (texture.width <= maxWidth) getRequireFontSize = true
      else {
        fontSize -= 2
        setting.fontSize = fontSize
        if (fontSize <= 0) {
          fontSize = 1
          getRequireFontSize = true
        }
      }
    }
    return fontSize
  }

  public static getCanvasCenter(canvas: HTMLCanvasElement) {
    return {
      centerX: canvas.width / 2,
      centerY: canvas.height / 2,
    }
  }

  public static clearCanvas(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  public static configureTextAlignment(ctx: CanvasRenderingContext2D) {
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
  }

  public static trimCanvas(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    text: string,
    padding = 3
  ): HTMLCanvasElement {
    // Get text metrics for trimming
    const metrics = ctx.measureText(text)

    // Correct width and height calculation
    const width = metrics.width
    // const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent

    // Calculate center position
    const x = canvas.width / 2 - width / 2
    // const y = canvas.height / 2 - metrics.actualBoundingBoxAscent

    // Get the image data for the specified region with padding
    const imageData = ctx.getImageData(
      Math.max(0, x - padding),
      0,
      // Math.max(0, y - padding),
      width + padding * 2,
      // height + padding * 2
      canvas.height
    )

    // Create a new canvas with the trimmed dimensions
    const trimmedCanvas = document.createElement('canvas')
    trimmedCanvas.width = imageData.width
    trimmedCanvas.height = imageData.height

    // Draw the trimmed image data
    const trimmedCtx = trimmedCanvas.getContext('2d')
    trimmedCtx!.putImageData(imageData, 0, 0)

    return trimmedCanvas
  }
}

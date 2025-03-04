import * as PIXI from 'pixi.js'

export class Core {
  public container: HTMLElement | null = null

  protected app: PIXI.Application | null = null

  public createApplication(options?: Partial<PIXI.ApplicationOptions>): Promise<void> {
    if (!this.container || this.app) return Promise.resolve()
    PIXI.TexturePool.textureOptions.scaleMode = 'nearest'
    this.app = new PIXI.Application()
    return this.app.init(options).then(() => {
      const canvas = this.app?.canvas
      if (canvas) {
        canvas.id = 'bonus-activation'
        this.container?.appendChild(canvas)
      }
    })
  }

}

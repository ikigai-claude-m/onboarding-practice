import * as PIXI from 'pixi.js'
import { TexturePool } from 'pixi.js'
import { View } from './View'

export abstract class Core {
  public container: HTMLElement | null = null

  protected app: PIXI.Application | null = null

  private views: View[] = []

  private resizeListener: EventListener = this.onResize.bind(this)

  public createApplication(options?: Partial<PIXI.ApplicationOptions>): Promise<void> {
    if (!this.container || this.app) return Promise.resolve()
    TexturePool.textureOptions.scaleMode = 'nearest'
    this.app = new PIXI.Application()
    return this.app.init(options).then(() => {
      const canvas = this.getCanvas()
      if (canvas) {
        canvas.id = 'bonus-activation'
        // remove pan-y for mobile scroll view
        // canvas.style.touchAction = 'pan-y'
        this.container?.appendChild(canvas)
        this.registerEvent()
      }
    })
  }

  public release() {
    this.unregisterEvent()
    this.releaseView()
    this.releaseApplication()
  }

  protected getStage() {
    return this.app?.stage
  }

  protected getCanvas() {
    return this.app?.canvas
  }

  protected resize(width: number, height: number) {
    if (this.app?.renderer) this.app.renderer.resize(width, height)
  }

  protected addView(views: View[]) {
    const stage = this.getStage()
    if (!stage) return

    views.forEach((view) => {
      const container = view?.getContainer()
      if (container) {
        stage.addChild(container)
        this.views.push(view)
      }
    })
  }

  protected redrawAll(width: number, height: number) {
    this.views.forEach((view) => {
      view.onDraw(width, height)
    })
  }

  protected abstract onResizeHandle(width: number, height: number): void

  private releaseApplication() {
    if (!this.app) return
    this.app.canvas.parentElement?.removeChild(this.app.canvas)
    /*
    if ('gl' in this.app.renderer) {
      ;(this.app.renderer.gl as WebGL2RenderingContext).getExtension('WEBGL_lose_context')?.loseContext()
    }
    */
    this.app.destroy(true)
    this.app = null
  }

  private releaseView() {
    this.views.forEach((view) => {
      view.release()
    })
    this.views = []
  }

  private registerEvent() {
    window.addEventListener('resize', this.resizeListener)
  }

  private unregisterEvent() {
    window.removeEventListener('resize', this.resizeListener)
  }

  private onResize() {
    this.onResizeHandle(window.innerWidth, window.innerHeight)
  }
}

import * as PIXI from 'pixi.js'

import { uiSetting } from '../config/UiSettingConfig'
import { ISpineCreateSetting, ISpineSetting, UIUtil } from '../common/util/UIUtil'


export abstract class View {
  private pool: Map<string, unknown> | null = null

  private container: PIXI.Container | null = new PIXI.Container()

  public constructor() {
    this.createPool()
  }

  public getContainer() {
    return this.container
  }

  public getObject(key: string) {
    return this.pool?.get(key)
  }

  public getObjects(keys: string[]) {
    const requireObjects: unknown[] = []
    keys.forEach((key) => {
      const object = this.getObject(key)
      if (object) requireObjects.push(object)
    })
    return requireObjects
  }

  public hasObject(key: string) {
    return this.pool?.has(key)
  }

  public removeObject(key: string) {
    const obj = this.pool?.get(key)
    if (!obj) return
    this.pool?.delete(key)
    this.destroyObject(obj as PIXI.Container)
  }

  public release() {
    this.releaseContainer()
  }

  public abstract onDraw(width: number, height: number): void

  protected addObject(key: string, obj: unknown) {
    if (!this.pool || !this.container) return false
    if (this.pool.has(key)) return false

    this.pool.set(key, obj)
    this.container?.addChild(obj as PIXI.Container)
    return true
  }

  protected createGraphic(id: string) {
    if (this.hasObject(id)) return null

    const graphics = new PIXI.Graphics()
    this.addObject(id, graphics)
    this.container?.addChild(graphics)
    return graphics
  }

  protected createSprite(id: string, path?: string) {
    if (this.hasObject(id)) return null
    const sprite = path ? PIXI.Sprite.from(path) : new PIXI.Sprite()
    this.addObject(id, sprite)
    this.container?.addChild(sprite)
    return sprite
  }

  protected createText(
    id: string,
    txt = '',
    style: PIXI.TextStyle = new PIXI.TextStyle({
      fontFamily: uiSetting.regularFont,
    })
  ) {
    if (this.hasObject(id)) return null
    const text = new PIXI.Text({
      text: txt,
      style: style,
    })
    this.addObject(id, text)
    this.container?.addChild(text)
    return text
  }

  protected createBitmapText(id: string) {
    if (this.hasObject(id)) return null

    const text = new PIXI.BitmapText({ text: '' })

    this.addObject(id, text)
    this.container?.addChild(text)
    return text
  }

  protected createContainer(id: string, width = 0, height = 0) {
    if (this.hasObject(id)) return null
    const container = new PIXI.Container()
    container.width = width
    container.height = height
    this.addObject(id, container)
    this.container?.addChild(container)
    return container
  }

  protected createSpine(id: string, setting: ISpineSetting) {
    if (this.hasObject(id)) return null
    const spine = UIUtil.createSpine(setting)
    this.addObject(id, spine)
    this.container?.addChild(spine)
    return spine
  }

  protected createSpineWithSetting(id: string, setting: ISpineCreateSetting) {
    const spine = this.createSpine(id, setting.spineSetting)
    if (!spine) return null
    spine.state.setAnimation(0, setting.spineSetting.animation, setting.loop)
    spine.visible = setting.active
    return spine
  }

  private createPool() {
    if (this.pool) return false

    this.pool = new Map<string, unknown>()
    return true
  }

  private destroyPool() {
    this.pool?.forEach((object) => {
      this.destroyObject(object as PIXI.Container)
    })
    this.pool?.clear()
    this.pool = null
  }

  private destroyObject(object: PIXI.Container) {
    if (!object) return
    const children = [...object.children]
    children.forEach((child) => {
      this.destroyObject(child)
    })
    object.destroy()
  }

  private releaseContainer() {
    this.destroyContainer()
    this.destroyPool()
  }

  private destroyContainer() {
    if (!this.container) return
    this.clearContainer()
    this.container.parent?.removeChild(this.container)
    this.container.destroy()
  }

  private clearContainer() {
    if (!this.container) return

    while (0 < this.container.children.length) {
      const child = this.container.getChildAt(0)
      this.container.removeChild(child)
    }
  }

  public showHide(isShow: boolean) {
    this.getContainer()!.visible = isShow
  }

  public show() {
    this.showHide(true)
  }

  public hide() {
    this.showHide(false)
  }

  public setZIndex(index: number) {
    if (this.container) this.container.zIndex = index
  }
}

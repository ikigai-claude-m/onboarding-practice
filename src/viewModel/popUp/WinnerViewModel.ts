

import { bonusActivationModel } from '../../model/BonusActivationModel'
import { useUIStore } from '../../stores/useUIStore'
import WinnerView from '../../view/popUp/WinnerView'
import { BaseViewModel } from '../BaseViewModel/BaseViewModel'

export default class WinnerViewModel extends BaseViewModel {
  protected view: WinnerView | null = null
  public isLandScape = true

  initial() {
    this.registerEvents()
    this.observe()
  }

  protected observe() {
    this.releaseSubscribes()
    this.subscribes = []
    this.subscribes.push(
      useUIStore.prepareOpen.subscribe((isOpen) => {
        if (!isOpen) {
          this.view?.hide()
        }
      })
    )
    this.subscribes.push(bonusActivationModel.isLandscape.subscribe(this.onChangeOrientation.bind(this)))
  }

  bindView(view: WinnerView) {
    this.view = view
    this.view.createObjects()
    this.initial()
  }

  registerEvents() {
    this.view!.spriteBg!.on('pointerdown', (event) => {
      event.preventDefault()
      event.stopPropagation()
    })

    this.view!.buttonEnd.on('pointerdown', () => {
      this.view!.onButtonAnim(this.view!.buttonEnd)
    })

    this.view!.buttonEnd.on('pointerup', () => {
      useUIStore.prepareOpen.set(false)
    })
  }

  private onChangeOrientation(isLandScape: boolean) {
    const isOpen = useUIStore.prepareOpen.get()
    let isViewVisible = false
    isViewVisible = isOpen! && this.isLandScape == isLandScape
    this.showView(isViewVisible)
  }

  showView(isVisible: boolean) {
    if (isVisible) {
      this.view?.show()
    } else {
      this.view?.hide()
    }
  }
}

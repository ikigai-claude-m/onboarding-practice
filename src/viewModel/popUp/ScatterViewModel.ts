

import { bonusActivationModel } from '../../model/BonusActivationModel'
import { useUIStore } from '../../stores/useUIStore'
import ScatterView from '../../view/scatter/ScatterView'
import { BaseViewModel } from '../BaseViewModel/BaseViewModel'

export default class ScatterViewModel extends BaseViewModel {
  protected view: ScatterView | null = null
  public isLandScape = true

  initial() {
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

  bindView(view: ScatterView) {
    this.view = view
    this.view.createObjects()
    this.initial()
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

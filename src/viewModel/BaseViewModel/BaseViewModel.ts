import { View } from "../../core/View"
import { Subscribes } from "../../observable/Observable"


export class BaseViewModel {
  protected view: View | null = null
  protected subscribes: Subscribes = null

  public release() {
    this.releaseSubscribes()
    this.unregisterEvent()
  }

  protected observe() {
    this.releaseSubscribes()
  }

  public bindView(view: View) {
    this.view = view
  }

  protected releaseSubscribes() {
    if (this.subscribes) {
      this.subscribes.forEach((subscribe) => {
        if (subscribe) subscribe()
      })
    }
    this.subscribes = null
  }

  protected unregisterEvent() {
    if (!this.view) return
  }
}
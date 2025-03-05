


import { System } from '../core/System'
import { View } from '../core/View'
import WinnerView from '../view/popUp/WinnerView'
import WinnerViewModel from '../viewModel/popUp/WinnerViewModel'

export class BonusActivationSystem extends System {

  private WinnerView: WinnerView | null = null

  private systemViews: (View | null)[] = []
  private WinnerViewModel: WinnerViewModel | null = null

  public constructor() {
    super()
    this.initial()
    this.systemViews = [
      this.WinnerView,
    ]
    this.updateZIndex()
  }

  public views(): View[] {
    const list: View[] = []

    this.systemViews.forEach((view) => {
      if (view) list.push(view)
    })

    return list
  }

  public release(): void {
    this.releaseViews()
  }

  public onDraw(width: number, height: number): void {
    this.systemViews.forEach((view) => {
      if (view) view?.onDraw(width, height)
    })
  }

  private releaseViews() {
    this.systemViews.forEach((view) => {
      if (view) view?.release()
    })
  }


  private initial() {
    this.WinnerView = new WinnerView()
    this.WinnerViewModel = new WinnerViewModel()
    this.WinnerViewModel.bindView(this.WinnerView)
  }

  private updateZIndex() {
    this.systemViews.forEach((view) => view?.setZIndex(2))
  }
}

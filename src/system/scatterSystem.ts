import { System } from '../core/System'
import { View } from '../core/View'
import ScatterView from '../view/scatter/ScatterView'
import ScatterViewModel from '../viewModel/popUp/ScatterViewModel'

export class ScatterSystem extends System {

  private ScatterView: ScatterView | null = null

  private systemViews: (View | null)[] = []
  private ScatterViewModel: ScatterViewModel | null = null

  public constructor() {
    super()
    this.initial()
    this.systemViews = [
      this.ScatterView,
    ]
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
    this.ScatterView = new ScatterView()
    this.ScatterViewModel = new ScatterViewModel()
    this.ScatterViewModel.bindView(this.ScatterView)
  }
}

import { View } from "../../core/View";

export class InitScatterView extends View {
  public initial() {}
  public release() {
    super.release();
  }

  public onDraw(): void {
    console.log("ScatterView");
  }
  public hide() {}
}

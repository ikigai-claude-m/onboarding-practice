import { View } from "./View";


export abstract class System {
  public abstract views(): View[]
  public abstract release(): void
  public abstract onDraw(width: number, height: number): void
}

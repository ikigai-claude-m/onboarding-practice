import { Point } from 'pixi.js'

export class MathUtil {
  public static angleOfPositions(position1: Point, position2: Point) {
    const dx = position2.x - position1.x
    const dy = position2.y - position1.y
    const radians = Math.atan2(dy, dx)
    return radians
    // return (radians * 180) / Math.PI
  }

  public static distanceOfPositions(position1: Point, position2: Point) {
    const dx = position2.x - position1.x
    const dy = position2.y - position1.y
    try {
      return Math.hypot(dx, dy) // some old browser may not support
    } catch {
      return Math.sqrt(dx ** 2 + dy ** 2)
    }
  }

  public static notEmptyTwoDimensionArray<T>(array: T[][]): boolean {
    return array.some((row) => row.some((value) => value))
  }
}

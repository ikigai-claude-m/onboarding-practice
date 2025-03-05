class TweenTask {
  public life = 0
  public elapsed = 0
  public process: ((ratio: number) => void) | undefined = undefined
  public easing: ((ratio: number) => number) | null = null

  private run(ratio: number) {
    const easedRatio = this.easing ? this.easing(ratio) : ratio
    if (this.process) this.process(easedRatio)
  }

  public exec(delta: number): number {
    this.elapsed += delta
    if (this.life <= this.elapsed) {
      this.run(1)
      return this.elapsed - this.life
    }
    this.run(this.elapsed / this.life)
    return 0
  }
}

// circ.out easing
export function circOut(ratio: number): number {
  return Math.sqrt(1 - Math.pow(ratio - 1, 2))
}

// circ.in easing
export function circIn(ratio: number): number {
  return 1 - Math.sqrt(1 - Math.pow(ratio, 2))
}

// circ.in out easing
export function circInOut(ratio: number): number {
  if (ratio < 0.5) {
    return 0.5 * (1 - Math.sqrt(1 - Math.pow(2 * ratio, 2)))
  } else {
    return 0.5 * (Math.sqrt(1 - Math.pow(2 * (ratio - 1), 2)) + 1)
  }
}

// circ.out in easing
export function circOutIn(ratio: number): number {
  if (ratio < 0.5) {
    return 0.5 * Math.sqrt(1 - Math.pow(2 * ratio - 1, 2))
  } else {
    return 0.5 * (1 - Math.sqrt(1 - Math.pow(2 * ratio - 1, 2))) + 0.5
  }
}

// cubic.in easing
export function cubicIn(ratio: number): number {
  return Math.pow(ratio, 3)
}

// cubic.out easing
export function cubicOut(ratio: number): number {
  return 1 - Math.pow(1 - ratio, 3)
}

// cubic.in out easing
export function cubicInOut(ratio: number): number {
  if (ratio < 0.5) {
    return 4 * Math.pow(ratio, 3)
  } else {
    return 1 - Math.pow(-2 * ratio + 2, 3) / 2
  }
}

// cubic.out in easing
export function cubicOutIn(ratio: number): number {
  if (ratio < 0.5) {
    return 0.5 * (1 - Math.pow(1 - 2 * ratio, 3))
  } else {
    return 0.5 * Math.pow(2 * ratio - 1, 3) + 0.5
  }
}

// sine.in easing
export function sineIn(ratio: number): number {
  return 1 - Math.cos((ratio * Math.PI) / 2)
}

// sine.out easing
export function sineOut(ratio: number): number {
  return Math.sin((ratio * Math.PI) / 2)
}

// quint.in easing
export function quintIn(ratio: number): number {
  return Math.pow(ratio, 5)
}

// quint.out easing
export function quintOut(ratio: number): number {
  return 1 - Math.pow(1 - ratio, 5)
}

// sine.in out easing
export function sineInOut(ratio: number): number {
  return -0.5 * (Math.cos(Math.PI * ratio) - 1)
}

// sine.out in easing
export function sineOutIn(ratio: number): number {
  if (ratio < 0.5) {
    return 0.5 * Math.sin(Math.PI * ratio)
  } else {
    return 0.5 * (1 - Math.cos(Math.PI * (ratio - 0.5))) + 0.5
  }
}

// quad.in in easing
export function inQuad(ratio: number): number {
  return Math.pow(ratio, 2)
}

// quad.out in easing
export function outQuad(ratio: number): number {
  return 1 - Math.pow(1 - ratio, 2)
}

// quad.in out in easing
export function inOutQuad(ratio: number): number {
  if (ratio < 0.5) {
    return 2 * Math.pow(ratio, 2)
  } else {
    return 1 - 2 * Math.pow(1 - ratio, 2)
  }
}

// quad.out in in easing
export function outInQuad(ratio: number): number {
  if (ratio < 0.5) {
    return 0.5 * (1 - Math.pow(1 - 2 * ratio, 2))
  } else {
    return 0.5 * Math.pow(2 * (ratio - 0.5), 2) + 0.5
  }
}

// quart.in in easing
export function inQuart(ratio: number): number {
  return Math.pow(ratio, 4)
}

// quart.out in easing
export function outQuart(ratio: number): number {
  return 1 - Math.pow(1 - ratio, 4)
}

// quart.in out in easing
export function inOutQuart(ratio: number): number {
  if (ratio < 0.5) {
    return 8 * Math.pow(ratio, 4)
  } else {
    return 1 - 8 * Math.pow(1 - ratio, 4)
  }
}

// quart.out in in easing
export function outInQuart(ratio: number): number {
  if (ratio < 0.5) {
    return 0.5 * (1 - Math.pow(1 - 2 * ratio, 4))
  } else {
    return 0.5 * Math.pow(2 * (ratio - 0.5), 4) + 0.5
  }
}

export class Tween {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  private timeScale: number = 1
  private tasks: TweenTask[] = []
  private finish: (() => void) | null = null

  public duration(val: number, onUpdate?: (ratio: number) => void, easing?: (ratio: number) => number): Tween {
    const task = new TweenTask()
    task.life = Math.max(0, val)
    task.process = onUpdate
    task.easing = easing ?? null
    this.tasks.push(task)
    return this
  }

  public delay(val: number): Tween {
    const task = new TweenTask()
    task.life = Math.max(0, val)
    this.tasks.push(task)
    return this
  }

  public call(fn: (ratio: number) => void): Tween {
    const task = new TweenTask()
    task.life = 0
    task.process = (ratio: number) => {
      fn(ratio)
    }
    this.tasks.push(task)
    return this
  }

  public onComplete(val: () => void): Tween {
    this.finish = val
    return this
  }

  public start(): () => void {
    tweenManager.add(this)
    return () => {
      this.stop()
    }
  }

  public stop() {
    this.tasks = []
    this.finish = null
  }

  public forceStop(callComplete = false) {
    if (callComplete && this.finish) this.finish()
    this.stop()
  }

  public setTimeScale(val: number) {
    this.timeScale = val
  }

  public exec(delta: number): boolean {
    delta = delta * this.timeScale
    const tasks = this.tasks
    while (0 < (tasks?.length ?? 0)) {
      delta = tasks[0].exec(delta)
      if (delta <= 0) return true
      else tasks.shift()
    }
    if (this.finish) this.finish()
    return false
  }
}

export class TweenManager {
  private list: Tween[] = []

  public process(delta: number) {
    const count = this.list.length
    for (let idx = 0; idx < count; ++idx) {
      const tween = this.list.shift()
      if (tween?.exec(delta)) this.list.push(tween)
    }
  }

  public add(tween: Tween) {
    this.list.push(tween)
  }
}

export const tweenManager = new TweenManager()

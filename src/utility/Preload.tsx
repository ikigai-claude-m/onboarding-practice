import * as PIXI from 'pixi.js'

export class Preload {
  private isInitialize = false
  private loader: Promise<void> | null = null
  private static retryDelay = 0

  constructor(list: string[]) {
    this.loader = new Promise((resolve, reject) => {
      let promiser: Promise<void> = Promise.resolve()
      list.forEach((item) => {
        promiser = promiser.then(() => {
          return PIXI.Assets.load(item)
        })
      })

      promiser
        .then(() => {
          resolve()
        })
        .catch((ex: Error) => {
          console.error(ex)
          reject(ex)
        })
    })
  }

  public static async load(callback: (progress: number) => void) {
    let reconnectTimes = 0
    while (true) {
      try {

        PIXI.Assets.add({ alias: 'bonus_json', src: "scatter/Bonus_anim.json" })
       PIXI.Assets.add({ alias: 'bonus_atlas', src: "scatter/Bonus_anim.atlas" })
       PIXI.Assets.add({ alias: 'symbol_json', src: "symbol/Special_symbols_anim.json" })
       PIXI.Assets.add({ alias: 'symbol_atlas', src: "symbol/Special_symbols_anim.atlas" })

      await PIXI.Assets.load(['bonus_json', 'bonus_atlas', 'symbol_json', 'symbol_atlas'])

        await PIXI.Assets.load(resList, (progress) => {
          callback(progress)
        })
        return
      } catch (error) {
        reconnectTimes++
        console.log(`reconnectTimes=${reconnectTimes},errorMsg=${error}`)
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay))
      }
    }
  }

  public onComplete(callback: () => void) {
    if (this.isInitialize) {
      callback()
      return () => {
        // todo on complete
      }
    }

    let handler = () => {
      // todo on handle
    }
    new Promise<void>((resolve, reject) => {
      this.loader
        ?.then(() => {
          resolve()
        })
        .catch((ex: Error) => {
          console.error(ex)
          reject(ex)
        })
      handler = reject
    })
      .then(() => {
        callback()
      })
      .catch((ex: Error) => {
        console.error(ex)
      })

    return handler
  }
}

const resList = [
  'button/InGameButton.png',
  'button/InGameButtonHover.png',
  'winner/Popup_winner.png',
  'scatter/Bonus_anim.png',
]

export const preloader = new Preload(resList)

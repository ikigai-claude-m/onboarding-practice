import * as PIXI from 'pixi.js'

export class Preload {
  private isInitialize = false
  private loader: Promise<void> | null = null
  private static maxRetry = 0
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
        await PIXI.Assets.load(resList, (progress) => {
          callback(progress)
        })
        return
      } catch (error) {
        reconnectTimes++
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        console.log(`reconnectTimes=${reconnectTimes},errorMsg=${error}`)
        if (reconnectTimes >= this.maxRetry && this.maxRetry > 0) {
          //keep this flexible
          // return
        }
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
]

export const preloader = new Preload(resList)

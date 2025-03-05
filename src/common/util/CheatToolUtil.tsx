import { Symbols } from 'src/config/SymbolConfig'
import { APIManager } from 'src/managers/APIManager'
import { DataManager } from 'src/managers/DataManager'
import GameManager from 'src/managers/GameManager'
import { slotMachineModel } from 'src/model/SlotMachineModel'
import { BetResponseData } from 'src/schame/Responses'
import { PlaygroundType, SpinType } from 'src/stores/useBetResultStore'
import { CheatToolStore } from 'src/stores/useCheatToolStore'
import { Utils } from 'src/utility/Utils'

export enum CheatList {
  None = 'None',
  Zebra = 'Zebra',
  Lion = 'Lion',
  Panda = 'Panda',
  Lemur = 'Lemur',
  Scatter = 'Scatter',
  BigWin = 'BigWin',
  MegaWin = 'MegaWin',
}
export enum CheatListForServer {
  None = 'None',
  Lion_3 = 'Lion_3',
  Lion_4 = 'Lion_4',
  Lion_5 = 'Lion_5',
  Zebra_3 = 'Zebra_3',
  Zebra_4 = 'Zebra_4',
  Zebra_5 = 'Zebra_5',
  Panda_3 = 'Panda_3',
  Panda_4 = 'Panda_4',
  Panda_5 = 'Panda_5',
  Lemur_3 = 'Lemur_3',
  Lemur_4 = 'Lemur_4',
  Lemur_5 = 'Lemur_5',
  Pineapple_3 = 'Pineapple_3',
  Pineapple_4 = 'Pineapple_4',
  Pineapple_5 = 'Pineapple_5',
  Banana_3 = 'Banana_3',
  Banana_4 = 'Banana_4',
  Banana_5 = 'Banana_5',
  A_3 = 'A_3',
  A_4 = 'A_4',
  A_5 = 'A_5',
  K_3 = 'K_3',
  K_4 = 'K_4',
  K_5 = 'K_5',
  Q_3 = 'Q_3',
  Q_4 = 'Q_4',
  Q_5 = 'Q_5',
  J_3 = 'J_3',
  J_4 = 'J_4',
  J_5 = 'J_5',
  L10_3 = '10_3',
  L10_4 = '10_4',
  L10_5 = '10_5',
  lines_1 = 'lines_1',
  lines_2 = 'lines_2',
  lines_3 = 'lines_3',
  lines_4 = 'lines_4',
  lines_5 = 'lines_5',
  lines_6 = 'lines_6',
  lines_7 = 'lines_7',
  lines_8 = 'lines_8',
  lines_9 = 'lines_9',
  lines_10 = 'lines_10',
  lines_11 = 'lines_11',
  lines_12 = 'lines_12',
  lines_13 = 'lines_13',
  lines_14 = 'lines_14',
  lines_15 = 'lines_15',
  lines_16 = 'lines_16',
  lines_17 = 'lines_17',
  lines_18 = 'lines_18',
  lines_19 = 'lines_19',
  lines_20 = 'lines_20',
  lines_21 = 'lines_21',
  lines_22 = 'lines_22',
  lines_23 = 'lines_23',
  lines_24 = 'lines_24',
  lines_25 = 'lines_25',
  Scatter = 'Scatter',
  ScatterWBE = 'ScatterWBE',
  MaxWin = 'MaxWin',
  ScatterLine2 = 'ScatterLine2',
  BigWin = 'BigWin',
  MegaWin = 'MegaWin',
}
export enum BigWinList {
  bigWin,
  megaWin,
}
export class CheatToolUtil {
  public static runCheatSpin() {
    if (!GameManager.hadSpined) GameManager.hadSpined = true
    const timer = this.getRandomTime()
    void Utils.wait(timer * 1000).then(() => {
      const example = CheatToolUtil.spinExample
      if (!example) return
      DataManager.setBetResourceData(example as BetResponseData)
    })
  }

  public static async setFreeGameData() {
    const timer = this.getRandomTime()
    await Utils.wait(timer * 1000).then(() => {
      if (CheatToolStore.getInstance()?.selectedCheat.get() == CheatList.Scatter) {
        APIManager.freeGameData = CheatToolUtil.getFreeSpinGameExample()
        console.log(APIManager.freeGameData)
      }
    })
  }

  private static getRandomTime(limit = 0, max = 0.5) {
    return Math.random() * (max - limit) + limit
  }

  static get symbolAnimationList() {
    if (slotMachineModel.isDemo && APIManager.token !== '') {
      return Object.values(CheatListForServer)
    }
    return Object.values(CheatList)
  }

  static get spinExample() {
    if (!slotMachineModel.isDemo) return null
    if (!slotMachineModel.cheatToolOpen) return this.getRequireSpinResult(CheatList.None)
    let target = CheatToolStore.getInstance()?.selectedCheat.get()
    if (!target) target = CheatList.None
    return this.getRequireSpinResult(target)
  }

  private static getRequireSpinResult(target: string) {
    let result = {}
    switch (target as CheatList) {
      case CheatList.None:
        result = this.winNumExample()
        break
      case CheatList.Lion:
        result = this.getCheatResult(Symbols.H1)
        break
      case CheatList.Zebra:
        result = this.getCheatResult(Symbols.H2)
        break
      case CheatList.Panda:
        result = this.getCheatResult(Symbols.H3)
        break
      case CheatList.Lemur:
        result = this.getCheatResult(Symbols.H4)
        break
      case CheatList.Scatter:
        result = this.freeSpinExample()
        break
      case CheatList.BigWin:
        result = this.getCheatBigWinResult(BigWinList.bigWin, Symbols.H3)
        break
      case CheatList.MegaWin:
        result = this.getCheatBigWinResult(BigWinList.megaWin, Symbols.H3)
        break
      default:
        result = this.winNumExample()
        break
    }

    return result
  }

  public static winNumExample() {
    return {
      roundId: '',
      balance: GameManager.balance - GameManager.betValue + 10,
      results: {
        gameResponse: {
          step: {
            gamePhases: [
              {
                type: SpinType.Regular,
                coins: 10,
                playgrounds: [
                  {
                    type: PlaygroundType.Basic,
                    coins: 10,
                    fields: [
                      {
                        coins: 10,
                        symbols: {
                          coins: 10,
                          initial: [
                            Symbols.H1,
                            Symbols.H4,
                            Symbols.L2, //

                            Symbols.H5,
                            Symbols.L3,
                            Symbols.L2, //

                            Symbols.H3,
                            Symbols.L2, //
                            Symbols.Scatter,

                            Symbols.L2, //
                            Symbols.L1,
                            Symbols.H3,

                            Symbols.L2, //
                            Symbols.Wild,
                            Symbols.Wild,
                          ],
                          final: [
                            Symbols.H1,
                            Symbols.H4,
                            Symbols.L2, //

                            Symbols.H5,
                            Symbols.L3,
                            Symbols.L2, //

                            Symbols.H3,
                            Symbols.L2, //
                            Symbols.Scatter,

                            Symbols.L2, //
                            Symbols.L1,
                            Symbols.H3,

                            Symbols.L2, //
                            Symbols.Wild,
                            Symbols.Wild,
                          ],
                          payouts: [
                            {
                              symbol: Symbols.L2,
                              oak: 5,
                              coins: 10,
                              positions: 8,
                            },
                          ],
                        },
                        features: {
                          freeSpins: 0,
                          wildMultiplier: [],
                          wildSymbolSticky: {},
                          extraGames: { extra: 0, idx: 0 },
                          boostGames: {},
                          extraLastGames: {},
                        },
                      },
                    ],
                  },
                ],
              },
            ],
            summary: {
              coins: 10,
              hasMaxWin: false,
            },
          },
          meta: {
            public: {
              betAmount: 2,
            },
          },
          finished: true,
        },
      },
      status: '',
      actions: {},
      // summary: {},
    } as unknown as BetResponseData
  }

  private static freeSpinExample() {
    return {
      roundId: 'd4af8913-e496-417f-8a61-6562e05cc2f5',
      balance: GameManager.balance - GameManager.betValue,
      results: {
        gameResponse: {
          step: {
            gamePhases: [
              {
                type: 'regular',
                coins: 4,
                playgrounds: [
                  {
                    type: 'basic',
                    coins: 4,
                    fields: [
                      {
                        coins: 4,
                        symbols: {
                          coins: 4,
                          initial: [11, 14, 13, 10, 9, 7, 14, 13, 12, 10, 7, 9, 11, 12, 14],
                          final: [11, 14, 13, 10, 9, 7, 14, 13, 12, 10, 7, 9, 11, 12, 14],
                          payouts: [
                            {
                              symbol: 14,
                              coins: 4,
                              oak: 3,
                              positions: -1,
                            },
                          ],
                        },
                        features: {
                          freeSpins: 15,
                        },
                      },
                    ],
                  },
                ],
              },
            ],
            summary: {
              coins: 0,
              hasMaxWin: false,
            },
          },
          finished: false,
          meta: {
            public: {
              betAmount: 2,
            },
          },
        },
      },
      status: 'ongoing',
      actions: [2],
    }
  }

  public static getFreeSpinGameExample() {
    return {
      roundId: '71834e0f-2f76-4f85-81ea-f7181ac8729c',
      balance: GameManager.balance - GameManager.betValue + 1427.2,
      results: {
        gameResponse: {
          step: {
            gamePhases: [
              {
                type: 'freeSpin',
                coins: 668,
                playgrounds: [
                  {
                    type: 'basic',
                    coins: 668,
                    fields: [
                      {
                        coins: 7.4,
                        symbols: {
                          coins: 7.4,
                          initial: [7, 7, 10, 10, 7, 7, 7, 7, 10, 6, 12, 12, 5, 11, 11],
                          final: [7, 7, 10, 10, 7, 7, 7, 7, 10, 6, 12, 12, 0, 11, 11],
                          payouts: [
                            {
                              symbol: 7,
                              coins: 1,
                              oak: 3,
                              positions: 0,
                            },
                            {
                              symbol: 7,
                              coins: 1,
                              oak: 3,
                              positions: 9,
                            },
                            {
                              symbol: 7,
                              coins: 1,
                              oak: 3,
                              positions: 11,
                            },
                            {
                              symbol: 7,
                              coins: 1,
                              oak: 3,
                              positions: 13,
                            },
                            {
                              symbol: 7,
                              coins: 1,
                              oak: 3,
                              positions: 15,
                            },
                            {
                              symbol: 7,
                              coins: 1,
                              oak: 3,
                              positions: 21,
                            },
                            {
                              symbol: 7,
                              coins: 1,
                              oak: 3,
                              positions: 23,
                            },
                            {
                              symbol: 10,
                              coins: 0.4,
                              oak: 3,
                              positions: 24,
                            },
                          ],
                        },
                        features: {
                          freeSpins: 14,
                          wildMultiplier: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
                          boostGames: {
                            boost: 2,
                            idx: 12,
                          },
                        },
                      },
                      {
                        coins: 7.2,
                        symbols: {
                          coins: 7.2,
                          initial: [8, 11, 8, 8, 13, 13, 8, 8, 8, 9, 9, 8, 9, 9, 9],
                          final: [8, 0, 8, 8, 13, 13, 8, 8, 8, 9, 9, 8, 9, 9, 9],
                          payouts: [
                            {
                              symbol: 8,
                              coins: 0.6,
                              oak: 3,
                              positions: 1,
                            },
                            {
                              symbol: 8,
                              coins: 0.6,
                              oak: 3,
                              positions: 5,
                            },
                            {
                              symbol: 8,
                              coins: 1.8,
                              oak: 4,
                              positions: 7,
                            },
                            {
                              symbol: 8,
                              coins: 1.8,
                              oak: 4,
                              positions: 10,
                            },
                            {
                              symbol: 8,
                              coins: 0.6,
                              oak: 3,
                              positions: 17,
                            },
                            {
                              symbol: 8,
                              coins: 0.6,
                              oak: 3,
                              positions: 20,
                            },
                            {
                              symbol: 8,
                              coins: 0.6,
                              oak: 3,
                              positions: 22,
                            },
                            {
                              symbol: 8,
                              coins: 0.6,
                              oak: 3,
                              positions: 24,
                            },
                          ],
                        },
                        features: {
                          freeSpins: 13,
                          wildMultiplier: [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        },
                      },
                      {
                        coins: 14.4,
                        symbols: {
                          coins: 14.4,
                          initial: [6, 6, 6, 10, 6, 12, 7, 7, 6, 7, 9, 6, 7, 12, 10],
                          final: [6, 6, 6, 0, 6, 12, 7, 7, 6, 7, 0, 6, 7, 12, 10],
                          payouts: [
                            {
                              symbol: 6,
                              coins: 3.6,
                              oak: 4,
                              positions: 3,
                            },
                            {
                              symbol: 6,
                              coins: 3.6,
                              oak: 4,
                              positions: 14,
                            },
                            {
                              symbol: 6,
                              coins: 3.6,
                              oak: 4,
                              positions: 16,
                            },
                            {
                              symbol: 6,
                              coins: 1.2,
                              oak: 3,
                              positions: 17,
                            },
                            {
                              symbol: 6,
                              coins: 1.2,
                              oak: 3,
                              positions: 22,
                            },
                            {
                              symbol: 6,
                              coins: 1.2,
                              oak: 3,
                              positions: 24,
                            },
                          ],
                        },
                        features: {
                          freeSpins: 15,
                          wildMultiplier: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
                          extraGames: {
                            extra: 3,
                            idx: 3,
                          },
                        },
                      },
                      {
                        coins: 0.6,
                        symbols: {
                          coins: 0.6,
                          initial: [12, 11, 11, 11, 5, 8, 12, 12, 12, 4, 11, 9, 8, 8, 12],
                          final: [12, 11, 11, 11, 0, 8, 12, 12, 12, 0, 11, 9, 8, 8, 12],
                          payouts: [
                            {
                              symbol: 12,
                              coins: 0.2,
                              oak: 3,
                              positions: 3,
                            },
                            {
                              symbol: 12,
                              coins: 0.2,
                              oak: 3,
                              positions: 11,
                            },
                            {
                              symbol: 12,
                              coins: 0.2,
                              oak: 3,
                              positions: 13,
                            },
                          ],
                        },
                        features: {
                          freeSpins: 14,
                          wildMultiplier: [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                        },
                      },
                      {
                        coins: 0.4,
                        symbols: {
                          coins: 0.4,
                          initial: [9, 5, 9, 8, 12, 8, 12, 12, 10, 12, 13, 8, 13, 12, 13],
                          final: [9, 0, 9, 8, 12, 8, 12, 12, 10, 0, 13, 8, 13, 12, 13],
                          payouts: [
                            {
                              symbol: 12,
                              coins: 0.2,
                              oak: 3,
                              positions: 0,
                            },
                            {
                              symbol: 12,
                              coins: 0.2,
                              oak: 3,
                              positions: 15,
                            },
                          ],
                        },
                        features: {
                          freeSpins: 13,
                          wildMultiplier: [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
                        },
                      },
                      {
                        coins: 26.4,
                        symbols: {
                          coins: 26.4,
                          initial: [8, 4, 9, 3, 4, 9, 10, 9, 9, 13, 9, 9, 9, 9, 9],
                          final: [0, 0, 9, 0, 4, 9, 10, 9, 9, 13, 9, 9, 9, 9, 9],
                          payouts: [
                            {
                              symbol: 10,
                              coins: 0.8,
                              oak: 3,
                              positions: 1,
                            },
                            {
                              symbol: 9,
                              coins: 2.4,
                              oak: 5,
                              positions: 2,
                            },
                            {
                              symbol: 10,
                              coins: 0.8,
                              oak: 3,
                              positions: 5,
                            },
                            {
                              symbol: 9,
                              coins: 4.8,
                              oak: 5,
                              positions: 6,
                            },
                            {
                              symbol: 9,
                              coins: 4.8,
                              oak: 5,
                              positions: 7,
                            },
                            {
                              symbol: 9,
                              coins: 0.4,
                              oak: 3,
                              positions: 8,
                            },
                            {
                              symbol: 9,
                              coins: 0.8,
                              oak: 3,
                              positions: 9,
                            },
                            {
                              symbol: 9,
                              coins: 4.8,
                              oak: 5,
                              positions: 10,
                            },
                            {
                              symbol: 9,
                              coins: 0.8,
                              oak: 3,
                              positions: 17,
                            },
                            {
                              symbol: 9,
                              coins: 4.8,
                              oak: 5,
                              positions: 19,
                            },
                            {
                              symbol: 9,
                              coins: 0.8,
                              oak: 3,
                              positions: 22,
                            },
                            {
                              symbol: 9,
                              coins: 0.4,
                              oak: 3,
                              positions: 24,
                            },
                          ],
                        },
                        features: {
                          freeSpins: 12,
                          wildMultiplier: [2, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                          boostGames: {
                            boost: 1,
                            idx: 3,
                          },
                        },
                      },
                      {
                        coins: 49.6,
                        symbols: {
                          coins: 49.6,
                          initial: [5, 10, 7, 10, 9, 7, 5, 10, 10, 13, 10, 8, 9, 4, 9],
                          final: [5, 10, 7, 10, 0, 7, 5, 10, 10, 0, 10, 0, 9, 0, 9],
                          payouts: [
                            {
                              symbol: 10,
                              coins: 12,
                              oak: 5,
                              positions: 0,
                            },
                            {
                              symbol: 10,
                              coins: 7.2,
                              oak: 5,
                              positions: 10,
                            },
                            {
                              symbol: 5,
                              coins: 4,
                              oak: 3,
                              positions: 13,
                            },
                            {
                              symbol: 10,
                              coins: 12,
                              oak: 5,
                              positions: 16,
                            },
                            {
                              symbol: 10,
                              coins: 14.4,
                              oak: 5,
                              positions: 22,
                            },
                          ],
                        },
                        features: {
                          freeSpins: 11,
                          wildMultiplier: [0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 0, 1, 0, 3, 0],
                          boostGames: {
                            boost: 1,
                            idx: 11,
                          },
                        },
                      },
                      {
                        coins: 19.8,
                        symbols: {
                          coins: 19.8,
                          initial: [8, 8, 8, 10, 4, 10, 8, 8, 8, 10, 13, 12, 9, 13, 13],
                          final: [0, 8, 0, 10, 0, 10, 8, 8, 8, 10, 13, 12, 0, 13, 13],
                          payouts: [
                            {
                              symbol: 8,
                              coins: 1.8,
                              oak: 3,
                              positions: 0,
                            },
                            {
                              symbol: 8,
                              coins: 1.8,
                              oak: 3,
                              positions: 3,
                            },
                            {
                              symbol: 8,
                              coins: 3,
                              oak: 3,
                              positions: 4,
                            },
                            {
                              symbol: 8,
                              coins: 1.8,
                              oak: 3,
                              positions: 11,
                            },
                            {
                              symbol: 8,
                              coins: 3,
                              oak: 3,
                              positions: 12,
                            },
                            {
                              symbol: 8,
                              coins: 1.8,
                              oak: 3,
                              positions: 13,
                            },
                            {
                              symbol: 8,
                              coins: 3,
                              oak: 3,
                              positions: 14,
                            },
                            {
                              symbol: 8,
                              coins: 1.8,
                              oak: 3,
                              positions: 15,
                            },
                            {
                              symbol: 8,
                              coins: 1.8,
                              oak: 3,
                              positions: 16,
                            },
                          ],
                        },
                        features: {
                          freeSpins: 10,
                          wildMultiplier: [1, 0, 2, 0, 3, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0],
                        },
                      },
                      {
                        coins: 62,
                        symbols: {
                          coins: 62,
                          initial: [8, 6, 6, 13, 10, 9, 13, 7, 13, 8, 13, 13, 11, 8, 11],
                          final: [0, 6, 6, 0, 10, 0, 13, 0, 13, 8, 13, 13, 11, 8, 11],
                          payouts: [
                            {
                              symbol: 13,
                              coins: 0.6,
                              oak: 3,
                              positions: 1,
                            },
                            {
                              symbol: 0,
                              coins: 36,
                              oak: 3,
                              positions: 7,
                            },
                            {
                              symbol: 6,
                              coins: 6,
                              oak: 3,
                              positions: 8,
                            },
                            {
                              symbol: 6,
                              coins: 6,
                              oak: 3,
                              positions: 9,
                            },
                            {
                              symbol: 6,
                              coins: 7.2,
                              oak: 3,
                              positions: 10,
                            },
                            {
                              symbol: 10,
                              coins: 1.2,
                              oak: 3,
                              positions: 11,
                            },
                            {
                              symbol: 13,
                              coins: 0.6,
                              oak: 3,
                              positions: 17,
                            },
                            {
                              symbol: 13,
                              coins: 2.2,
                              oak: 4,
                              positions: 19,
                            },
                            {
                              symbol: 13,
                              coins: 2.2,
                              oak: 4,
                              positions: 23,
                            },
                          ],
                        },
                        features: {
                          freeSpins: 9,
                          wildMultiplier: [1, 0, 0, 3, 0, 2, 0, 3, 0, 0, 0, 0, 0, 0, 0],
                        },
                      },
                      {
                        coins: 84.1,
                        symbols: {
                          coins: 84.1,
                          initial: [7, 11, 12, 7, 4, 10, 8, 8, 12, 12, 10, 10, 12, 6, 6],
                          final: [7, 0, 12, 7, 0, 10, 8, 8, 0, 0, 10, 10, 12, 6, 6],
                          payouts: [
                            {
                              symbol: 8,
                              coins: 1.8,
                              oak: 3,
                              positions: 0,
                            },
                            {
                              symbol: 7,
                              coins: 3,
                              oak: 3,
                              positions: 3,
                            },
                            {
                              symbol: 10,
                              coins: 8.4,
                              oak: 4,
                              positions: 6,
                            },
                            {
                              symbol: 12,
                              coins: 0.6,
                              oak: 3,
                              positions: 14,
                            },
                            {
                              symbol: 8,
                              coins: 1.8,
                              oak: 3,
                              positions: 15,
                            },
                            {
                              symbol: 0,
                              coins: 36,
                              oak: 3,
                              positions: 16,
                            },
                            {
                              symbol: 7,
                              coins: 12.5,
                              oak: 4,
                              positions: 17,
                            },
                            {
                              symbol: 7,
                              coins: 20,
                              oak: 4,
                              positions: 22,
                            },
                          ],
                        },
                        features: {
                          freeSpins: 8,
                          wildMultiplier: [0, 3, 0, 0, 1, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0],
                        },
                      },
                      {
                        coins: 70.9,
                        symbols: {
                          coins: 70.9,
                          initial: [11, 10, 8, 13, 4, 11, 11, 12, 11, 13, 13, 13, 8, 6, 5],
                          final: [11, 0, 8, 13, 0, 11, 11, 0, 11, 13, 13, 13, 0, 6, 5],
                          payouts: [
                            {
                              symbol: 0,
                              coins: 48,
                              oak: 3,
                              positions: 0,
                            },
                            {
                              symbol: 11,
                              coins: 1.2,
                              oak: 3,
                              positions: 3,
                            },
                            {
                              symbol: 11,
                              coins: 1.2,
                              oak: 3,
                              positions: 6,
                            },
                            {
                              symbol: 11,
                              coins: 2,
                              oak: 3,
                              positions: 9,
                            },
                            {
                              symbol: 13,
                              coins: 5.5,
                              oak: 4,
                              positions: 10,
                            },
                            {
                              symbol: 11,
                              coins: 2,
                              oak: 3,
                              positions: 11,
                            },
                            {
                              symbol: 8,
                              coins: 3,
                              oak: 3,
                              positions: 12,
                            },
                            {
                              symbol: 11,
                              coins: 1.2,
                              oak: 3,
                              positions: 13,
                            },
                            {
                              symbol: 11,
                              coins: 2.4,
                              oak: 3,
                              positions: 15,
                            },
                            {
                              symbol: 11,
                              coins: 2.4,
                              oak: 3,
                              positions: 16,
                            },
                            {
                              symbol: 11,
                              coins: 0.4,
                              oak: 3,
                              positions: 19,
                            },
                            {
                              symbol: 11,
                              coins: 1.2,
                              oak: 3,
                              positions: 21,
                            },
                            {
                              symbol: 11,
                              coins: 0.4,
                              oak: 3,
                              positions: 23,
                            },
                          ],
                        },
                        features: {
                          freeSpins: 7,
                          wildMultiplier: [0, 3, 0, 0, 3, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0],
                        },
                      },
                      {
                        coins: 17.6,
                        symbols: {
                          coins: 17.6,
                          initial: [9, 8, 9, 4, 12, 11, 3, 8, 12, 11, 13, 11, 13, 9, 9],
                          final: [9, 8, 9, 0, 12, 0, 0, 8, 12, 11, 13, 11, 13, 0, 9],
                          payouts: [
                            {
                              symbol: 9,
                              coins: 2,
                              oak: 3,
                              positions: 1,
                            },
                            {
                              symbol: 8,
                              coins: 3,
                              oak: 3,
                              positions: 5,
                            },
                            {
                              symbol: 8,
                              coins: 1.8,
                              oak: 3,
                              positions: 9,
                            },
                            {
                              symbol: 8,
                              coins: 1.8,
                              oak: 3,
                              positions: 10,
                            },
                            {
                              symbol: 9,
                              coins: 2,
                              oak: 3,
                              positions: 18,
                            },
                            {
                              symbol: 9,
                              coins: 2,
                              oak: 3,
                              positions: 20,
                            },
                            {
                              symbol: 8,
                              coins: 3,
                              oak: 3,
                              positions: 21,
                            },
                            {
                              symbol: 9,
                              coins: 2,
                              oak: 3,
                              positions: 23,
                            },
                          ],
                        },
                        features: {
                          freeSpins: 6,
                          wildMultiplier: [0, 0, 0, 3, 0, 3, 2, 0, 0, 0, 0, 0, 0, 1, 0],
                        },
                      },
                      {
                        coins: 96.5,
                        symbols: {
                          coins: 96.5,
                          initial: [11, 11, 5, 7, 11, 7, 7, 7, 6, 13, 13, 13, 11, 7, 10],
                          final: [11, 11, 0, 7, 0, 7, 7, 7, 0, 13, 13, 0, 11, 7, 10],
                          payouts: [
                            {
                              symbol: 7,
                              coins: 15,
                              oak: 4,
                              positions: 2,
                            },
                            {
                              symbol: 11,
                              coins: 2,
                              oak: 3,
                              positions: 3,
                            },
                            {
                              symbol: 7,
                              coins: 5,
                              oak: 3,
                              positions: 4,
                            },
                            {
                              symbol: 7,
                              coins: 3,
                              oak: 3,
                              positions: 8,
                            },
                            {
                              symbol: 7,
                              coins: 5,
                              oak: 3,
                              positions: 12,
                            },
                            {
                              symbol: 0,
                              coins: 48,
                              oak: 3,
                              positions: 14,
                            },
                            {
                              symbol: 11,
                              coins: 2,
                              oak: 3,
                              positions: 16,
                            },
                            {
                              symbol: 7,
                              coins: 7.5,
                              oak: 4,
                              positions: 18,
                            },
                            {
                              symbol: 7,
                              coins: 3,
                              oak: 3,
                              positions: 20,
                            },
                            {
                              symbol: 7,
                              coins: 6,
                              oak: 3,
                              positions: 24,
                            },
                          ],
                        },
                        features: {
                          freeSpins: 5,
                          wildMultiplier: [0, 0, 3, 0, 2, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0],
                        },
                      },
                      {
                        coins: 21.3,
                        symbols: {
                          coins: 21.3,
                          initial: [8, 8, 8, 9, 10, 8, 11, 13, 8, 13, 13, 6, 4, 6, 8],
                          final: [8, 0, 8, 0, 0, 8, 11, 13, 8, 13, 13, 6, 0, 6, 8],
                          payouts: [
                            {
                              symbol: 13,
                              coins: 3.3,
                              oak: 4,
                              positions: 0,
                            },
                            {
                              symbol: 8,
                              coins: 0.6,
                              oak: 3,
                              positions: 2,
                            },
                            {
                              symbol: 8,
                              coins: 0.6,
                              oak: 3,
                              positions: 3,
                            },
                            {
                              symbol: 11,
                              coins: 2.4,
                              oak: 3,
                              positions: 5,
                            },
                            {
                              symbol: 8,
                              coins: 1.8,
                              oak: 3,
                              positions: 6,
                            },
                            {
                              symbol: 13,
                              coins: 1.2,
                              oak: 3,
                              positions: 10,
                            },
                            {
                              symbol: 8,
                              coins: 0.6,
                              oak: 3,
                              positions: 14,
                            },
                            {
                              symbol: 11,
                              coins: 1.2,
                              oak: 3,
                              positions: 15,
                            },
                            {
                              symbol: 8,
                              coins: 1.8,
                              oak: 3,
                              positions: 16,
                            },
                            {
                              symbol: 8,
                              coins: 1.8,
                              oak: 3,
                              positions: 17,
                            },
                            {
                              symbol: 8,
                              coins: 0.6,
                              oak: 3,
                              positions: 19,
                            },
                            {
                              symbol: 8,
                              coins: 3.6,
                              oak: 3,
                              positions: 22,
                            },
                            {
                              symbol: 8,
                              coins: 1.8,
                              oak: 3,
                              positions: 24,
                            },
                          ],
                        },
                        features: {
                          freeSpins: 4,
                          wildMultiplier: [0, 3, 0, 3, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0],
                        },
                      },
                      {
                        coins: 20.4,
                        symbols: {
                          coins: 20.4,
                          initial: [11, 5, 12, 13, 13, 11, 13, 13, 13, 11, 12, 10, 9, 9, 9],
                          final: [0, 5, 12, 0, 13, 11, 13, 13, 13, 0, 12, 10, 9, 0, 9],
                          payouts: [
                            {
                              symbol: 13,
                              coins: 8.8,
                              oak: 4,
                              positions: 1,
                            },
                            {
                              symbol: 13,
                              coins: 0.6,
                              oak: 3,
                              positions: 3,
                            },
                            {
                              symbol: 13,
                              coins: 1,
                              oak: 3,
                              positions: 7,
                            },
                            {
                              symbol: 13,
                              coins: 0.6,
                              oak: 3,
                              positions: 11,
                            },
                            {
                              symbol: 13,
                              coins: 0.6,
                              oak: 3,
                              positions: 13,
                            },
                            {
                              symbol: 13,
                              coins: 8.8,
                              oak: 4,
                              positions: 17,
                            },
                          ],
                        },
                        features: {
                          freeSpins: 3,
                          wildMultiplier: [3, 0, 0, 2, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1, 0],
                        },
                      },
                      {
                        coins: 84.2,
                        symbols: {
                          coins: 84.2,
                          initial: [6, 13, 4, 12, 7, 10, 10, 10, 6, 10, 7, 8, 7, 8, 8],
                          final: [0, 13, 0, 12, 0, 10, 0, 10, 6, 10, 7, 8, 7, 8, 8],
                          payouts: [
                            {
                              symbol: 12,
                              coins: 0.6,
                              oak: 3,
                              positions: 1,
                            },
                            {
                              symbol: 6,
                              coins: 6,
                              oak: 3,
                              positions: 3,
                            },
                            {
                              symbol: 0,
                              coins: 30,
                              oak: 3,
                              positions: 4,
                            },
                            {
                              symbol: 10,
                              coins: 4.2,
                              oak: 4,
                              positions: 8,
                            },
                            {
                              symbol: 10,
                              coins: 2,
                              oak: 3,
                              positions: 11,
                            },
                            {
                              symbol: 10,
                              coins: 2,
                              oak: 3,
                              positions: 12,
                            },
                            {
                              symbol: 0,
                              coins: 30,
                              oak: 3,
                              positions: 13,
                            },
                            {
                              symbol: 6,
                              coins: 6,
                              oak: 3,
                              positions: 14,
                            },
                            {
                              symbol: 13,
                              coins: 0.4,
                              oak: 3,
                              positions: 15,
                            },
                            {
                              symbol: 10,
                              coins: 1.2,
                              oak: 3,
                              positions: 18,
                            },
                            {
                              symbol: 12,
                              coins: 0.6,
                              oak: 3,
                              positions: 20,
                            },
                            {
                              symbol: 10,
                              coins: 1.2,
                              oak: 3,
                              positions: 23,
                            },
                          ],
                        },
                        features: {
                          freeSpins: 2,
                          wildMultiplier: [3, 0, 3, 0, 2, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
                        },
                      },
                      {
                        coins: 81.2,
                        symbols: {
                          coins: 81.2,
                          initial: [7, 9, 3, 12, 8, 12, 5, 13, 13, 5, 12, 12, 9, 9, 8],
                          final: [7, 0, 0, 0, 0, 12, 5, 13, 13, 5, 12, 12, 9, 9, 8],
                          payouts: [
                            {
                              symbol: 13,
                              coins: 0.4,
                              oak: 3,
                              positions: 0,
                            },
                            {
                              symbol: 5,
                              coins: 6,
                              oak: 3,
                              positions: 4,
                            },
                            {
                              symbol: 5,
                              coins: 30,
                              oak: 4,
                              positions: 5,
                            },
                            {
                              symbol: 13,
                              coins: 1,
                              oak: 3,
                              positions: 10,
                            },
                            {
                              symbol: 13,
                              coins: 0.6,
                              oak: 3,
                              positions: 12,
                            },
                            {
                              symbol: 13,
                              coins: 0.6,
                              oak: 3,
                              positions: 14,
                            },
                            {
                              symbol: 5,
                              coins: 4,
                              oak: 3,
                              positions: 15,
                            },
                            {
                              symbol: 13,
                              coins: 0.4,
                              oak: 3,
                              positions: 16,
                            },
                            {
                              symbol: 5,
                              coins: 36,
                              oak: 4,
                              positions: 20,
                            },
                            {
                              symbol: 13,
                              coins: 1,
                              oak: 3,
                              positions: 22,
                            },
                            {
                              symbol: 13,
                              coins: 1.2,
                              oak: 3,
                              positions: 24,
                            },
                          ],
                        },
                        features: {
                          freeSpins: 1,
                          wildMultiplier: [0, 2, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                        },
                      },
                      {
                        coins: 0,
                        symbols: {
                          coins: 0,
                          initial: [11, 11, 9, 12, 10, 10, 11, 7, 7, 11, 11, 10, 12, 12, 11],
                          final: [0, 0, 0, 12, 10, 10, 11, 7, 7, 11, 11, 0, 12, 12, 11],
                          payouts: [],
                        },
                        features: {
                          freeSpins: 0,
                          wildMultiplier: [2, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
                        },
                      },
                    ],
                  },
                ],
              },
            ],
            summary: {
              coins: 1427.2,
              hasMaxWin: false,
            },
          },
          finished: true,
          meta: {
            public: {
              betAmount: 2,
            },
          },
        },
      },
      status: 'finished',
      actions: [],
    } as BetResponseData
  }

  private static getCheatResult(symbol: number, oak = 3) {
    const symbol1 = symbol
    const symbol2 = oak > 1 ? symbol : Symbols.L1
    const symbol3 = oak > 2 ? symbol : Symbols.L2
    const symbol4 = oak > 3 ? symbol : Symbols.L5
    const symbol5 = oak > 4 ? symbol : Symbols.L3
    return {
      roundId: '010dea11-b0a7-4ac1-a9d9-9b1f2aeede75',
      balance: 8,
      results: {
        gameResponse: {
          step: {
            gamePhases: [
              {
                type: 'regular',
                coins: 8,
                playgrounds: [
                  {
                    type: 'basic',
                    coins: 8,
                    fields: [
                      {
                        coins: 8,
                        symbols: {
                          coins: 8,
                          initial: [10, symbol1, 13, 12, symbol2, 3, 3, symbol3, 11, 10, symbol4, 12, 10, symbol5, 8],
                          final: [10, symbol1, 13, 12, symbol2, 3, 3, symbol3, 11, 10, symbol4, 12, 10, symbol5, 8],
                          payouts: [
                            {
                              symbol: symbol,
                              coins: 8,
                              oak: oak,
                              positions: 0,
                            },
                          ],
                        },
                        features: {},
                      },
                    ],
                  },
                ],
              },
            ],
            summary: {
              coins: 8,
              hasMaxWin: false,
            },
          },
          meta: {
            public: {},
          },
          finished: true,
        },
      },
      status: 'finished',
      actions: [],
    }
  }
  private static getCheatBigWinResult(win: number, symbol: number, oak = 3) {
    const symbol1 = symbol
    const symbol2 = oak > 1 ? symbol : Symbols.L1
    const symbol3 = oak > 2 ? symbol : Symbols.L2
    const symbol4 = oak > 3 ? symbol : Symbols.L5
    const symbol5 = oak > 4 ? symbol : Symbols.L3
    const winNumber = win === 0 ? 40 : 420
    // console.log(`win=${win},winNumber=${winNumber}`)
    return {
      roundId: '010dea11-b0a7-4ac1-a9d9-9b1f2aeede75',
      balance: 8,
      results: {
        gameResponse: {
          step: {
            gamePhases: [
              {
                type: 'regular',
                coins: 8,
                playgrounds: [
                  {
                    type: 'basic',
                    coins: 8,
                    fields: [
                      {
                        coins: winNumber,
                        symbols: {
                          coins: 8,
                          initial: [10, symbol1, 13, 12, symbol2, 3, 3, symbol3, 11, 10, symbol4, 12, 10, symbol5, 8],
                          final: [10, symbol1, 13, 12, symbol2, 3, 3, symbol3, 11, 10, symbol4, 12, 10, symbol5, 8],
                          payouts: [
                            {
                              symbol: symbol,
                              coins: 8,
                              oak: oak,
                              positions: 0,
                            },
                          ],
                        },
                        features: {},
                      },
                    ],
                  },
                ],
              },
            ],
            summary: {
              coins: 8,
              hasMaxWin: false,
            },
          },
          meta: {
            public: {},
          },
          finished: true,
        },
      },
      status: 'finished',
      actions: [],
    }
  }
}

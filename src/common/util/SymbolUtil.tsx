import * as PIXI from 'pixi.js'
import { Sprite, Texture } from 'pixi.js'
import { ISymbolResult, Symbols, SymbolSpines } from 'src/config/SymbolConfig'
import { uiSetting } from 'src/config/UISettingConfig'
import GameManager from 'src/managers/GameManager'
import { SymbolModel } from 'src/model/symbol/SymbolModel'

export enum AnimationState {
  Idle,
  Landing,
  Win,
}

const WILD_NUMBER_DISTANCE = {
  REGULAR: 80,
  ONE: 57,
}

export class SymbolUtil {
  // map for container and key is integer
  public static symbolTextureMap = new Map<number, Texture>()

  public static updateSymbolSprite(symbol: PIXI.Sprite, symbolIdx: number) {
    const path = this.getSymbolTexturePath(symbolIdx)
    const position = { x: 0, y: 0 }
    symbol.texture = PIXI.Assets.get(path)
    symbol.position = position
  }

  static get symbolSpineList() {
    // symbol h5 and h6 use same spine
    return [
      SymbolSpines.H1,
      SymbolSpines.H2,
      SymbolSpines.H3,
      SymbolSpines.H4,
      SymbolSpines.H5H6,
      SymbolSpines.Low,
      SymbolSpines.Scatter,
      SymbolSpines.Special,
    ]
  }

  static getSymbolSpine(symbol: Symbols) {
    let spine = ''
    switch (symbol) {
      case Symbols.Wild:
      case Symbols.Extra:
      case Symbols.Boost:
        spine = SymbolSpines.Special
        break
      case Symbols.H1:
        spine = SymbolSpines.H1
        break
      case Symbols.H2:
        spine = SymbolSpines.H2
        break
      case Symbols.H3:
        spine = SymbolSpines.H3
        break
      case Symbols.H4:
        spine = SymbolSpines.H4
        break
      case Symbols.H5:
      case Symbols.H6:
        spine = SymbolSpines.H5H6
        break
      case Symbols.L1:
      case Symbols.L2:
      case Symbols.L3:
      case Symbols.L4:
      case Symbols.L5:
        spine = SymbolSpines.Low
        break
      case Symbols.Scatter:
        spine = SymbolSpines.Scatter
        break
      default:
        console.error(`getSymbolSpine error symbol: ${String(symbol)}`)
        break
    }
    return spine
  }

  static getSymbolSpineName(symbol: Symbols) {
    let spineName = ''
    switch (symbol) {
      case Symbols.Wild:
        spineName = SymbolSpines.Wild
        break
      case Symbols.Extra:
        spineName = SymbolSpines.Extra
        break
      case Symbols.Boost:
        spineName = SymbolSpines.Boost
        break
      case Symbols.H1:
        spineName = SymbolSpines.H1
        break
      case Symbols.H2:
        spineName = SymbolSpines.H2
        break
      case Symbols.H3:
        spineName = SymbolSpines.H3
        break
      case Symbols.H4:
        spineName = SymbolSpines.H4
        break
      case Symbols.H5:
        spineName = SymbolSpines.H5
        break
      case Symbols.H6:
        spineName = SymbolSpines.H6
        break
      case Symbols.L1:
        spineName = SymbolSpines.L1
        break
      case Symbols.L2:
        spineName = SymbolSpines.L2
        break
      case Symbols.L3:
        spineName = SymbolSpines.L3
        break
      case Symbols.L4:
        spineName = SymbolSpines.L4
        break
      case Symbols.L5:
        spineName = SymbolSpines.L5
        break
      case Symbols.Scatter:
        spineName = SymbolSpines.Scatter
        break
      default:
        console.error(`getSymbolSpineName error symbol: ${String(symbol)}`)
        break
    }
    return spineName
  }

  static getSymbolSpineAnimationName(symbol: Symbols, isWinAnim: boolean) {
    const anim = this.getSymbolSpineName(symbol)
    if (symbol >= Symbols.H1) {
      const subTitle = `_${isWinAnim ? 'anim' : 'idle'}`
      return `${anim}${subTitle}`
    } else {
      return this.parseSpecialSymbolAnimation(symbol, isWinAnim)
    }
  }

  static parseSpecialSymbolAnimation(symbol: Symbols, isWinAnim: boolean): string {
    switch (symbol) {
      case Symbols.Extra:
        return isWinAnim ? 'Spin_reveal_anim' : 'Spin_loop_anim'
      case Symbols.Boost:
        return isWinAnim ? 'Boost_reveal_anim' : 'Boost_loop_aim'
      default:
        return isWinAnim ? 'Wild_win_anim' : 'Wild_loop_anim'
    }
  }

  static getSymbolTexturePath(symbol: number) {
    let path = ''

    switch (symbol as Symbols) {
      case Symbols.Wild:
      case Symbols.Extra:
      case Symbols.Boost:
      case Symbols.H1:
      case Symbols.H2:
      case Symbols.H3:
      case Symbols.H4:
      case Symbols.H5:
      case Symbols.H6:
      case Symbols.L1:
      case Symbols.L2:
      case Symbols.L3:
      case Symbols.L4:
      case Symbols.L5:
      case Symbols.Scatter:
        // path = `symbol/${symbol}.png`
        path = `${symbol}.png`
        break
      default:
        console.error(`getSymbolTexturePath error symbol: ${symbol}`)
        break
    }
    return path
  }

  static hasBackgroundSymbol(symbol: number) {
    switch (symbol as Symbols) {
      case Symbols.Wild:
      case Symbols.Extra:
      case Symbols.Boost:
      case Symbols.H1:
      case Symbols.H2:
      case Symbols.H3:
      case Symbols.H4:
        return false
      case Symbols.H5:
      case Symbols.H6:
      case Symbols.L1:
      case Symbols.L2:
      case Symbols.L3:
      case Symbols.L4:
      case Symbols.L5:
        return true
      case Symbols.Scatter:
        return false
      default:
        return false
    }
  }

  public static hasMapBackgroundSymbol(symbol: number) {
    switch (symbol as Symbols) {
      case Symbols.Wild:
      case Symbols.Extra:
      case Symbols.Boost:
        return true
      default:
        return false
    }
  }

  public static getBackgroundAnimationSetting(state: AnimationState, isFreeGame: boolean) {
    const waterDropSetting = uiSetting.waterDrop
    let animation = waterDropSetting.mainLoopAnimation
    switch (state) {
      case AnimationState.Idle:
        animation = isFreeGame ? waterDropSetting.bonusLoopAnimation : waterDropSetting.mainLoopAnimation
        break
      case AnimationState.Landing:
        animation = isFreeGame ? waterDropSetting.bonusLandingAnimation : waterDropSetting.mainLandingAnimation
        break
      case AnimationState.Win:
        animation = isFreeGame ? waterDropSetting.bonusLoopAnimation : waterDropSetting.mainLoopAnimation
        break
    }

    return animation
  }

  public static getSpecialSymbolAnimationSetting(id: Symbols) {
    let animations = {
      disappear: '',
      loop: '',
      reveal: '',
    }
    switch (id) {
      case Symbols.Wild:
        animations = uiSetting.specialSymbol.wild
        break
      case Symbols.Boost:
        animations = uiSetting.specialSymbol.boost
        break
      case Symbols.Extra:
        animations = uiSetting.specialSymbol.extra
        break
    }
    return animations
  }

  public static createWildNumber(multiplier: number): PIXI.Container {
    let wildNumberTexture = this.symbolTextureMap.get(multiplier)
    if (!wildNumberTexture) {
      const strMultiplier = multiplier.toString()
      const containerAll = new PIXI.Container()

      const bg = this.createMultiplierText('WildNumbers/NumberBg', strMultiplier)
      const fg = this.createMultiplierText('WildNumbers/Number', strMultiplier)

      containerAll.addChild(bg)
      containerAll.addChild(fg)

      //containerAll to texture
      wildNumberTexture = GameManager.app.renderer.generateTexture(containerAll)
      this.symbolTextureMap.set(multiplier, wildNumberTexture)
    }

    const spriteContainer = new PIXI.Container()
    const sprite = Sprite.from(wildNumberTexture)
    spriteContainer.addChild(sprite)
    sprite.scale.set(0.8, 0.8)
    sprite.anchor.set(0.5, 0.5)
    sprite.position.set(2, -24)
    return spriteContainer
  }

  private static createMultiplierText(spritePathTemplate: string, strMultiplier: string): PIXI.Container {
    const container = new PIXI.Container()
    const sprites = this.createMultiplierSprites(spritePathTemplate, strMultiplier)

    container.addChild(...sprites)
    this.positionSprites(sprites, strMultiplier)

    return container
  }

  private static createMultiplierSprites(spritePathTemplate: string, strMultiplier: string): Sprite[] {
    const sprites: Sprite[] = []
    for (const char of strMultiplier) {
      const sprite = Sprite.from(`${spritePathTemplate}${char}.png`)
      sprites.push(sprite)
    }

    const spriteX = Sprite.from(`${spritePathTemplate}X.png`)
    sprites.push(spriteX)

    return sprites
  }

  private static positionSprites(sprites: Sprite[], srtMultiplier: string): void {
    const distanceList: number[] = sprites.map((_, i) => {
      const distance = srtMultiplier[i] === '1' ? WILD_NUMBER_DISTANCE.ONE : WILD_NUMBER_DISTANCE.REGULAR
      return (i - (sprites.length - 1) / 2) * distance
    })

    sprites.forEach((sprite, i) => sprite.position.set(distanceList[i], 0))
  }

  public static getFlatIndex(reelIdx: number, rowIdx: number) {
    if (rowIdx > 2) return 0
    return reelIdx * 3 + rowIdx
  }

  public static transferISymbolToSymbol(iSymbol: ISymbolResult) {
    const symbol = new SymbolModel()
    symbol.symbol = iSymbol.symbol
    if (iSymbol.wild) symbol.wild = iSymbol.wild
    if (iSymbol.extra) symbol.extra = iSymbol.extra
    if (iSymbol.boost) symbol.boost = iSymbol.boost
    return symbol
  }

  public static isSpecialSymbol(id: Symbols) {
    return id == Symbols.Wild || id == Symbols.Boost || id == Symbols.Extra
  }

  // Test code don't call
  public static initSymbolList(symbols: ISymbolResult[]) {
    const symbolList = [...symbols]
    const scatter = symbolList.find((s) => (s.symbol as Symbols) == Symbols.Scatter)
    const wild = symbolList.find((s) => (s.symbol as Symbols) == Symbols.Wild)
    if (scatter) symbolList.splice(symbolList.indexOf(scatter), 1)
    if (wild) symbolList.splice(symbolList.indexOf(wild), 1)

    const expandedSymbols: ISymbolResult[] = []
    const tripleSymbols: ISymbolResult[] = []

    symbolList.forEach((symbol) => {
      expandedSymbols.push(symbol)
      tripleSymbols.push(symbol)
    })

    const shuffled = this.shuffleArray(expandedSymbols)

    if (wild) this.insertSymbolWithGap(shuffled, wild, 2)

    const scatterIndex = Math.floor(Math.random() * shuffled.length)
    if (scatter) shuffled.splice(scatterIndex, 0, scatter)

    tripleSymbols.forEach((symbol) => this.addTripleSymbol(shuffled, symbol))
    return shuffled
  }

  private static shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  private static insertSymbolWithGap(array: ISymbolResult[], symbol: ISymbolResult, count: number) {
    let index = Math.floor(Math.random() * (array.length / 2))
    for (let i = 0; i < count; i++) {
      while (
        index < array.length - 1 &&
        (array[index - 1 >= 0 ? index - 1 : 0].symbol === symbol.symbol ||
          array[index].symbol === symbol.symbol ||
          array[index + 1]?.symbol === symbol.symbol)
      ) {
        index = Math.floor(Math.random() * (array.length / 2))
      }
      array.splice(index, 0, symbol)
    }
  }

  private static addTripleSymbol(array: ISymbolResult[], symbol: ISymbolResult) {
    const tripleSymbols: ISymbolResult[] = [symbol, symbol, symbol]
    const symbolIdx = array.findIndex((s) => s.symbol === symbol.symbol)
    const preIdx = symbolIdx - 1 >= 0 ? symbolIdx - 1 : -1
    const nextIdx = symbolIdx + 1 < array.length ? symbolIdx + 1 : -1
    let index = Math.floor(Math.random() * array.length)

    let middleOfOtherSymbols = false
    const preTargetIdx = index - 1
    const nextTargetIdx = index + 1
    if (preTargetIdx >= 0) middleOfOtherSymbols = array[preTargetIdx].symbol == array[index].symbol
    if (!middleOfOtherSymbols && nextTargetIdx < array.length)
      middleOfOtherSymbols = array[nextTargetIdx].symbol == array[index].symbol

    let samePosition = index === symbolIdx || index === preIdx || index === nextIdx
    while (samePosition || middleOfOtherSymbols) {
      index = Math.floor(Math.random() * array.length)

      const preTargetIdx = index - 1
      const nextTargetIdx = index + 1
      if (preTargetIdx >= 0) middleOfOtherSymbols = array[preTargetIdx].symbol == array[index].symbol
      if (!middleOfOtherSymbols && nextTargetIdx < array.length)
        middleOfOtherSymbols = array[nextTargetIdx].symbol == array[index].symbol
      samePosition = index === symbolIdx || index === preIdx || index === nextIdx
    }
    array.splice(index, 0, ...tripleSymbols)
  }
}

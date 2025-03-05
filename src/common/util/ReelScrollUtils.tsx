import { slotmachineConfig } from 'src/config/SlotmachineConfig'
import GameManager from 'src/managers/GameManager'
import { SpeedUpMode } from '../constant/GameType'

export class ReelScrollUtils {
  public static get rebound() {
    return slotmachineConfig.rebound
  }

  public static get velocity() {
    const { loopMoveCount, loopMoveSec } = slotmachineConfig
    const velocity = loopMoveSec > 0 ? loopMoveCount / loopMoveSec : 0
    return velocity
  }

  public static get intervalTime() {
    return GameManager.speedMode != SpeedUpMode.Regular ? 0 : slotmachineConfig.intervalSec
  }

  public static get extendTime() {
    return slotmachineConfig.extendSec
  }

  public static get loopingTime() {
    return slotmachineConfig.loopingSec
  }

  public static get loopEndSec() {
    let sec = slotmachineConfig.loopEndRegularSec
    switch (GameManager.speedMode) {
      case SpeedUpMode.Regular:
        sec = slotmachineConfig.loopEndRegularSec
        break
      case SpeedUpMode.Fast:
        sec = slotmachineConfig.loopEndFasterSec
        break
      case SpeedUpMode.SuperFast:
        sec = sec = slotmachineConfig.loopEndFastestSec
        break
    }
    return sec
  }

  public static get loopMovePerSec() {
    return slotmachineConfig.loopMoveSec
  }

  public static get reboundTime() {
    return slotmachineConfig.reboundSec
  }

  public static get slowDownTime() {
    return slotmachineConfig.reboundSec
  }
}

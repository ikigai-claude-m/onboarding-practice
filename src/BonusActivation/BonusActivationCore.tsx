
import { Core } from '../core/Core'

export class BonusActivationCore extends Core {
 
  public async initial() {
    await this.createApplication({
      backgroundColor: 'rgba(21, 26, 37, 0.8)',
    })
  }

}

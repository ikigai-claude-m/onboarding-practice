import { Spine } from "@esotericsoftware/spine-pixi-v8";

import { uiSetting } from "../../config/UiSettingConfig";

export interface ISpineSetting {
  skeleton: string;
  atlas: string;
  scale: number;
  animation: string;
  blurAnimation: string;
  idleAnimation: string;
  landingAnimation: string;
  boostAnimation: {
    reveal: string;
    loop: string;
  };
}

export interface ISpineCreateSetting {
  spineSetting: ISpineSetting;
  loop: boolean;
  active: boolean;
}

export class UIUtil {
  static createSpine(setting: ISpineSetting): Spine {
    const spine = Spine.from({
      skeleton: setting.skeleton,
      atlas: setting.atlas,
      scale: setting.scale ?? 1,
    });
    spine.state.data.defaultMix = 0.2;
    return spine;
  }

  public static getGrayBgSetting() {
    const maxLength =
      uiSetting.gameWidth > uiSetting.gameHeight
        ? uiSetting.gameWidth
        : uiSetting.gameHeight;
    const position = -maxLength / 2;
    return {
      maxLength: maxLength,
      position: position,
    };
  }
}

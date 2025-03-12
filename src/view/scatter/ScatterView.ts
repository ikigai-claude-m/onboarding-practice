import { Sprite } from "pixi.js";

import { uiSetting } from "../../config/UiSettingConfig";
import { InitScatterView } from "./InitScatterView";
import { ISpineSetting } from "../../common/util/UIUtil";
import {
  AnimationStateListener,
  TrackEntry,
} from "@esotericsoftware/spine-pixi-v8";

export default class Scatter extends InitScatterView {
  public spriteBg: Sprite | null = null;

  constructor() {
    super();
  }

  createObjects() {
    this.createBonusSpine();
    this.createSymbolSpine();
  }

  protected createBonusSpine() {
    const bonusSpine = this.createSpine("Bonus_spine", this.bonusSpineSetting);
    if (!bonusSpine) return;
    bonusSpine.position.set(
      uiSetting.gameWidth / 2,
      uiSetting.gameHeight / 2 - 150
    );

    const animations = [
      {
        animation: this.bonusSpineSetting.idleAnimation,
        delay: 0,
        loop: true,
        idx: 0,
      },
      {
        animation: this.bonusSpineSetting.blurAnimation,
        delay: 2000,
        loop: true,
        idx: 0,
      },
      {
        animation: this.bonusSpineSetting.idleAnimation,
        delay: 2500,
        loop: true,
        idx: 0,
      },
      {
        animation: this.bonusSpineSetting.landingAnimation,
        delay: 3000,
        loop: false,
        idx: 0,
      },
      {
        animation: this.bonusSpineSetting.animation,
        delay: 3500,
        loop: false,
        idx: 0,
      },
    ];

    const firstAnimation = animations[0].animation;
    const lastAnimation = animations[animations.length - 1].animation;

    const listener = {
      start(entry: TrackEntry) {
        if (entry.animation?.name == firstAnimation) {
          bonusSpine.visible = true;
        }
      },
      complete(entry: TrackEntry) {
        if (entry.animation?.name == lastAnimation) {
          bonusSpine.visible = true;
        }
      },
    } as AnimationStateListener;

    bonusSpine.state.addListener(listener);

    animations.forEach(({ animation, delay, loop, idx }, index) => {
      setTimeout(() => {
        if (index == 0) {
          bonusSpine.state.setAnimation(idx, animation, loop);
        } else {
          bonusSpine.state.addAnimation(idx, animation, loop);
        }
      }, delay);
    });

    this.getContainer()?.addChild(bonusSpine);
  }

  protected async createSymbolSpine() {
    const symbolSpine = this.createSpine(
      "Symbol_spine",
      this.symbolSpineSetting
    );
    if (!symbolSpine) return;
    symbolSpine.position.set(
      uiSetting.gameWidth / 2,
      uiSetting.gameHeight / 2 + 200
    );

    const animations = [
      {
        animation: this.symbolSpineSetting.animation,
        delay: 0,
        loop: true,
        idx: 0,
      },
      {
        animation: this.symbolSpineSetting.boostAnimation.reveal,
        delay: 2000,
        loop: false,
        idx: 0,
      },
      {
        animation: this.symbolSpineSetting.boostAnimation.loop,
        delay: 4000,
        loop: true,
        idx: 0,
      },
    ];

    const firstAnimation = animations[0].animation;
    const lastAnimation = animations[animations.length - 1].animation;

    const sprite = await this.createWildNumberImage();

    const listener = {
      start(entry: TrackEntry) {
        if (entry.animation?.name == firstAnimation) {
          symbolSpine.visible = true;
          symbolSpine.addChild(sprite);
        } else {
          sprite.visible = false;
        }
      },
      complete(entry: TrackEntry) {
        if (entry.animation?.name == lastAnimation) {
          symbolSpine.visible = true;
        }
      },
    } as AnimationStateListener;

    symbolSpine.state.addListener(listener);

    animations.forEach(({ animation, delay, loop, idx }, index) => {
      setTimeout(() => {
        if (index == 0) {
          symbolSpine.state.setAnimation(idx, animation, loop);
        } else {
          symbolSpine.state.addAnimation(idx, animation, loop);
        }
      }, delay);
    });
    this.getContainer()?.addChild(symbolSpine);
  }

  private createWildNumberImage(): Promise<Sprite> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img1 = new Image();
      const img2 = new Image();
      Promise.all([
        new Promise((resolve) => {
          img1.onload = resolve;
          img1.src = "wildNumbers/Number1.png";
        }),
        new Promise((resolve) => {
          img2.onload = resolve;
          img2.src = "wildNumbers/NumberX.png";
        }),
      ]).then(() => {
        ctx.drawImage(img1, 0, 0, img1.width - 20, img1.height - 20);
        ctx.drawImage(img2, 65, 0, img2.width - 20, img2.height - 20);
        const sprite = Sprite.from(canvas);
        sprite.anchor.set(0.5, 0.95);
        resolve(sprite);
      });
    });
  }

  private get bonusSpineSetting() {
    const setting = uiSetting.bonusSpine;
    return {
      skeleton: setting.skeleton,
      atlas: setting.atlas,
      scale: 1,
      animation: setting.animation,
      blurAnimation: setting.blurAnimation,
      idleAnimation: setting.idleAnimation,
      landingAnimation: setting.landingAnimation,
    } as ISpineSetting;
  }

  private get symbolSpineSetting() {
    const setting = uiSetting.symbolSpine;
    return {
      skeleton: setting.skeleton,
      atlas: setting.atlas,
      scale: 1,
      animation: setting.animation,
      boostAnimation: {
        reveal: setting.boostAnimation.reveal,
        loop: setting.boostAnimation.loop,
      },
    } as ISpineSetting;
  }
}


export const uiSetting = {
  gameWidth: 1920,
  gameHeight: 1080,
  regularFont: 'Gibson',
  buttonNormalSubtitle: `_normal.png`,
  buttonHoverSubtitle: `_focus.png`,
  gradientFont: 'River Adventurer',
  spineDataSubtitle: '_spineData',
  spineAtlasSubtitle: '_spineAtlas',
  get bonusSpine() {
    const spineName = 'scatter/Bonus_anim'
    return {
      spineName: spineName,
      skeleton: `${spineName}.json`,
      atlas: `${spineName}.atlas`,
      animation: 'Bonus_anim',
      blurAnimation: 'Bonus_blur',
      idleAnimation: 'Bonus_idle',
      landingAnimation: 'Bonus_landing',
    }
  },
}

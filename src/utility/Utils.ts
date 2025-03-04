 export const DEVICE_TYPE = {
  DESKTOP: 'desktop',
  TABLET: 'tablet',
  MOBILE: 'mobile',
  IPHONE: 'iphone',
}
export const DEVICE_OS = {
  IPHONE: 'iphone',
  ANDROID: 'android',
}
export const ORIENTATION = {
  LANDSCAPE: 'landscape',
  PORTRAIT: 'portrait',
}

export class Utils {
  public static async wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  public static getDeviceType() {
    const userAgent = navigator.userAgent.toLowerCase()

    // tablet
    if (
      /tablet|ipad|playbook|silk/.test(userAgent) ||
      (navigator.userAgent.includes('Android') && !userAgent.includes('mobile'))
    ) {
      return DEVICE_TYPE.TABLET
    }

    // mobile
    if (/mobi|android|iphone|ipod/.test(userAgent)) {
      return DEVICE_TYPE.MOBILE
    }

    // desktop
    return DEVICE_TYPE.DESKTOP
  }
  public static getDeviceOs() {
    const userAgent = navigator.userAgent.toLowerCase()
    //iphone
    if (/iphone|ipod/.test(userAgent)) {
      return DEVICE_TYPE.IPHONE
    }

    return DEVICE_OS.ANDROID
  }

  public static get isLandscape() {
    return Utils.getOrientation() === ORIENTATION.LANDSCAPE
  }

  public static get isPortrait() {
    return Utils.getOrientation() === ORIENTATION.PORTRAIT
  }

  public static get isMobile() {
    return Utils.getDeviceType() !== DEVICE_TYPE.DESKTOP
  }

  public static getOrientation() {
    if (window.screen.orientation.type.includes('portrait')) {
      return ORIENTATION.PORTRAIT
    } else {
      return ORIENTATION.LANDSCAPE
    }
  }

  public static getResolution() {
    return {
      w: window.innerWidth,
      h: window.innerHeight,
    }
  }
}

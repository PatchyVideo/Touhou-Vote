/**
 * 阿里云验证码 2.0 人机验证（配合后端 B-043 发码闸门）。
 *
 * prefix 与 SceneId 必须与后端 Nacos（ALIYUN_CAPTCHA_SCENE_ID_SEND_CODE）
 * 属于同一账户、同一场景；更换阿里云账户时此处两值与后端三键一起换，
 * 见后端仓库 docs/operations/captcha-onboarding.md §六。
 */

const CAPTCHA_REGION = 'cn'
const CAPTCHA_PREFIX = '1tr0oy'
const CAPTCHA_SCENE_ID = '8yhz5jet'
const SCRIPT_SRC = 'https://o.alicdn.com/captcha-frontend/aliyunCaptcha/AliyunCaptcha.js'

declare global {
  interface Window {
    AliyunCaptchaConfig?: { region: string; prefix: string }
    initAliyunCaptcha?: (config: Record<string, unknown>) => void
  }
}

let scriptPromise: Promise<boolean> | null = null

/**
 * 预载验证码脚本。官方要求脚本必须从阿里 CDN 动态加载，且脚本加载到发起
 * 验证之间建议 ≥2s（设备指纹采集），所以在组件挂载时就预载，而不是点击时。
 * resolve false = 加载失败（如海外网络加载 o.alicdn.com 不通）。
 */
export function preloadAliyunCaptcha(): Promise<boolean> {
  if (window.initAliyunCaptcha) return Promise.resolve(true)
  if (!scriptPromise) {
    window.AliyunCaptchaConfig = { region: CAPTCHA_REGION, prefix: CAPTCHA_PREFIX }
    scriptPromise = new Promise((resolve) => {
      const el = document.createElement('script')
      el.src = SCRIPT_SRC
      el.onload = (): void => resolve(Boolean(window.initAliyunCaptcha))
      el.onerror = (): void => resolve(false)
      document.head.appendChild(el)
    })
  }
  return scriptPromise
}

let holderSeq = 0

/**
 * 弹出人机验证并返回 captchaVerifyParam。
 * - resolve string：验证通过，随发码请求带给后端二次校验。
 * - resolve null：用户关闭了验证弹窗，调用方应静默中止本次发送。
 * - resolve undefined：脚本不可用（加载失败），降级为无参请求，由后端裁决
 *   （后端闸门开着会以"请完成人机验证"拒绝，关着则照常发码）。
 */
export async function verifyHuman(): Promise<string | null | undefined> {
  const available = await preloadAliyunCaptcha()
  if (!available || !window.initAliyunCaptcha) return undefined

  // 验证是一次性生命周期：清掉上一轮弹窗残留后重新 init
  document.getElementById('aliyunCaptcha-mask')?.remove()
  document.getElementById('aliyunCaptcha-window-popup')?.remove()

  holderSeq += 1
  const btnId = `aliyun-captcha-btn-${holderSeq}`
  const elId = `aliyun-captcha-el-${holderSeq}`
  // 隐藏代理按钮：widget 只支持绑定按钮触发，用屏幕外按钮承接，
  // 避免与业务按钮上已有的校验/倒计时逻辑打架
  const holder = document.createElement('div')
  holder.style.cssText = 'position:fixed;left:-9999px;top:0'
  holder.innerHTML = `<button id="${btnId}" type="button"></button><div id="${elId}"></div>`
  document.body.appendChild(holder)

  return new Promise((resolve) => {
    let settled = false
    let triggered = false
    const done = (v: string | null): void => {
      if (settled) return
      settled = true
      holder.remove()
      resolve(v)
    }
    // 触发弹窗：widget 通过 initAliyunCaptcha 给按钮绑定点击监听，这个绑定
    // 是异步的——必须等 getInstance 回调（实例就绪=按钮已绑好）再点，否则
    // 点击落空、Promise 永远悬住（表现为无弹窗/无报错/无倒计时）。
    const trigger = (): void => {
      if (triggered) return
      triggered = true
      document.getElementById(btnId)?.click()
    }
    window.initAliyunCaptcha?.({
      SceneId: CAPTCHA_SCENE_ID,
      mode: 'popup',
      element: `#${elId}`,
      button: `#${btnId}`,
      success: (captchaVerifyParam: string): void => done(captchaVerifyParam),
      // 单次滑动失败由组件内部引导重试，不结束 Promise
      fail: (): void => undefined,
      onClose: (): void => done(null),
      getInstance: (): void => trigger(),
      slideStyle: { width: 360, height: 40 },
      language: 'cn',
    })
    // 兜底：某些版本 getInstance 触发偏晚或不触发，300ms 后强制点一次
    setTimeout(trigger, 300)
  })
}

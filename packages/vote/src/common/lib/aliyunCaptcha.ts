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
  // 隐藏代理按钮：opacity:0 让按钮在视口内，SDK 3.28.0 的 popup 模式
  // 对 left:-9999px 的屏幕外按钮不再可靠触发。但按钮仍需保留——
  // 部分旧版 SDK 只支持按钮点击触发，instance.show() 作为主方案。
  const holder = document.createElement('div')
  holder.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;overflow:hidden'
  holder.innerHTML = `<button id="${btnId}" type="button" style="opacity:0;width:0;height:0"></button><div id="${elId}"></div>`
  document.body.appendChild(holder)

  return new Promise((resolve) => {
    let settled = false
    let triggered = false
    let capInstance: any = null
    const done = (v: string | null): void => {
      if (settled) return
      settled = true
      capInstance = null
      holder.remove()
      resolve(v)
    }
    const trigger = (): void => {
      if (triggered) return
      triggered = true
      // 优先用 instance.show()——SDK 3.28.0 对屏幕外按钮的 .click()
      // 不再可靠弹出 popup（DOM 已渲染但 class 不切换）
      if (capInstance && typeof capInstance.show === 'function') {
        capInstance.show()
      }
      // 旧版 SDK / 不支持 show() 的兜底
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
      getInstance: (instance: any): void => {
        capInstance = instance
        trigger()
      },
      slideStyle: { width: 360, height: 40 },
      language: 'cn',
    })
    // 兜底：某些版本 getInstance 触发偏晚或不触发，300ms 后强制触发
    setTimeout(trigger, 300)
  })
}

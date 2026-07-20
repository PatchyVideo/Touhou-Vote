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

let pendingPromise: Promise<string | null | undefined> | null = null

/**
 * 弹出人机验证并返回 captchaVerifyParam。
 * - resolve string：验证通过，随发码请求带给后端二次校验。
 * - resolve null：用户关闭了验证弹窗，调用方应静默中止本次发送。
 * - resolve undefined：脚本不可用（加载失败），降级为无参请求，由后端裁决
 *   （后端闸门开着会以"请完成人机验证"拒绝，关着则照常发码）。
 */
export async function verifyHuman(): Promise<string | null | undefined> {
  // 防连点：上一次弹窗还在生命周期内就直接返回它的 Promise
  if (pendingPromise) return pendingPromise

  const available = await preloadAliyunCaptcha()
  if (!available || !window.initAliyunCaptcha) return undefined

  // 验证是一次性生命周期：清掉上一轮弹窗残留后重新 init
  document.getElementById('aliyunCaptcha-mask')?.remove()
  document.getElementById('aliyunCaptcha-window-popup')?.remove()

  pendingPromise = new Promise<string | null | undefined>((resolve) => {
    let settled = false
    let capInstance: any = null

    const done = (v: string | null | undefined): void => {
      if (settled) return
      settled = true
      capInstance = null
      pendingPromise = null
      resolve(v)
    }

    // 连点/id 漂移导致 initAliyunCaptcha 可能在 pending[0] 期间被调多次，
    // getInstance 也会重复触发；只信第一次实例
    let inited = false

    window.initAliyunCaptcha?.({
      SceneId: CAPTCHA_SCENE_ID,
      mode: 'popup',
      success: (captchaVerifyParam: string): void => done(captchaVerifyParam),
      fail: (): void => undefined,
      onClose: (): void => done(null),
      getInstance: (instance: any): void => {
        if (inited) return
        inited = true
        capInstance = instance
        if (capInstance && typeof capInstance.show === 'function') {
          capInstance.show()
        }
      },
      slideStyle: { width: 360, height: 40 },
      language: 'cn',
    })

    // 极端兜底：若 getInstance 始终不触发，600ms 后放弃
    setTimeout(() => {
      if (inited || settled) return
      // still no instance — SDK may have silently failed
      done(undefined)
    }, 600)
  })

  return pendingPromise
}

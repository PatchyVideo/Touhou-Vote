/**
 * 设备指纹（Phase 0：localStorage UUID）——反刷票取证用。
 *
 * 首次访问生成一个持久 UUID 存 localStorage，随投票提交与登录（=注册）上报，
 * 后端落库到投票记录 / user.register_device_id，供事后"一人多小号"聚类分析。
 * 仅作取证记录、非拦截门；清缓存/无痕会重置（Phase 1 可升级到 FingerprintJS）。
 */

const STORAGE_KEY = 'thvote_device_id'

function generate(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // 兜底：极老浏览器无 crypto.randomUUID
  return 'dev-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10)
}

/** 返回稳定的设备 UUID；取不到就生成并持久化。localStorage 不可用时返回本次会话内一致的临时值。 */
export function getDeviceId(): string {
  try {
    let id = localStorage.getItem(STORAGE_KEY)
    if (!id) {
      id = generate()
      localStorage.setItem(STORAGE_KEY, id)
    }
    return id
  } catch {
    // localStorage 被禁用（隐私模式/策略）——退化为不持久化，至少不报错
    return generate()
  }
}

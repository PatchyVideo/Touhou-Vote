import { ref } from 'vue'

/**
 * 提交按钮「单飞」守卫（FE-01）。
 *
 * useMutation 的 loading 只用于展示：Vue 的响应式状态要到下一次 DOM 更新（微任务）才反映到按钮上，
 * 因此确认按钮没有 in-flight 锁时，同一帧内的连点会进入两次点击处理函数并发出两个提交请求。
 * 这里在调用瞬间同步置位，保证同一时刻最多一个请求在途；请求结束（成功/失败）后释放，失败可重试。
 */
export function useSingleFlightSubmit() {
  const submitting = ref(false)

  async function run(task: () => Promise<unknown> | unknown): Promise<void> {
    if (submitting.value) return
    submitting.value = true
    try {
      await task()
    } catch {
      // 错误提示由调用方的 onError 负责，这里只保证锁一定被释放
    } finally {
      submitting.value = false
    }
  }

  return { submitting, run }
}

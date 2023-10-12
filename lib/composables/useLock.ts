import { ref } from 'vue'

import { getScrollbarWidth } from '../utils/getScrollbarWidth'

export function useLock() {
  const paddingSize = ref<number | null>(getScrollbarWidth())

  function lock() {
    document.documentElement.style.overflow = 'hidden'

    if (document.documentElement.scrollHeight > document.documentElement.clientHeight) {
      document.body.style.paddingRight = `${paddingSize.value}px`
      // document.body.style.width = `calc(100% - ${paddingSize.value}px)`
    }
  }

  function unlock() {
    document.documentElement.style.overflow = 'auto'
    document.body.style.paddingRight = '0px'
    // document.body.style.width = 'auto'
  }

  function toggleLock(value: boolean) {
    value ? lock() : unlock()
  }

  return {
    paddingSize,
    toggleLock
  }
}

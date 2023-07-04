import {ref} from 'vue'

export function useLock() {
    const paddingSize = ref<number | null>(null)

    function getScrollbarWidth(): number {
        // Creating invisible container
        const outer = document.createElement('div')
        outer.style.visibility = 'hidden'
        outer.style.overflow = 'scroll' // forcing scrollbar to appear
        // outer.style.msOverflowStyle = 'scrollbar' // needed for WinJS apps
        document.body.appendChild(outer)

        // Creating inner element and placing it in the container
        const inner = document.createElement('div')
        outer.appendChild(inner)

        // Calculating difference between container's full width and the child width
        const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth)

        // Removing temporary elements from the DOM
        outer.parentNode?.removeChild(outer)

        return scrollbarWidth
    }

    function lock() {
        document.documentElement.style.overflow = 'hidden'
        document.body.style.paddingRight = `${paddingSize.value}px`
    }

    function unlock() {
        document.documentElement.style.overflow = 'auto'
        document.body.style.paddingRight = '0px'
    }

    function toggleLock(value: boolean) {
        if (paddingSize.value === null) paddingSize.value = getScrollbarWidth()
        value ? lock() : unlock()
    }

    return {
        paddingSize,
        toggleLock
    }
}
import { onMounted, onUnmounted } from 'vue'
import { modals } from '../../modals'
import { commands } from '../commands'
import { currentSidebar } from '../sidebars'

const onKeydown = (event: KeyboardEvent) => {
    if (modals.length) return
    if (currentSidebar.value?.contains(document.activeElement)) return

    if (event.key !== ' ' && event.code !== 'Space') return

    event.preventDefault()
    void commands.play.execute()
}

export const useKeyboardControl = () => {
    onMounted(() => {
        addEventListener('keydown', onKeydown)
    })

    onUnmounted(() => {
        removeEventListener('keydown', onKeydown)
    })
}

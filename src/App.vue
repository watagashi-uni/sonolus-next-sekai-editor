<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import LevelEditor from './editor/LevelEditor.vue'
import ModalManager from './modals/ModalManager.vue'
import { settings } from './settings'
import { hasUrlParams, loadFromUrl } from './urlLoader'

// Original project info (for info modal)
const ORIGINAL_REPO = 'https://github.com/NonSpicyBurrito/sonolus-pjsekai-editor'

// Set locale
watch(
    () => settings.locale,
    () => {
        document.documentElement.lang = settings.locale
    },
    { immediate: true },
)

// Loading state
const isLoading = ref(true)
const loadingMessage = ref('Initializing...')
const loadError = ref<string | null>(null)

// Info modal state
const showInfoModal = ref(false)

// Auto-load from URL on mount
onMounted(async () => {
    if (hasUrlParams()) {
        try {
            const success = await loadFromUrl((stage) => {
                loadingMessage.value = stage
            })
            if (!success) {
                loadError.value = 'Failed to load chart from URL'
            }
        } catch (error) {
            loadError.value = error instanceof Error ? error.message : 'Unknown error'
        }
    }
    isLoading.value = false
})
</script>

<template>
    <!-- Loading overlay -->
    <div
        v-if="isLoading"
        class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg"
    >
        <div class="text-2xl font-bold text-button mb-4">Chart Preview</div>
        <div class="text-button/70">{{ loadingMessage }}</div>
    </div>

    <!-- Error state -->
    <div
        v-else-if="loadError"
        class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg"
    >
        <div class="text-2xl font-bold text-red-400 mb-4">Error</div>
        <div class="text-button/70">{{ loadError }}</div>
        <div class="mt-4 text-button/50 text-sm">
            Please check the URL parameters and try again
        </div>
    </div>

    <!-- Main editor (full screen, no sidebar/preview panels) -->
    <div v-else class="flex h-screen w-screen overflow-hidden relative">
        <div class="flex-grow">
            <LevelEditor />
        </div>
        
        <!-- Info button -->
        <button
            class="absolute bottom-2 left-2 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-button/80 hover:bg-button text-bg transition-colors shadow-lg"
            @click="showInfoModal = true"
            title="关于"
        >
            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </button>
    </div>

    <!-- Info Modal -->
    <div
        v-if="showInfoModal"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
        @click.self="showInfoModal = false"
    >
        <div class="bg-[#2a2a3e] rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div class="p-4 border-b border-white/20">
                <div class="flex items-center justify-between">
                    <h2 class="text-lg font-bold text-white">关于 Chart Preview</h2>
                    <button
                        class="text-white/60 hover:text-white"
                        @click="showInfoModal = false"
                    >
                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
            <div class="p-4 text-white/80 text-sm space-y-4">
                <p>
                    本项目基于 
                    <a 
                        :href="ORIGINAL_REPO" 
                        target="_blank" 
                        class="text-accent underline hover:text-accent/80"
                    >
                        sonolus-pjsekai-editor
                    </a> 
                    修改而来，移除了编辑功能，仅保留谱面预览功能。
                </p>
                
                <div class="bg-black/60 text-white/90 rounded p-3 text-xs font-mono whitespace-pre-wrap overflow-x-auto">MIT License

Copyright (c) 2025 NonSpicyBurrito

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.</div>
            </div>
        </div>
    </div>

    <ModalManager />
</template>

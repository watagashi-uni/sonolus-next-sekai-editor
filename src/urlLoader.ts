/**
 * URL Parameter Loader for Preview Mode
 * Loads chart and BGM from URL parameters for preview-only mode
 */

import { parseSusChart } from './chart/parse/sus'
import { validateChart } from './chart/validate'
import { pushState, resetState, state } from './history'
import { loadBgm } from './player'
import { parseSus } from './sus/parse'
import { createWaveform } from './waveform'
import { settings } from './settings'

export interface UrlParams {
    sus?: string      // SUS chart file URL
    bgm?: string      // BGM audio file URL  
    offset?: number   // Offset in milliseconds
}

/**
 * Parse URL parameters for preview mode
 */
export const parseUrlParams = (): UrlParams => {
    const params = new URLSearchParams(window.location.search)

    return {
        sus: params.get('sus') ?? undefined,
        bgm: params.get('bgm') ?? undefined,
        offset: params.has('offset') ? parseFloat(params.get('offset')!) : undefined,
    }
}

/**
 * Check if the app should load from URL parameters
 */
export const hasUrlParams = (): boolean => {
    const params = parseUrlParams()
    return !!params.sus
}

/**
 * Load chart and BGM from URL parameters
 * Returns true if loading was successful
 */
export const loadFromUrl = async (
    onProgress?: (stage: string) => void
): Promise<boolean> => {
    const params = parseUrlParams()

    if (!params.sus) {
        return false
    }

    try {
        // 1. Load SUS chart file
        onProgress?.('Loading chart...')
        const susResponse = await fetch(params.sus)
        if (!susResponse.ok) {
            throw new Error(`Failed to load chart: ${susResponse.status}`)
        }
        const susText = await susResponse.text()
        const susData = susText.split('\n')

        // 2. Parse SUS and convert to Chart
        onProgress?.('Parsing chart...')
        const sus = parseSus(susData)
        const chart = parseSusChart(sus)
        validateChart(chart)

        // 3. Calculate offset (URL param in ms takes priority, then SUS offset)
        const offsetSeconds = params.offset !== undefined
            ? params.offset / 1000  // Convert ms to seconds
            : sus.offset

        // 4. Initialize state with chart
        resetState(chart, offsetSeconds, 'preview')

        // 5. Load BGM if provided
        if (params.bgm) {
            onProgress?.('Loading audio...')
            const bgmResponse = await fetch(params.bgm)
            if (!bgmResponse.ok) {
                console.warn(`Failed to load BGM: ${bgmResponse.status}`)
            } else {
                const bgmData = await bgmResponse.arrayBuffer()

                onProgress?.('Decoding audio...')
                const buffer = await loadBgm(bgmData)

                onProgress?.('Generating waveform...')
                const waveform = await createWaveform(buffer, settings.waveform)

                // Update state with BGM
                pushState(() => 'Load BGM', {
                    ...state.value,
                    bgm: {
                        filename: 'bgm.mp3',
                        buffer,
                        waveform,
                        offset: offsetSeconds,
                    },
                })
            }
        }

        onProgress?.('Ready!')
        return true

    } catch (error) {
        console.error('Failed to load from URL:', error)
        onProgress?.(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        return false
    }
}

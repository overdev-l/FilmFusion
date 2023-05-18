import { test, expect, vi, } from "vitest"
import { TimeController, } from "../src/index"

test("TimeController basic functionality", async () => {
    const mockOnTimeUpdate = vi.fn()
    const mockRenderPlay = vi.fn()
    const mockRenderPause = vi.fn()
    const mockNextFiber = vi.fn()

    const timeController = new TimeController({
        duration: 10000,
        onTimeUpdate: mockOnTimeUpdate,
        play: mockRenderPlay,
        pause: mockRenderPause,
        nextFiber: mockNextFiber,
    })

    expect(mockOnTimeUpdate).toBeCalledTimes(1)

    timeController.setCurrentTime(5000)
    expect(timeController.currentDuration).toBe(5000)
    expect(timeController.playerStatus).toBe(2)

    timeController.play()
    expect(mockRenderPlay).toBeCalledTimes(1)

    timeController.pause()
    expect(mockRenderPause).toBeCalledTimes(2)

    await timeController.next()
    expect(mockNextFiber).toBeCalledTimes(1)
})

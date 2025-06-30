"use client"

import { useEffect, useRef } from "react"
import createGlobe from "cobe"
import { useTheme } from "next-themes"

export function GitHubGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const { theme } = useTheme()

  useEffect(() => {
    if (!canvasRef.current) return

    let phi = 0
    let width = 0

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth
      }
    }
    window.addEventListener("resize", onResize)
    onResize()

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.3,
      dark: theme === "dark" ? 1 : 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: theme === "dark" ? [0.1, 0.1, 0.1] : [1, 1, 1],
      markerColor: [0.4, 0.4, 0.9],
      glowColor: [0.3, 0.3, 0.9],
      markers: [
        { location: [37.7595, -122.4367], size: 0.05 },
        { location: [40.7128, -74.006], size: 0.05 },
        { location: [51.5074, -0.1278], size: 0.05 },
        { location: [35.6762, 139.6503], size: 0.05 },
        { location: [48.8566, 2.3522], size: 0.05 },
        { location: [-33.8688, 151.2093], size: 0.05 },
        { location: [22.3193, 114.1694], size: 0.05 },
        { location: [25.276987, 55.296249], size: 0.05 },
      ],
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phi += 0.005
        }
        state.phi = phi + pointerInteractionMovement.current
        state.width = width * 2
        state.height = width * 2
      },
    })

    const onPointerDown = (e: PointerEvent) => {
      pointerInteracting.current = e.clientX - pointerInteractionMovement.current
      canvasRef.current?.style.setProperty("cursor", "grabbing")
    }

    const onPointerUp = () => {
      pointerInteracting.current = null
      canvasRef.current?.style.setProperty("cursor", "grab")
    }

    const onPointerOut = () => {
      pointerInteracting.current = null
      canvasRef.current?.style.setProperty("cursor", "grab")
    }

    const onMouseMove = (e: MouseEvent) => {
      if (pointerInteracting.current !== null) {
        const delta = e.clientX - pointerInteracting.current
        pointerInteractionMovement.current = delta / 100
      }
    }

    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("pointerup", onPointerUp)
    document.addEventListener("pointerout", onPointerOut)
    document.addEventListener("mousemove", onMouseMove)

    return () => {
      globe.destroy()
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("pointerup", onPointerUp)
      document.removeEventListener("pointerout", onPointerOut)
      document.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("resize", onResize)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        cursor: "grab",
        contain: "layout paint size",
        opacity: 0.9,
      }}
    />
  )
}

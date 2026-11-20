'use client'

import { useEffect, useState } from 'react'
import { ImageOverlay, TileLayer, useMap } from 'react-leaflet'
import { getStyle } from '@/config/games/defineGame'
import { MAP_SVG_SIZE, buildMapScene, sceneToSvg, svgElementFromMarkup } from '@/lib/mapArtwork'
import { leafletBounds } from '@/lib/projection'
import type { GameConfig } from '@/types/game'
import L from 'leaflet'

function probe(url: string) {
  return new Promise<boolean>((resolve) => {
    const image = new Image()
    image.onload = () => resolve(true)
    image.onerror = () => resolve(false)
    image.src = url
  })
}

function VectorAtlas({ game, styleId }: { game: GameConfig; styleId: string }) {
  const map = useMap()
  useEffect(() => {
    const markup = sceneToSvg(buildMapScene(game, styleId), MAP_SVG_SIZE)
    const svg = svgElementFromMarkup(markup)
    const layer = L.svgOverlay(svg, leafletBounds(), { interactive: false, opacity: 1 })
    layer.addTo(map)
    return () => {
      layer.remove()
    }
  }, [game, map, styleId])
  return null
}

export function TileLayerManager({ game, styleId }: { game: GameConfig; styleId: string }) {
  const style = getStyle(game, styleId)
  const [tileState, setTileState] = useState<Record<string, boolean>>({})
  const [imageState, setImageState] = useState<Record<string, boolean>>({})
  const [heldUrl, setHeldUrl] = useState<string | null>(null)
  const tileProbe = style.tileUrl.replaceAll('{z}', '0').replaceAll('{x}', '0').replaceAll('{y}', '0')
  const probeState = tileState[tileProbe]
  const tiles = probeState === true || (probeState === undefined && heldUrl !== null)
  const tileUrl = probeState === true ? style.tileUrl : heldUrl ?? style.tileUrl
  const image = style.fallbackImage ? imageState[style.fallbackImage] === true : false

  useEffect(() => {
    let cancelled = false
    void probe(tileProbe).then((ok) => {
      if (cancelled) return
      setTileState((current) => ({ ...current, [tileProbe]: ok }))
      if (ok) setHeldUrl(style.tileUrl)
    })
    return () => {
      cancelled = true
    }
  }, [style.tileUrl, tileProbe])

  useEffect(() => {
    if (style.fallbackMode !== 'image' || !style.fallbackImage) return
    let cancelled = false
    const url = style.fallbackImage
    void probe(url).then((ok) => {
      if (!cancelled) setImageState((current) => ({ ...current, [url]: ok }))
    })
    return () => {
      cancelled = true
    }
  }, [style.fallbackImage, style.fallbackMode])

  if (game.atlas === 'cayo') return null

  if (style.tileUrl.startsWith('https://')) {
    return (
      <TileLayer
        url={style.tileUrl}
        noWrap
        tileSize={256}
        minZoom={game.minZoom}
        maxZoom={game.maxZoom}
        maxNativeZoom={game.maxNativeZoom}
      />
    )
  }

  if (tiles) {
    return (
      <TileLayer
        url={tileUrl}
        bounds={leafletBounds()}
        noWrap
        tileSize={256}
        minZoom={game.minZoom}
        maxZoom={game.maxZoom}
        maxNativeZoom={game.maxNativeZoom}
      />
    )
  }

  if (style.fallbackMode === 'image' && image && style.fallbackImage) {
    return <ImageOverlay url={style.fallbackImage} bounds={leafletBounds()} opacity={1} />
  }

  return <VectorAtlas game={game} styleId={style.id} />
}

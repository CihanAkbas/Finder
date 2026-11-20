import { gta6Atlas, type MarkerSprite } from '@/config/games/gta6/markerIcons'

export function MarkerGlyph({ sprite, size = 22 }: { sprite: MarkerSprite; size?: number }) {
  const scale = size / sprite.w
  return (
    <span
      aria-hidden
      className="inline-block shrink-0"
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${gta6Atlas.url})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: `${-sprite.x * scale}px ${-sprite.y * scale}px`,
        backgroundSize: `${gta6Atlas.width * scale}px ${gta6Atlas.height * scale}px`,
      }}
    />
  )
}

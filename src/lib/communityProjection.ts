import calibration from '@/config/games/gta6/communityCalibration.json'

/** Converts GTABase community world coordinates to this catalog's geographic tile frame. */
export function communityToMap(x: number, y: number) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error('Invalid community coordinates')
  const mercatorY = y * calibration.fy.scale + calibration.fy.offset
  return {
    x: x * calibration.fx.scale + calibration.fx.offset,
    y: (2 * Math.atan(Math.exp(mercatorY * Math.PI / 180)) - Math.PI / 2) * 180 / Math.PI,
  }
}

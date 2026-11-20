import type { LucideIcon, LucideProps } from 'lucide-react'
import {
  Building2,
  Clapperboard,
  Crosshair,
  Egg,
  Flag,
  Gamepad2,
  Gem,
  Landmark,
  Leaf,
  MapPin,
  Mountain,
  Radiation,
  Radio,
  Rocket,
  ScrollText,
  Shield,
  Spade,
  Store,
  Truck,
  Wrench,
} from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  gem: Gem,
  rocket: Rocket,
  scroll: ScrollText,
  leaf: Leaf,
  radiation: Radiation,
  flag: Flag,
  landmark: Landmark,
  mountain: Mountain,
  store: Store,
  crosshair: Crosshair,
  truck: Truck,
  egg: Egg,
  pin: MapPin,
  building: Building2,
  cards: Spade,
  figure: Gem,
  radio: Radio,
  film: Clapperboard,
  arcade: Gamepad2,
  shield: Shield,
  wrench: Wrench,
}

export function CategoryIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = icons[name] ?? MapPin
  return <Icon {...props} />
}

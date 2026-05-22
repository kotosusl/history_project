export interface MenuItem {
  id: string
  label: string
  href: string
}

export interface Fact {
  id: number
  title: string
  period: string
  description: string
  icon: string
  details: string[]
}

export interface TimelineEvent {
  year: string
  title: string
  description: string
  icon: string
}

export interface Stat {
  value: number
  label: string
  icon: string
}

export interface ModalData {
  isOpen: boolean
  title: string
  content: string[]
  icon: string
}

export interface ChartData {
  label: string
  value: number
  color: string
  description: string
}

export interface RegionData {
  name: string
  level: number
  area: number
  population: number
  coordinates: { x: number; y: number }
  details: string
}

export interface CountryData {
  name: string
  contamination: number
  color: string
}
export interface NavItem {
  title: string
  url: string
}

export interface NavGroup {
  title: string
  url: string // Made required to match NavMain interface
  icon: string // Changed from LucideIcon to string
  isActive?: boolean
  items?: NavItem[]
}

export interface NavigationConfig {
  navGroups?: NavGroup[]
  user?: {
    name: string
    email: string
    avatar: string
  }
}
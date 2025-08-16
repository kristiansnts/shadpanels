import {
  BookOpen,
  Bot,
  Frame,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Star,
  History,
  Settings,
  ChartBar,
  Users,
  FileText,
  Calendar,
  Mail,
} from "lucide-react"
import { LucideIcon } from "lucide-react"

// Icon mapping for converting string names to Lucide components
export const iconMap: Record<string, LucideIcon> = {
  "square-terminal": SquareTerminal,
  "book-open": BookOpen,
  "bot": Bot,
  "frame": Frame,
  "map": Map,
  "pie-chart": PieChart,
  "settings2": Settings2,
  "settings": Settings,
  "star": Star,
  "history": History,
  "chart-bar": ChartBar,
  "users": Users,
  "file-text": FileText,
  "calendar": Calendar,
  "mail": Mail,
}

// Helper function to get icon component from string
export function getIconComponent(iconName: string): LucideIcon {
  return iconMap[iconName] || SquareTerminal // fallback to SquareTerminal
}
import { useTheme as useThemeContext } from "@/contexts/theme-provider";

export function useTheme() {
  return useThemeContext();
}

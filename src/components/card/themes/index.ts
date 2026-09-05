import { theme1 } from "./theme1";
import { theme2 } from "./theme2";
import { theme3 } from "./theme3";
import { theme4 } from "./theme4";

export const themes = {
  theme1,
  theme2,
  theme3,
  theme4
};

export type ThemeName = keyof typeof themes;

export function getTheme(name?: string | null) {
  if (name && name in themes) {
    return themes[name as ThemeName];
  }
  return themes.theme1;
}

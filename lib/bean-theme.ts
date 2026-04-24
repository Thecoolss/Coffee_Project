import { Coffee } from "@/types";

export type BeanTheme = {
  bodyTop: string;
  bodyMid: string;
  bodyBottom: string;
  accent: string;
  crease: string;
  flagPalette: [string, string, string];
};

const roastBody: Record<"light" | "medium" | "dark", [string, string, string]> = {
  light: ["#c78047", "#7f4220", "#46220f"],
  medium: ["#8a4b2a", "#4d2615", "#2c150b"],
  dark: ["#5a2c18", "#2b1208", "#160701"]
};

const flagAccent: Record<string, string> = {
  Ethiopia: "#f2c94c",
  Colombia: "#fcd116",
  Brazil: "#2ecc71",
  Kenya: "#e74c3c",
  Guatemala: "#4a9fd1",
  Indonesia: "#e74c3c",
  "Costa Rica": "#3b6cb2",
  Yemen: "#d94141",
  Rwanda: "#1ba4c4"
};

const flagPalette: Record<string, [string, string, string]> = {
  Ethiopia: ["#078930", "#fcd116", "#da121a"],
  Colombia: ["#fcd116", "#003893", "#ce1126"],
  Brazil: ["#009b3a", "#ffdf00", "#002776"],
  Kenya: ["#000000", "#bb0000", "#006600"],
  Guatemala: ["#4997d0", "#ffffff", "#4997d0"],
  Indonesia: ["#ce1126", "#ffffff", "#ce1126"],
  "Costa Rica": ["#002b7f", "#ce1126", "#ffffff"],
  Yemen: ["#ce1126", "#ffffff", "#000000"],
  Rwanda: ["#00a1de", "#fdd835", "#20603d"]
};

export function beanThemeForCoffee(coffee: Coffee): BeanTheme {
  const [bodyTop, bodyMid, bodyBottom] = roastBody[coffee.roastLevel];
  const accent = flagAccent[coffee.originCountry] ?? "#e8c77d";
  const palette = flagPalette[coffee.originCountry] ?? ["#6d391f", "#e8c77d", "#4d2615"];
  return {
    bodyTop,
    bodyMid,
    bodyBottom,
    accent,
    crease: "#1c1510",
    flagPalette: palette
  };
}

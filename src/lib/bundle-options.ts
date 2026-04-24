export type BundleTheme = "purple" | "blue" | "green" | "orange" | "pink" | "dark";
export type BundleBackgroundStyle = "gradient" | "solid" | "dark";
export type BundleCardStyle = "glass" | "solid" | "outline" | "neon";
export type BundleButtonStyle = "rounded" | "pill" | "square" | "sharp";

type Option<T extends string> = {
    value: T;
    className: string;
    labelKey?: string;
    fallbackLabel?: string;
};

export const DEFAULT_THEME: BundleTheme = "blue";
export const DEFAULT_BACKGROUND_STYLE: BundleBackgroundStyle = "gradient";
export const DEFAULT_CARD_STYLE: BundleCardStyle = "glass";
export const DEFAULT_BUTTON_STYLE: BundleButtonStyle = "rounded";

export const themeOptions: Option<BundleTheme>[] = [
    {
        value: "purple",
        className:
            "w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 border-2 border-transparent hover:scale-110 transition-transform",
    },
    {
        value: "blue",
        className:
            "w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 border-2 border-transparent hover:scale-110 transition-transform",
    },
    {
        value: "green",
        className:
            "w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 border-2 border-transparent hover:scale-110 transition-transform",
    },
    {
        value: "orange",
        className:
            "w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-red-600 border-2 border-transparent hover:scale-110 transition-transform",
    },
    {
        value: "pink",
        className:
            "w-8 h-8 rounded-full bg-gradient-to-br from-pink-600 to-rose-600 border-2 border-transparent hover:scale-110 transition-transform",
    },
    {
        value: "dark",
        className:
            "w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-transparent hover:scale-110 transition-transform",
    },
];

export const backgroundStyleOptions: Option<BundleBackgroundStyle>[] = [
    {
        value: "gradient",
        className:
            "px-3 py-1.5 text-xs rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-2 border-transparent hover:border-white transition-all",
        labelKey: "bg_style_gradient",
        fallbackLabel: "Gradient",
    },
    {
        value: "solid",
        className:
            "px-3 py-1.5 text-xs rounded-lg bg-gray-800 text-gray-300 border-2 border-transparent hover:border-gray-600 transition-all",
        labelKey: "bg_style_solid",
        fallbackLabel: "Solid",
    },
    {
        value: "dark",
        className:
            "px-3 py-1.5 text-xs rounded-lg bg-black text-gray-300 border-2 border-transparent hover:border-gray-600 transition-all",
        labelKey: "bg_style_dark",
        fallbackLabel: "Dark",
    },
];

export const cardStyleOptions: Option<BundleCardStyle>[] = [
    {
        value: "glass",
        className:
            "px-3 py-1.5 text-xs rounded-lg bg-white/10 backdrop-blur text-white border-2 border-white transition-all",
        labelKey: "card_style_glass",
        fallbackLabel: "Glass",
    },
    {
        value: "solid",
        className:
            "px-3 py-1.5 text-xs rounded-lg bg-gray-800 text-gray-300 border-2 border-transparent hover:border-gray-600 transition-all",
        labelKey: "card_style_solid",
        fallbackLabel: "Solid",
    },
    {
        value: "outline",
        className:
            "px-3 py-1.5 text-xs rounded-lg bg-transparent text-gray-300 border-2 border-gray-600 hover:border-white transition-all",
        labelKey: "card_style_outline",
        fallbackLabel: "Outline",
    },
    {
        value: "neon",
        className:
            "px-3 py-1.5 text-xs rounded-lg bg-gray-900 text-cyan-400 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20 transition-all",
        labelKey: "card_style_neon",
        fallbackLabel: "Neon",
    },
];

export const buttonStyleOptions: Option<BundleButtonStyle>[] = [
    {
        value: "rounded",
        className:
            "px-3 py-1.5 text-xs rounded-xl bg-gray-800 text-white border-2 border-white transition-all",
        labelKey: "button_style_rounded",
        fallbackLabel: "Rounded",
    },
    {
        value: "pill",
        className:
            "px-3 py-1.5 text-xs rounded-full bg-gray-800 text-gray-300 border-2 border-transparent hover:border-gray-600 transition-all",
        labelKey: "button_style_pill",
        fallbackLabel: "Pill",
    },
    {
        value: "square",
        className:
            "px-3 py-1.5 text-xs rounded-lg bg-gray-800 text-gray-300 border-2 border-transparent hover:border-gray-600 transition-all",
        labelKey: "button_style_square",
        fallbackLabel: "Square",
    },
    {
        value: "sharp",
        className:
            "px-3 py-1.5 text-xs rounded-none bg-gray-800 text-gray-300 border-2 border-transparent hover:border-gray-600 transition-all",
        labelKey: "button_style_sharp",
        fallbackLabel: "Sharp",
    },
];

export const themeGradients: Record<BundleTheme, string> = {
    purple: "from-cyan-500 to-teal-500",
    blue: "from-blue-600 to-cyan-600",
    green: "from-green-600 to-emerald-600",
    orange: "from-orange-600 to-red-600",
    pink: "from-pink-600 to-rose-600",
    dark: "from-gray-700 to-gray-900",
};

export const cardClassMap: Record<BundleCardStyle, string> = {
    glass: "bg-white/10 backdrop-blur-lg border border-white/20",
    solid: "bg-gray-800 border border-gray-700",
    outline: "bg-transparent border-2 border-gray-600",
    neon: "bg-gray-900/80 border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20",
};

export const buttonClassMap: Record<BundleButtonStyle, string> = {
    rounded: "rounded-xl",
    pill: "rounded-full",
    square: "rounded-lg",
    sharp: "rounded-none",
};

export const getThemeGradient = (theme?: string) =>
    themeGradients[(theme as BundleTheme) || DEFAULT_THEME] || themeGradients[DEFAULT_THEME];

export const getBackgroundClass = (
    bgStyle: string | undefined,
    themeGradient: string,
) => {
    const backgroundMap: Record<BundleBackgroundStyle, string> = {
        gradient: `bg-gradient-to-br ${themeGradient}`,
        solid: "bg-gray-900",
        dark: "bg-black",
    };

    return (
        backgroundMap[(bgStyle as BundleBackgroundStyle) || DEFAULT_BACKGROUND_STYLE] ||
        backgroundMap[DEFAULT_BACKGROUND_STYLE]
    );
};

export const getCardClass = (cardStyle?: string) =>
    cardClassMap[(cardStyle as BundleCardStyle) || DEFAULT_CARD_STYLE] ||
    cardClassMap[DEFAULT_CARD_STYLE];

export const getButtonClass = (buttonStyle?: string) =>
    buttonClassMap[(buttonStyle as BundleButtonStyle) || DEFAULT_BUTTON_STYLE] ||
    buttonClassMap[DEFAULT_BUTTON_STYLE];

import store from "../store"
import {
  THEME_COLOR,
  DARK_MODE,
  GRAY_SCALE,
  BORDER,
  BODY_BACKGROUND,
} from "../constants/ThemeConstant"

export function rgba(hex, opacity = 1) {
  if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    throw new Error("Invalid Hex")
  }

  const decimal = parseInt(hex.substring(1), 16)

  const r = (decimal >> 16) & 255
  const g = (decimal >> 8) & 255
  const b = decimal & 255

  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
const isMobile = window.innerWidth < 768

const theme = store.getState().theme.currentTheme

export const baseTheme = {
  borderRadius: 10,
  colorPrimary: THEME_COLOR.BLUE,
  colorSuccess: THEME_COLOR.CYAN,
  colorWarning: THEME_COLOR.GOLD,
  colorError: THEME_COLOR.VOLCANO,
  colorInfo: THEME_COLOR.BLUE,
  colorText: GRAY_SCALE.GRAY,
  colorBorder: BORDER.BASE_COLOR,
  bodyBg: BODY_BACKGROUND,
  controlHeight: 40,
  controlHeightLG: 48,
  controlHeightSM: 36,
  fontFamily: `'Roboto', 'noto sans georgian', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
      'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
      'Noto Color Emoji'`,
  fontSizeHeading2: 22,
  fontSizeHeading4: 17,
}
const getBaseComponentThemeConfig = ({
  Button = {},
  Notification = {},
  Menu = {},
  Card = {},
  Table = {},
  Select = {},
  DatePicker = {},
  Layout = {},
  Input = {},
  TreeSelect = {},
  Dropdown = {},
  Calendar = {},
} = {}) => {
  return {
    Button: {
      ...Button,
      fontFamily: "Roboto, noto sans georgian",
    },
    Carousel: {
      colorText: "red",
      arrowSize: 20,
      colorBgContainer: theme === "dark" ? "white" : "black",
    },
    InputNumber: {
      fontSize: isMobile ? 18 : 14,
    },
    Alert: {
      colorTextHeading: GRAY_SCALE.GRAY_DARK,
      colorText: "#000000",
      fontFamily: "BPG_Arial",
      colorInfoBg: "#81c7ff",
    },
    Dropdown: {
      controlPaddingHorizontal: 20,
      controlHeight: 37,
      borderRadiusLG: 10,
      paddingXXS: "4px 0px",
      ...Dropdown,
    },
    Calendar: {
      ...Calendar,
    },
    Checkbox: {
      lineWidth: 2,
      borderRadiusSM: 4,
    },
    Card: {
      colorTextHeading: GRAY_SCALE.GRAY_DARK,
      paddingLG: 20,
      ...Card,
    },
    Layout: {
      bodyBg: BODY_BACKGROUND,
      headerBg: GRAY_SCALE.WHITE,
      fontFamily: "Roboto, noto sans georgian",
      ...Layout,
    },
    Breadcrumb: {
      colorTextDescription: GRAY_SCALE.GRAY_LIGHT,
      colorText: baseTheme.colorPrimary,
      fontFamily: "Roboto, noto sans georgian",
      colorBgTextHover: "transparent",
    },
    Menu: {
      itemBg: "transparent",
      colorActiveBarHeight: 0,
      activeBarWidth: 3,
      horizontalItemSelectedColor: baseTheme.colorPrimary,
      itemHoverColor: baseTheme.colorPrimary,
      itemSelectedColor: baseTheme.colorPrimary,
      itemSelectedBg: rgba(baseTheme.colorPrimary, 0.1),
      itemHoverBg: "transparent",
      radiusItem: 0,
      subMenuItemBg: "transparent",
      fontFamily: "Roboto, noto sans georgian",
      itemMarginInline: 0,
      controlHeightLG: 40,
      controlHeightSM: 22,
      ...Menu,
    },
    Notification: {
      fontFamily: "Roboto, noto sans georgian",
      colorError: "red",
      fontSize: 24,
      ...Notification,
    },
    Input: {
      ...Input,
      inputFontSize: isMobile ? 18 : 14,
    },

    Steps: {
      wireframe: true,
      controlHeight: 32,
      waitIconColor: GRAY_SCALE.GRAY_LIGHT,
    },
    DatePicker: {
      fontSize: isMobile ? 18 : 14,
      controlHeight: 40,
      controlHeightSM: 26,
      borderRadiusSM: 6,
      lineWidthBold: 0,
      ...DatePicker,
    },
    Radio: {
      fontSizeLG: 18,
    },
    Slider: {
      colorPrimaryBorder: rgba(baseTheme.colorPrimary, 0.8),
      colorPrimaryBorderHover: baseTheme.colorPrimary,
    },
    Select: {
      paddingXXS: "4px 10px",
      controlHeight: 40,
      controlHeightSM: 30,
      fontSize: isMobile ? 18 : 14,
      controlItemBgActive: rgba(baseTheme.colorPrimary, 0.1),
      ...Select,
    },
    TreeSelect: {
      ...TreeSelect,
      controlHeightSM: 28,
      nodeSelectedBg: "#EBF1FE",
    },
    Tooltip: {
      colorBgSpotlight: rgba(GRAY_SCALE.DARK, 0.75),
      controlHeight: 32,
    },
    Timeline: {
      lineType: "dashed",
    },
    Tag: {
      lineHeight: 2.1,
    },
    Table: {
      colorText: GRAY_SCALE.GRAY,
      tableHeaderBg: "transparent",
      fontFamily: "Roboto, noto sans georgian",
      ...Table,
    },
  }
}

export const lightTheme = {
  token: {
    ...baseTheme,
    colorTextBase: GRAY_SCALE.GRAY,
  },
  components: getBaseComponentThemeConfig(),
}

export const darkTheme = {
  token: {
    ...baseTheme,
    colorTextBase: DARK_MODE.TEXT_COLOR,
    colorBgBase: DARK_MODE.BG_COLOR,
    colorBorder: DARK_MODE.BORDER_BASE_COLOR,
    colorText: DARK_MODE.TEXT_COLOR,
  },
  components: getBaseComponentThemeConfig({
    Button: {
      controlOutline: "transparent",
      colorBorder: DARK_MODE.BORDER_BASE_COLOR,
      colorText: DARK_MODE.TEXT_COLOR,
    },
    TreeSelect: {
      nodeSelectedBg: "#1e2c45",
    },
    Card: {
      colorTextHeading: DARK_MODE.HEADING_COLOR,
    },
    Layout: {
      bodyBg: "#1b2531",
      headerBg: DARK_MODE.BG_COLOR,
    },
    Menu: {
      itemSelectedBg: "transparent",
      horizontalItemSelectedColor: GRAY_SCALE.WHITE,
      itemHoverColor: GRAY_SCALE.WHITE,
      itemSelectedColor: GRAY_SCALE.WHITE,
      itemColor: DARK_MODE.TEXT_COLOR,
      activeBarWidth: 0,
      boxShadowSecondary: DARK_MODE.DROP_DOWN_SHADOW,
    },
    Dropdown: {
      boxShadowSecondary: DARK_MODE.DROP_DOWN_SHADOW,
    },
    Calendar: {
      controlItemBgActive: "#303a4e",
    },
    Select: {
      controlOutline: "transparent",
      controlItemBgActive: DARK_MODE.ACTIVE_BG_COLOR,
      controlItemBgHover: DARK_MODE.HOVER_BG_COLOR,
      boxShadowSecondary: DARK_MODE.DROP_DOWN_SHADOW,
    },
    Input: {
      controlOutline: "transparent",
    },
    App: {
      fontFamily: "Roboto, noto sans georgian",
    },
    DatePicker: {
      controlOutline: "transparent",
      boxShadowSecondary: DARK_MODE.DROP_DOWN_SHADOW,
      controlItemBgActive: DARK_MODE.ACTIVE_BG_COLOR,
      controlItemBgHover: DARK_MODE.HOVER_BG_COLOR,
      inputFontSize: isMobile ? 18 : 14,
    },
    Table: {
      colorText: DARK_MODE.TEXT_COLOR,
      colorTextHeading: DARK_MODE.HEADING_COLOR,
      rowSelectedBg: "#1c2639",
      rowSelectedHoverBg: "#324e83",
    },
  }),
}

import {
  DashboardOutlined,
  ProductOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons"

const dashBoardNavTree = [
  {
    key: "dashboards-default",
    path: `/home`,
    title: "sidenav.dashboard.default",
    icon: DashboardOutlined,
    breadcrumb: false,
    user_type: [1],
    disabled: false,
    submenu: [],
  },
]

const users = [
  {
    key: "products",
    path: `/products`,
    title: "sidenav.products",
    icon: ProductOutlined,
    breadcrumb: false,
    user_type: [1,2],
    disabled: false,
    submenu: [
      {
        key: "products_default",
        path: `/products`,
        title: "sidenav.products",
        icon: ProductOutlined,
        breadcrumb: false,
        user_type: [1,2],
        disabled: false,
        submenu: [],
      },
      {
        key: "products_category",
        path: `/category`,
        title: "sidenav.products.category",
        icon: ProductOutlined,
        breadcrumb: false,
        user_type: [1,2],
        disabled: false,
        submenu: [],
      },
    ],
  },

  {
    key: "clients",
    path: `/clients`,
    title: "sidenav.clients",
    icon: UserOutlined,
    breadcrumb: false,
    user_type: [1],
    disabled: false,
    submenu: [],
  },
  {
    key: "settings",
    path: `/settings`,
    title: "sidenav.settings",
    icon: SettingOutlined,
    breadcrumb: false,
    user_type: [1,2],
    disabled: false,
    submenu: [],
  },
]

const navigationConfig = [...dashBoardNavTree, ...users]

export const getNavigationConfig = (type) => {
  return navigationConfig.filter((item) => item.user_type.includes(type))
}

export default navigationConfig

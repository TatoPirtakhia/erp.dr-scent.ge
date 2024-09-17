import { SIDE_NAV_LIGHT, NAV_TYPE_SIDE, DIR_LTR } from '../constants/ThemeConstant';

export const APP_NAME = 'Dr. Scent';
export const APP_PREFIX_PATH = '/app';
export const AUTH_PREFIX_PATH = '/auth';
export const REDIRECT_URL_KEY = 'redirect'
export const AUTHENTICATED_ENTRY = `${APP_PREFIX_PATH}/dashboards/default`;
export const UNAUTHENTICATED_ENTRY = '/login'
const language = localStorage.getItem("language") || "en"
const theme = localStorage.getItem("theme") || "light"
export const THEME_CONFIG = {
	navCollapsed: false,
	sideNavTheme: SIDE_NAV_LIGHT,
	locale: language,
	navType: NAV_TYPE_SIDE,
	topNavColor: '#3e82f7',
	headerNavColor: '',
	mobileNav: false,
	currentTheme: theme,
	direction: DIR_LTR,
	blankLayout: false
};
// hello 

import React, { lazy, Suspense, memo, useContext } from 'react'
import { useSelector } from 'react-redux';
import { ConfigProvider, Modal } from 'antd';
import Loading from '../components/shared-components/Loading';
import { lightTheme, darkTheme } from '../configs/ThemeConfig';
import { resources } from '../lang';
import useBodyClass from '../utils/hooks/useBodyClass';
import Routes from '../routes'
import { MessageBoxContext } from '../context/MessageBoxContext';

const AppLayout = lazy(() => import('./AppLayout'));
const AuthLayout = lazy(() => import('./AuthLayout'));


const Layouts = () => {
	const { messageBoxState, close } = useContext(MessageBoxContext)

	const token = useSelector(state => state.auth.token);
	const blankLayout = useSelector(state => state.theme.blankLayout);

	const Layout = token && !blankLayout ? AppLayout : AuthLayout;

	const locale = useSelector(state => state.theme.locale);

	const direction = useSelector(state => state.theme.direction);

	const currentTheme = useSelector(state => state.theme.currentTheme);

	const currentAppLocale = resources[locale];

	useBodyClass(`dir-${direction}`);

	const themeConfig = currentTheme === 'light' ? { ...lightTheme } : { ...darkTheme }
	return (
		<ConfigProvider theme={themeConfig} direction={direction} >
			<Suspense fallback={<Loading cover="content" />}>
				<Layout>
					<Routes />
					<Modal
						title={messageBoxState.title}
						okText={messageBoxState.okText}
						cancelText={messageBoxState.cancelText}
						open={messageBoxState.isOpen}
						onOk={() => messageBoxState.okFunction()}
						onCancel={() => close()}
					>
						{messageBoxState.text}
					</Modal>
				</Layout>
			</Suspense>
		</ConfigProvider>
	)
}

export default memo(Layouts)
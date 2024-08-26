/** @jsxImportSource @emotion/react */
import { CheckOutlined, GlobalOutlined, DownOutlined  } from '@ant-design/icons';
import { Menu, Dropdown } from 'antd';
import NavItem from './NavItem'
import lang from '../../assets/data/language.data.json';
import { useSelector, useDispatch } from 'react-redux';
import { onLocaleChange } from '../../store/slices/themeSlice';
import i18n from 'i18next'
import { SPACER } from '../../constants/ThemeConstant';
import { baseTheme } from '../../configs/ThemeConfig';
import Flex from "../../components/shared-components/Flex";
import { css } from '@emotion/react';
import Translate from '../../translate/tr_component';

function getLanguageDetail (locale) {
	const data = lang.filter(elm => (elm.langId === locale))
	return data[0]
}

const SelectedLanguage = () => {

	const locale = useSelector(state => state.theme.locale)

	const language = getLanguageDetail(locale);
	const {langName, icon} = language;

	return (
		<Flex alignItems="center">
			<img style={{maxWidth: '20px'}} src={`/img/flags/${icon}.png`} alt={langName}/>
			<span className="font-weight-semibold ml-2">{langName} <DownOutlined className="font-size-xs"/></span>
		</Flex>
	)
}


const MenuItem = (props) => {
	const locale = useSelector(state => state.theme.locale);

	const dispatch = useDispatch();

	const handleLocaleChange = (langId) => {
		dispatch(onLocaleChange(langId))
		localStorage.setItem("language", props.langId)
		i18n.changeLanguage(langId)
	}

	return (
		<span>
			<Flex 
				alignItems="center" 
				justifyContent="space-between"
				gap={SPACER[4]}
				onClick={() => handleLocaleChange(props.langId)}
			>
				<Flex alignItems="center" gap={SPACER[2]}>
					<img style={{maxWidth: '20px'}} src={`/img/flags/${props.icon}.png`} alt={props.langName}/>
					<span className="font-weight-normal ml-2">{<Translate id={props.langName} />}</span>
				</Flex>
				{locale === props.langId ? <CheckOutlined css={css`color: ${baseTheme.colorSuccess}`} /> : null}
			</Flex>
		</span>
	)
}

const items = [
	{
		key: 'En',
		label: <MenuItem icon="us" langName="language_en" langId="en" />
	},
	{
		key: 'GE',
		label: <MenuItem icon="ge" langName="language_ge" langId="ka" />
	},
	
];


export const NavLanguage = ({ configDisplay, mode }) => {

	return (
		<Dropdown placement="bottomRight" menu={{items}} trigger={["click"]}>
			{
				configDisplay ?
				(
					<a href="#/" className="text-gray" onClick={e => e.preventDefault()}>
						<SelectedLanguage />
					</a>
				)
				:
				(
					<NavItem mode={mode}>
						<GlobalOutlined className="nav-icon mr-0" />
					</NavItem>
				)
			}
		</Dropdown>
	)
}

export default NavLanguage;

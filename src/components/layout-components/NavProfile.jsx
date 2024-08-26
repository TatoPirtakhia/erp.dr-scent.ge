import React from 'react';
import { Dropdown, Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux'
import { 
	LogoutOutlined ,
	UserOutlined
} from '@ant-design/icons';
import NavItem from './NavItem';
import Flex from '../../components/shared-components/Flex';
import { signOut } from '../../store/slices/authSlice';
import styled from '@emotion/styled';
import { FONT_WEIGHT, MEDIA_QUERIES, SPACER, FONT_SIZES } from '../../constants/ThemeConstant'
import Translate from '../../translate/tr_component';

const Icon = styled.div(() => ({
	fontSize: FONT_SIZES.LG
}))

const Profile = styled.div(() => ({
	display: 'flex',
	alignItems: 'center'
}))

const UserInfo = styled('div')`
	padding-left: ${SPACER[2]};

	@media ${MEDIA_QUERIES.MOBILE} {
		display: none
	}
`

const Name = styled.div(() => ({
	maxWidth: "150px",
	overflow: "hidden",
	textOverflow: "ellipsis",
	whiteSpace: "nowrap",
	fontWeight: FONT_WEIGHT.SEMIBOLD
}))

const Title = styled.span(() => ({
	opacity: 0.8
}))

// const MenuItem = (props) => (
// 	<Flex as="a" href={props.path} alignItems="center" gap={SPACER[2]}>
// 		<Icon>{props.icon}</Icon>
// 		<span>{props.label}</span>
// 	</Flex>
// )

const MenuItemSignOut = (props) => {

	const dispatch = useDispatch();

	const handleSignOut = () => {
		dispatch(signOut())
	}

	return (
		<div onClick={handleSignOut}>
			<Flex alignItems="center" gap={SPACER[2]} >
				<Icon>
					<LogoutOutlined />
				</Icon>
				<span>{props.label}</span>
			</Flex>
		</div>
	)
}

const items = [
	{
		key: 'Sign Out',
		label: <MenuItemSignOut label={<Translate id="sign_out" />} />,
	}
]

export const NavProfile = ({mode}) => {
	const user = useSelector(state => state.auth.user)
	
	return (
		<Dropdown placement="bottomRight" menu={{items}} trigger={["click"]}>
			<NavItem mode={mode}>
				<Profile>
					<Avatar src={user?.image} icon={<UserOutlined />}  />
					<UserInfo className="profile-text">
						<Name>{user?.first_name} {user?.last_name}</Name>
					</UserInfo>
				</Profile>
			</NavItem>
		</Dropdown>
	);
}

export default NavProfile

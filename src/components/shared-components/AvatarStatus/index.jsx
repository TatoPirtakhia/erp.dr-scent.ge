import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';

const renderAvatar = (props) => {
	return !props.src ? (
		<Avatar icon={props.icon} />
	) : (
		<Avatar {...props} className={`ant-avatar-${props.type}`}>
			USER
		</Avatar>
	);
};

const AvatarStatus = (props) => {
	const { first_name, brand_name, subTitle, id, type, src, icon, size, shape, gap, text, onNameClick } = props;
	return (
		<div className="avatar-status d-flex align-items-center gap-1">
			<div >
				{renderAvatar({ icon, src, type, size, shape, gap, text })}
			</div>
			<div className="ml-2">
				<div className='text-left '>
					{onNameClick ? (
						<div onClick={() => onNameClick({ first_name, subTitle, src, id })} className="avatar-status-name  clickable" style={{ cursor: "pointer", textAlign: "left" }}>
							{brand_name ?
								<>
									<span className='text-[18px] font-bold'>{brand_name}</span>
									<br />
								</> : null
							}

							{first_name}
						</div>
					) : (
						<div className="avatar-status-name">
							{`${first_name}`}
							{brand_name ? `(${brand_name})` : ''}
						</div>
					)}
				</div>
				<div className="text-muted avatar-status-subtitle " style={{ textAlign: "left" }}>{subTitle}</div>
			</div>
		</div>
	);
};

AvatarStatus.propTypes = {
	first_name: PropTypes.string,
	brand_name: PropTypes.string,
	src: PropTypes.string,
	type: PropTypes.string,
	id: PropTypes.number,
	onNameClick: PropTypes.func,
};

export default AvatarStatus;

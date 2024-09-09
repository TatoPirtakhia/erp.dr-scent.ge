import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Avatar } from 'antd';
import { Icon } from '../../components/util-components/Icon'
import { employementList, groupList } from './profileData';
import {
    UserOutlined,
    MailOutlined,
    HomeOutlined,
    PhoneOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import AvatarStatus from '../../components/shared-components/AvatarStatus';
import PageHeaderAlt from '../../components/layout-components/PageHeaderAlt'
import Flex from '../../components/shared-components/Flex'
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getUserData } from '../../store/slices/UsersSlice';
import { getTranslation } from '../../lang/translationUtils';

const ProfileInfo = ({ avatarSize, user }) => {
    return (
        <Card>
            <Row justify="center">
                <Col sm={24} md={23}>
                    <div className="d-md-flex">
                        <div className="rounded p-2 bg-white shadow-sm mx-auto" style={{ 'marginTop': '-3.5rem', 'maxWidth': `${avatarSize + 16}px` }} >
                            <Avatar shape="square" size={avatarSize} icon={<UserOutlined />} />
                        </div>
                        <div className="ml-md-4 w-100">
                            <Flex alignItems="center" mobileFlex={false} className="mb-3 text-md-left text-center">
                                <h2 className="mb-0 mt-md-0 mt-2">{user.first_name}</h2>
                            </Flex>
                            <Row>
                                <Col xs={24} sm={12} md={8}>
                                    <Row className="mb-2">
                                        <Col xs={12} sm={12} md={6}>
                                            <div className='flex items-center gap-2'>
                                                <Icon type={MailOutlined} className="text-primary font-size-md" />
                                                <span className="font-weight-semibold">{user.email}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col xs={12} sm={12} md={6}>
                                            <div className='flex items-center gap-2'>
                                                <Icon type={PhoneOutlined} className="text-primary font-size-md" />
                                                <span className="font-weight-semibold">{user.phone1}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={24} sm={12} md={8}>
                                    <Row className="mb-2">
                                        <Col xs={12} sm={12} md={9}>
                                            <div className='flex items-center gap-2'>
                                                <Icon type={EnvironmentOutlined} className="text-primary font-size-md" />
                                                <span className="font-weight-semibold">{user.address}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col xs={12} sm={12} md={9}>
                                            <div className='flex items-center gap-2'>
                                                <Icon type={HomeOutlined} className="text-primary font-size-md" />
                                                <span className="font-weight-semibold">{user.address}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    )
}

const WorkHistory = () => (
    <Card title="Last Work">
        <div className="mb-3">
            <Row>
                <Col sm={24} md={22}>
                    {employementList.map((elm, i) => {
                        return (
                            <div className={`${i === (employementList.length - 1) ? '' : 'mb-4'}`} key={`eduction-${i}`}>
                                <AvatarStatus src={elm.img} first_name={elm.title} subTitle={elm.duration} />
                                <p className="pl-5 mt-2 mb-0">{elm.desc}</p>
                            </div>
                        )
                    })}
                </Col>
            </Row>
        </div>
    </Card>
)

const Connection = ({ connectedUsers }) => (
    <Card title={getTranslation("admin.profile.clients")}>
        {
            connectedUsers.map((elm, i) => {
                return (
                    <div className={`${i === (connectedUsers.length - 1) ? '' : 'mb-4'}`} key={`connection-${i}`}>
                        <AvatarStatus
                            id={elm.id}
                            src={elm.image ? elm.image : ''}
                            icon={<UserOutlined />}
                            first_name={elm.first_name}
                            subTitle={elm.email}
                        />
                    </div>
                )
            })
        }
    </Card>
)

const Group = () => (
    <Card title="Group">
        {
            groupList.map((elm, i) => {
                return (
                    <div className={`${i === (groupList.length - 1) ? '' : 'mb-4'}`} key={`connection-${i}`}>
                        <AvatarStatus src={elm.img} name={elm.name} subTitle={elm.desc} />
                    </div>
                )
            })
        }
    </Card>
)

const Profile = () => {
    const [user, setUser] = useState({});
    const [connectedUsers, setConnectedUsers] = useState([]);
    const avatarSize = 150;
    let { id } = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getUserData(id)).then((res) => {
            if (!res.error) {
                setUser(res.payload.user)
                setConnectedUsers(res.payload.connectedUsersRes)
            }
        })
    }, [])

    return (
        <>
            <PageHeaderAlt background="/img/others/img-12.jpg" cssClass="bg-primary" overlap>
                <div className="container text-center">
                    <div className="py-5 my-md-5">
                    </div>
                </div>
            </PageHeaderAlt>
            <div className="container my-4">
                <ProfileInfo avatarSize={avatarSize} user={user} />
                <Row gutter="16">
                    <Col xs={24} sm={24} md={8}>
                        {connectedUsers &&  <Connection connectedUsers={connectedUsers} />}
                    </Col>
                    <Col xs={24} sm={24} md={16}>
                        <WorkHistory />
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Profile

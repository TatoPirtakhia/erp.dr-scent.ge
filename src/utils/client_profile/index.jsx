import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Avatar, Table, Grid, Button, Image } from 'antd';
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
import { useDispatch, useSelector } from 'react-redux';
import { getClientData, getUserData } from '../../store/slices/UsersSlice';
import { getTranslation } from '../../lang/translationUtils';
import { API_BASE_URL } from '../../constants/ApiConstant';
import utils from '../../utils'
import MapBox from '../../Maps';
const { useBreakpoint } = Grid
const ProfileInfo = ({ avatarSize, user }) => {
    const theme = useSelector(state => state.theme.currentTheme);
    return (
        <Card>
            <Row justify="center">
                <Col sm={24} md={23}>
                    <div className="d-md-flex">
                        <div className="rounded p-2 bg-white shadow-sm mx-auto" style={{ 'marginTop': '-3.5rem', 'maxWidth': `${avatarSize + 16}px` }} >
                            {!user.image ? <Avatar shape="square" size={avatarSize} icon={<UserOutlined />} /> :
                                <Image
                                    shape="square"
                                    size={avatarSize}
                                    height={150}

                                    icon={<UserOutlined />}
                                    src={`${API_BASE_URL}images/clients/images/user_${user.id}/${user.image}`}
                                />
                            }
                        </div>
                        <div className="ml-md-4 w-100">
                            <Flex alignItems="center" mobileFlex={false} className="mb-3 text-md-left text-center">
                                <h2 className="mb-0 mt-md-0 mt-2">{user.brand_name ? user.brand_name : user.first_name}</h2>
                            </Flex>
                            <Row>
                                <Col xs={24} sm={12} md={8}>
                                    <Row className="mb-2">
                                        <Col xs={24} sm={12} md={24}>
                                            <div className='flex items-center gap-2'>
                                                <Icon type={UserOutlined} className="text-primary font-size-md" />
                                                <span className="font-weight-semibold">{user.first_name}</span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col xs={12} sm={12} md={6}>
                                            <div className='flex items-center gap-2'>
                                                <Icon type={MailOutlined} className="text-primary font-size-md" />
                                                <span className="font-weight-semibold "><a className={`${theme === 'dark' ? 'text-[#b4bed2]' : 'text-[#455560]'}`} href={`mailto:${user.email}`}>{user.email}</a> </span>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={24} sm={12} md={8}>
                                    <Row className="mb-2">
                                        <Col xs={12} sm={12} md={6}>
                                            <div className='flex items-center gap-2'>
                                                <Icon type={PhoneOutlined} className="text-primary font-size-md" />
                                                <span className="font-weight-semibold">
                                                    <a className={`${theme === 'dark' ? 'text-[#b4bed2]' : 'text-[#455560]'}`} href={`tel:${user.phone1}`}>
                                                        {user.phone1}
                                                    </a>
                                                </span>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-2">
                                        <Col xs={12} sm={12} md={6}>
                                            <div className='flex items-center gap-2'>
                                                <Icon type={PhoneOutlined} className="text-primary font-size-md" />
                                                <span className="font-weight-semibold">{user.phone2 ? <a className={`${theme === 'dark' ? 'text-[#b4bed2]' : 'text-[#455560]'}`} href={`tel:${user.phone2}`}>
                                                    {user.phone2}
                                                </a>
                                                    : '-'}</span>
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
const Branches = ({ branches }) => {
    const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');
    const [LocationVisible, setLocationVisible] = useState(false)
    const [markersData, setMarkersData] = useState([])
    const [coordinate, setCoordinate] = useState({});
    const onViewLocation = (data) => {
        setLocationVisible(true)
        setMarkersData([{
            brand_name: data.brand_name,
            city: data.city_name,
            state: data.state_name,
            address: data.address,
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude),
            images: []
        }])
        setCoordinate({
            latitude: parseFloat(data.latitude),
            longitude: parseFloat(data.longitude)
        })
    }
    const columns = [
        {
            title: getTranslation('sidenav.client.state'),
            dataIndex: 'state_name',
            key: 'state_name',
        },
        {
            title: getTranslation('sidenav.client.city'),
            dataIndex: 'city_name',
            key: 'city_name',
        },
        {
            title: getTranslation('sidenav.client.Address'),
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: getTranslation('sidenav.client.location'),
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => (
                <Button disabled={!record.latitude || !record.longitude} icon={<EnvironmentOutlined />} onClick={() => onViewLocation(record)} />
            ),
        }
    ];

    return (
        <Card title={getTranslation("sidenav.admins.branch_address")}>
            {isMobile ? (
                <Row gutter={[16, 16]}>
                    <div className='w-full overflow-auto max-h-[400px] history'>

                        {branches && branches.map((branch) => (
                            <Col xs={24} key={branch.id}>
                                <Card
                                    extra={
                                        <div>
                                            <Button disabled={!branch.latitude || !branch.longitude} icon={<EnvironmentOutlined />} onClick={() => onViewLocation(branch)} />
                                        </div>}
                                >
                                    <p className='-mt-12'><strong>{getTranslation("sidenav.client.state")}:</strong> {branch.state_name}</p>
                                    <p><strong>{getTranslation("sidenav.client.city")}:</strong> {branch.city_name}</p>
                                    <p><strong>{getTranslation("sidenav.client.Address")}:</strong> {branch.address}</p>
                                </Card>
                            </Col>
                        ))}
                    </div>
                </Row>
            ) : (
                <Table
                    columns={columns}
                    dataSource={branches}
                    rowKey={(record) => record.id}
                    pagination={false}
                />
            )}

            {!LocationVisible ? null : (
                <MapBox
                    data={markersData}
                    latitude={coordinate.latitude}
                    longitude={coordinate.longitude}
                    visible={LocationVisible}
                    enableNewPin={false}
                    close={() => setLocationVisible(false)}
                    onSubmit={() => { }}
                />
            )}


        </Card>
    );
};


const Connection = ({ connectedUsers }) => (
    <Card title={getTranslation("client.profile.admins")}>
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
        dispatch(getClientData(id)).then((res) => {
            if (!res.error) {
                setUser(res.payload.user)
                setConnectedUsers(res.payload.connectedUsers)
            }
        })
        setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
        }, 100);
    }, [])

    return (
        <>
            <PageHeaderAlt background="/img/others/img-12.jpg" cssClass="bg-primary" overlap >
                <div className="container text-center">
                    <div className="py-5 my-md-5">
                    </div>
                </div>
            </PageHeaderAlt>
            <div className="container my-4">
                <ProfileInfo avatarSize={avatarSize} user={user} />
                <Row gutter="16">
                    <Col xs={24} sm={24} md={8}>
                        {connectedUsers && <Connection connectedUsers={connectedUsers} />}
                    </Col>
                    <Col xs={24} sm={24} md={16}>
                        <Branches branches={user.expandableData} />
                    </Col>
                    <Col xs={24} sm={24} md={24}>
                        <WorkHistory />
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default Profile

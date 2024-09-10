import React from 'react';
import { Card, Button, Avatar, Dropdown } from 'antd';
import moment from 'moment';
import 'moment-timezone';
import dayjs from 'dayjs';
import { getTranslation } from "../../../../lang/translationUtils";
import {
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
    UserOutlined,
    UserAddOutlined,
    AimOutlined,
    EllipsisOutlined,
    EnvironmentOutlined,
    BankOutlined,
} from "@ant-design/icons";
import AvatarStatus from '../../../../components/shared-components/AvatarStatus';
import { useNavigate } from 'react-router-dom';
import Meta from 'antd/es/card/Meta';
import { API_BASE_URL } from '../../../../constants/ApiConstant';
import { useSelector } from 'react-redux';

const CardDropdown = ({ items }) => {

    return (
        <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <a href="/#" className="text-gray font-size-lg" onClick={e => e.preventDefault()}>
                <EllipsisOutlined style={{ fontSize: 28, color: "white" }} />
            </a>
        </Dropdown>
    )
}

const ClientCard = ({ client, onEdit, onAddBranch, onAddressShow, onShowAllPinsOnMap, localeDate, settings }) => {
    const navigate = useNavigate()
    const user = useSelector(state => state.auth.user)
    const importExport = [

        {
            key: '1',
            label: getTranslation("sidenav.client.Edit"),
            onClick: () => onEdit(client),
            icon: <EditOutlined />,
        },
        {
            key: '2',
            label: getTranslation("sidenav.client.add_new_branch"),
            onClick: () => onAddBranch(client),
            icon: <EnvironmentOutlined />,
        },
    ]

    return (
        <Card
            title={client.brand_name ? client.brand_name : client.first_name}
            className="client-card"
            style={{ marginBottom: 16 }}
            extra={<CardDropdown items={importExport} />} >
            <AvatarStatus
                id={client.id}
                src={client.image ? `${API_BASE_URL}images/clients/images/user_${client.id}/${client.image}` : ''}
                first_name={client.first_name}
                subTitle={client.email}
                icon={<UserOutlined />}
                onNameClick={() => {
                    navigate(`/clientProfile/${client.id}`)
                }}
            />
            <p className='mb-0 mt-2'>
                <strong>
                    {getTranslation("sidenav.client.identifierNumber")}: {" "}
                </strong>  {client.personal_id}
            </p>
            <p className='mb-0'>
                <strong>
                    {getTranslation("sidenav.client.tableCreatedAt")}: {" "}
                </strong>
                {dayjs(client.create_date).locale(localeDate).format(settings?.date_format)}
            </p>
            <p className='mb-0'>
                <strong>
                    {getTranslation("sidenav.client.phone")}: {" "}
                </strong>
                <a href={`tel:${client.phone1}`}>
                    {client.phone1}
                </a>
            </p>
            {client.phone2 ? (
                <p className='mb-0'>
                    <strong>
                        {getTranslation("sidenav.client.mobile")}: {" "}
                    </strong>
                    <a href={`tel:${client.phone2}`}>
                        {client.phone2}
                    </a>
                </p>
            ) : null}
            {client.salesman.id !== user.id &&client.salesman.id ? (<p className='mb-2'>
                <strong>
                    {getTranslation("sidenav.admins.salesman")}: {" "}
                </strong>
                {client.salesman.first_name}
            </p>
            ) : null}

            {client.note ? <Meta className='mt-2' title={getTranslation("sidenav.admins.note")} description={client.note} /> : null}
            <div className='flex flex-col gap-3'>
                <Button className='mt-3' icon={<BankOutlined />} onClick={() => onAddressShow(client)}>{getTranslation("sidenav.admins.branch_address")}</Button>
                <Button className='' icon={<EnvironmentOutlined />} onClick={() => onShowAllPinsOnMap(client.expandableData)}>{getTranslation("sidenav.admins.branches_on_map")}</Button>
            </div>
        </Card>
    );
};

export default ClientCard;

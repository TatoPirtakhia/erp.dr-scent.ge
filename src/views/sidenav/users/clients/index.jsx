import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  Table,
  message,
  Button,
  Switch,
  Input,
  App,
  Pagination,
  Empty,
  Grid,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
  UserAddOutlined,
  AimOutlined,
  BankOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import AvatarStatus from "../../../../components/shared-components/AvatarStatus";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import "moment-timezone";
import { API_BASE_URL } from "../../../../constants/ApiConstant";
import Flex from "../../../../components/shared-components/Flex";
import Utils from "../../../../utils/index";
import { MessageBoxContext } from "../../../../context/MessageBoxContext";
import { useContext } from "react";
import ShowInfo from "../../../../utils/show_user_info";
import { useNavigate } from "react-router-dom";
import CustomHelmet from "../../../../utils/customHelmet";
import {
  changeActive,
  delete_Branch,
  getAllClient,
  verifyEmailManual,
} from "../../../../store/slices/UsersSlice";
import AddUser from "./add_user";
import { getTranslation } from "../../../../lang/translationUtils";
import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown";
import EditUser from "./edit_user";
import "dayjs/locale/ka";
import dayjs from "dayjs";
import MapBox from "../../../../Maps";
import NewBranch from "./new_branch";
import EditBranch from "./edit_branch";
import utils from "../../../../utils";
import ClientCard from "./clientCard";
import AddressList from "./list_of_address";
import ClientFilter from "../../../../utils/clientFilter";
import { getCompanyType } from "../../../../store/slices/companyTypeSlice";
import { getRegions } from "../../../../store/slices/CountrySlice";
const { useBreakpoint } = Grid;
const ClientsList = () => {
  const isMobile = !utils.getBreakPoint(useBreakpoint()).includes("lg");
  const settings = useSelector((state) => state.systemInfo.settings);
  const localeDate = useSelector((state) => state.theme.locale);
  const { notification } = App.useApp();
  const [users, setUsers] = useState([]);
  const { mb } = useContext(MessageBoxContext);
  const [mainLocation, setMainLocation] = useState({});
  const [coordinate, setCoordinate] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [userProfileVisible, setUserProfileVisible] = useState(false);
  const [branchProfileVisible, setBranchProfileVisible] = useState(false);
  const [addUserProfileVisible, setAddUserProfileVisible] = useState(false);
  const [newBranch, setNewBranch] = useState(false);

  const [LocationVisible, setLocationVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [usersLength, setUsersLength] = useState(0);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [statesOptions, setStatesOptions] = useState([]);
  const [companyTypeOptions, setCompanyTypeOptions] = useState([]);

  const [setMobileAddressOpen, setSetMobileAddressOpen] = useState(false);
  const [expandableData, setExpandableData] = useState([]);
  const [clientId, setClientId] = useState(null);

  const [markersData, setMarkersData] = useState([]);

  const dispatch = useDispatch();

  const [filterData, setFilterData] = useState({
    search: "",
    page: 1,
    pageSize: 10,
    state_id: null,
    company_type_id: null,
  });

  useEffect(() => {
    dispatch(getAllClient(filterData)).then((response) => {
      setUsers(response.payload.data);
      setUsersLength(response.payload.totalCount);
    });
  }, [filterData]);

  const deleteUser = async (user) => {
    try {
      dispatch(deleteClient(user.id)).then((response) => {
        if (!response.error) {
          setUsers(users.filter((data) => data.id !== user.id));
          notification.success({
            message: "sidenav.client.Deleted!",
            description: `sidenav.client.DeletedUser ${user.first_name}`,
          });
        }
      });
    } catch (error) {
      message.error({ content: error.response.data.message, duration: 3 });
    }
  };
  const deleteBranch = async (data) => {
    try {
      dispatch(delete_Branch(data.id)).then((response) => {
        if (!response.error) {
          setUsers((prev) =>
            prev.map((elm) => ({
              ...elm,
              expandableData: elm.expandableData.filter(
                (item) => item.id !== data.id
              ),
            }))
          );
          notification.success({
            message: getTranslation("Done!"),
            description: getTranslation(response.payload.message),
          });
        }
      });
    } catch (error) {
      message.error({ content: error.response.data.message, duration: 3 });
    }
  };
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMainLocation({
            latitude,
            longitude,
          });
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    dispatch(getCompanyType()).then((res) => {
      if (!res.error) {
        setCompanyTypeOptions(
          res.payload.map((elm) => ({
            data: elm,
            label: elm.name,
            value: elm.id,
          }))
        );
      }
    });

    dispatch(getRegions()).then((response) => {
      if (!response.error) {
        setStatesOptions(
          response.payload.states.map((elm) => ({
            value: elm.id,
            data: elm,
            label: (
              <Flex gap={5} alignItems="center">
                {`${elm.name}`}
              </Flex>
            ),
          }))
        );
      }
    });
  }, []);

  const sendLink = async (data) => {
    try {
      dispatch(resendActivationLink(data.id)).then((response) => {
        if (!response.error) {
          notification.success({
            message: "sidenav.client.Sent!",
            description: response.payload.message,
          });
        }
      });
    } catch (error) {
      console.error(error);
      notification.error({
        message: "sidenav.client.Error!",
        description: response.payload.message,
      });
    }
  };

  const onOkBlockModal = (user) => {
    dispatch(changeActive({ id: user.id, active: !user.is_active })).then(
      (response) => {
        if (!response.error) {
          setUsers((prev) =>
            prev.map((data) =>
              data.id === user.id
                ? { ...data, is_active: !user.is_active }
                : data
            )
          );
        }
      }
    );
  };

  const onManualVerify = (user) => {
    dispatch(verifyEmailManual({ id: user.id })).then((response) => {
      if (!response.error) {
        setUsers((prev) =>
          prev.map((data) =>
            data.id === user.id
              ? { ...data, email_verified_date: moment().local().format() }
              : data
          )
        );
      }
    });
  };

  const openInactiveModal = (data) => {
    mb({
      okText: getTranslation("sidenav.client.Send"),
      title: getTranslation("sidenav.client.verifyTitle"),
      cancelText: getTranslation("sidenav.client.Cancel"),
      text: (
        <>
          {getTranslation("sidenav.client.verifyText")}
          <strong style={{ color: "green" }}>
            {" "}
            {data ? data.email : " "}
          </strong>{" "}
          ?
        </>
      ),
      okFunction: () => sendLink(data),
    });
  };

  const showUserProfile = (userInfo) => {
    setUserProfileVisible(true);
    setSelectedUser(userInfo);
  };
  const showBranchProfile = (userInfo) => {
    setBranchProfileVisible(true);
    setSelectedBranch(userInfo);
  };
  const showNewBranch = (userInfo) => {
    setNewBranch(true);
    setSelectedUser(userInfo);
  };

  const closeUserProfile = () => {
    setUserProfileVisible(false);
  };

  const showUserAddProfile = () => {
    setAddUserProfileVisible(true);
  };

  const showMobileAddress = (data) => {
    setSetMobileAddressOpen(true);
    setClientId(data.id)
    setExpandableData(data.expandableData);
  };

  const onViewLocation = (data) => {
    setLocationVisible(true);
    setMarkersData([
      {
        brand_name: data.brand_name,
        city: data.city_name,
        state: data.state_name,
        address: data.address,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        images: [],
      },
    ]);
    setCoordinate({
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
    });
  };

  const onShowAllPinsOnMap = (data) => {
    if (!data[0]?.latitude || !data[0]?.longitude) return;
    setLocationVisible(true);
    setMarkersData(
      data.map((elm) => ({
        brand_name: elm.brand_name,
        city: elm.city_name,
        state: elm.state_name,
        address: elm.address,
        latitude: parseFloat(elm.latitude),
        longitude: parseFloat(elm.longitude),
        images: [],
      }))
    );
    setCoordinate({
      latitude: parseFloat(data[0].latitude),
      longitude: parseFloat(data[0].longitude),
    });
  };

  const showDeleteConfirmation = (user) => {
    mb({
      okText: getTranslation("sidenav.client.deleteButton"),
      title: getTranslation("sidenav.client.deleteTitle"),
      cancelText: getTranslation("sidenav.client.Cancel"),
      text: (
        <>
          {getTranslation("sidenav.client.deleteText")}
          {" - "}
          <strong style={{ color: "#FF6B72" }}>{user.first_name}</strong>
        </>
      ),
      okFunction: () => deleteBranch(user),
    });
  };

  const activeOrBlock = (user) => {
    mb({
      okText: `${
        user
          ? user.is_active
            ? getTranslation("sidenav.client.blockWithSwitchButton")
            : getTranslation("sidenav.client.unBlockWithSwitchButton")
          : ""
      }`,
      title: `${
        user
          ? user.is_active
            ? getTranslation("sidenav.client.blockWithSwitchTitle")
            : getTranslation("sidenav.client.unBlockWithSwitchTitle")
          : ""
      }`,
      cancelText: getTranslation("sidenav.client.Cancel"),
      text: (
        <>
          {` ${
            user
              ? user.is_active
                ? getTranslation("sidenav.client.blockyWithSwitchText")
                : getTranslation("sidenav.client.unBlockyWithSwitchText")
              : ""
          }`}
          <strong
            style={{
              color: `${user ? (user.is_active ? "#FF6B72" : "green") : ""}`,
            }}
          >
            {user ? ` ${user.first_name}` : ""}
          </strong>
          ?
        </>
      ),
      okFunction: () => onOkBlockModal(user),
    });
  };

  const mainDropdownMenu = (row) => {
    const menuOptions = [
      {
        key: "1",
        label: getTranslation("sidenav.client.Edit"),
        onClick: () => showUserProfile(row),
        icon: <EditOutlined />,
      },
      {
        key: "2",
        label: getTranslation("sidenav.client.add_new_branch"),
        onClick: () => showNewBranch(row),
        icon: <BankOutlined />,
      },
      {
        key: "3",
        label: getTranslation("sidenav.admins.branches_on_map"),
        onClick: () => onShowAllPinsOnMap(row.expandableData),
        icon: <AimOutlined />,
      },
      // {
      //   key: "3",
      //   label: getTranslation("sidenav.client.Delete"),
      //   onClick: () => showDeleteConfirmation(row),
      //   icon: <DeleteOutlined />,
      // }
    ];
    return menuOptions;
  };
  const dropdownMenu = (row) => {
    const menuOptions = [
      {
        key: "1",
        label: getTranslation("sidenav.client.Edit"),
        onClick: () => showBranchProfile(row),
        icon: <EditOutlined />,
      },
      {
        key: "3",
        label: getTranslation("sidenav.client.Delete"),
        onClick: () => showDeleteConfirmation(row),
        icon: <DeleteOutlined />,
      },
    ];
    return menuOptions;
  };

  const navigate = useNavigate();

  const expandedRowRender = (record) => {
    if (!record.expandableData || record.expandableData.length === 0) {
      return null;
    }
    const columns = [
      {
        title: getTranslation("sidenav.client.Address"),
        align: "center",
        render: (_, record) => (
          <div className="flex flex-col flex-start">
            <span className="text-left">
              {record.state_name}, {record.city_name}
            </span>
            <span className="text-left">{record.address}</span>
          </div>
        ),
        sorter: {
          compare: (a, b) => {
            a = a.first_name.toLowerCase();
            b = b.first_name.toLowerCase();
            return a > b ? -1 : b > a ? 1 : 0;
          },
        },
      },
      {
        title: getTranslation("sidenav.client.tableCreatedAt"),
        align: "center",
        render: (_, record) => (
          <span>
            {dayjs(record.create_date)
              .locale(localeDate)
              .format(settings?.date_format)}
          </span>
        ),
      },
      {
        title: getTranslation("sidenav.client.tableActive"),
        align: "center",
        render: (_, elm) => (
          <div>
            <Switch
              checked={elm.is_active}
              onChange={() => activeOrBlock(elm)}
            />
          </div>
        ),
      },
      {
        title: getTranslation("sidenav.admins.google_location"),
        align: "center",
        render: (_, elm) => (
          <Button
            icon={<AimOutlined />}
            disabled={!parseFloat(elm.latitude) && !parseFloat(elm.longitude)}
            onClick={() => {
              if (parseFloat(elm.latitude) && parseFloat(elm.longitude)) {
                setCoordinate({
                  latitude: parseFloat(elm.latitude),
                  longitude: parseFloat(elm.longitude),
                });
                setLocationVisible(true);
                setMarkersData([
                  {
                    brand_name: elm.brand_name,
                    city: elm.city_name,
                    state: elm.state_name,
                    address: elm.address,
                    latitude: parseFloat(elm.latitude),
                    longitude: parseFloat(elm.longitude),
                    images: [],
                  },
                ]);
              }
            }}
          >
            GPS
          </Button>
        ),
      },
      {
        title: getTranslation("sidenav.admins.salesman"),
        align: "center",
        render: (_, elm) => elm.salesman.first_name,
      },
      {
        title: "",
        dataIndex: "actions",
        align: "center",
        render: (_, elm) => (
          <div className="text-right">
            <EllipsisDropdown menu={dropdownMenu(elm)} />
          </div>
        ),
      },
    ];

    return (
      <Table
        className="m-0 p-0"
        columns={columns}
        dataSource={record.expandableData}
        rowKey={(record) => `child-${record.id}`}
        pagination={false}
      />
    );
  };

  const tableColumns = [
    {
      title: getTranslation("sidenav.client.tableUser"),
      align: "center",
      render: (_, record) => (
        <div className="d-flex">
          <AvatarStatus
            id={record.id}
            size={50}
            src={
              record.image
                ? `${API_BASE_URL}images/clients/images/user_${record.id}/${record.image}`
                : ""
            }
            first_name={record.first_name}
            brand_name={record.brand_name}
            subTitle={record.email}
            icon={<UserOutlined />}
            onNameClick={() => {
              navigate(`/clientProfile/${record.id}`);
            }}
          />
        </div>
      ),
      sorter: {
        compare: (a, b) => {
          a = a.first_name.toLowerCase();
          b = b.first_name.toLowerCase();
          return a > b ? -1 : b > a ? 1 : 0;
        },
      },
    },
    {
      title: (
        <p className="no-break">
          {getTranslation("sidenav.client.identifierNumber")}
        </p>
      ),
      align: "center",
      render: (_, record) => <span>{record.personal_id}</span>,
    },
    {
      title: getTranslation("sidenav.client.tableCreatedAt"),
      align: "center",
      render: (_, record) => (
        <span>
          {dayjs(record.create_date)
            .locale(localeDate)
            .format(settings?.date_format)}
        </span>
      ),
    },
    {
      title: getTranslation("sidenav.admins.salesman"),
      align: "center",
      render: (_, elm) => <div>{elm.salesman.first_name}</div>,
    },

    {
      title: "",
      dataIndex: "actions",
      align: "center",
      render: (_, elm) => (
        <div className="text-right flex items-center justify-end">
          {elm.note ? (
            <Tooltip title={elm.note}>
              <CommentOutlined className="cursor-pointer hover:text-blue-600" />
            </Tooltip>
          ) : null}
          <EllipsisDropdown menu={mainDropdownMenu(elm)} />
        </div>
      ),
    },
  ];

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    setSearchValue(value);
    setFilterData((prev) => ({ ...prev, search: value }));
  };
  return (
    <>
      <CustomHelmet title="sidenav.client.tab" />
      <Card styles={{ padding: "0px", paddingTop: "10px" }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div className="mr-md-2">
            <Input
              placeholder={getTranslation("sidenav.client.search")}
              prefix={<SearchOutlined />}
              allowClear
              onChange={onSearch}
              value={searchValue}
            />
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            <div className="w-fu;; md:w-[80px]">
              <ClientFilter
                setFilterData={setFilterData}
                filterData={filterData}
                companyTypeOptions={companyTypeOptions}
                statesOptions={statesOptions}
              />
            </div>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              size="small"
              onClick={showUserAddProfile}
            >
              {getTranslation("sidenav.client.addUser")}
            </Button>
          </div>
        </div>

        {isMobile ? (
          <div className="card-container">
            {users.length > 0 ? (
              users.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onEdit={showUserProfile}
                  onAddBranch={showNewBranch}
                  onDelete={showDeleteConfirmation}
                  onAddressShow={showMobileAddress}
                  onShowAllPinsOnMap={onShowAllPinsOnMap}
                  onBlock={activeOrBlock}
                  localeDate={localeDate}
                  settings={settings}
                />
              ))
            ) : (
              <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                description={getTranslation("sidenav.client.empty")}
              />
            )}
          </div>
        ) : (
          <div className="table-responsive">
            <Table
              size="large"
              expandable={{
                expandedRowRender,
                rowExpandable: (record) => (
                  <div className="f-full h-[400px]">
                    {record.expandableData}
                  </div>
                ),

                columnWidth: 10,
              }}
              columns={tableColumns}
              dataSource={users}
              pagination={false}
              rowKey={(record) => `parent-${record.id}`}
              locale={{
                emptyText: (
                  <Empty
                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    description={getTranslation("sidenav.client.empty")}
                  />
                ),
              }}
            />
          </div>
        )}
        <Flex justifyContent="end" style={{ marginTop: "10px" }}>
          <Pagination
            defaultCurrent={1}
            total={usersLength}
            onChange={async (page, pageSize) => {
              dispatch(
                getAllClient({ ...filterData, page: page, pageSize: pageSize })
              ).then((response) => {
                if (!response.error) {
                  setUsers(response.payload.data);
                  setUsersLength(response.payload.totalCount);
                  window.scrollTo({
                    top: 10,
                    behavior: "smooth",
                  });
                }
              });
            }}
          />
        </Flex>
        {!userProfileVisible ? null : (
          <EditUser
            latitude={mainLocation.latitude}
            longitude={mainLocation.longitude}
            data={selectedUser}
            visible={userProfileVisible}
            close={() => closeUserProfile(false)}
            onSubmit={(updated_user) => {
              setUsers((prev) =>
                prev.map((user) =>
                  user.id === updated_user.id ? updated_user : user
                )
              );
            }}
          />
        )}
        {!branchProfileVisible ? null : (
          <EditBranch
            latitude={mainLocation.latitude}
            longitude={mainLocation.longitude}
            data={selectedBranch}
            visible={branchProfileVisible}
            close={() => setBranchProfileVisible(false)}
            onSubmit={(data) => {
              setUsers((prevUsers) =>
                prevUsers.map((user) => ({
                  ...user,
                  expandableData: user.expandableData.map((item) =>
                    item.id === data.id ? { ...item, ...data } : item
                  ),
                }))
              );

              setExpandableData((prev) =>
                prev.map((elm) =>
                  elm.id === data.id ? { ...elm, ...data } : elm
                )
              );
            }}
          />
        )}

        {!showInfo ? null : (
          <ShowInfo
            data={selectedUser}
            visible={showInfo}
            close={() => setShowInfo(false)}
          />
        )}

        {!addUserProfileVisible ? null : (
          <AddUser
            isMobile={isMobile}
            latitude={mainLocation.latitude}
            longitude={mainLocation.longitude}
            visible={addUserProfileVisible}
            close={() => setAddUserProfileVisible(false)}
            onSubmit={(new_user) => {
              setUsers((prev) => [new_user, ...prev]);
            }}
          />
        )}

        {!newBranch ? null : (
          <NewBranch
            // branchId={selectedBranch.id}
            data={selectedUser}
            latitude={mainLocation.latitude}
            longitude={mainLocation.longitude}
            visible={newBranch}
            close={() => setNewBranch(false)}
            onSubmit={(branch) => {
              setUsers((prev) =>
                prev.map((elm) =>
                  elm.id === branch.expandableData.user_id
                    ? {
                        ...elm,
                        expandableData: [branch, ...elm.expandableData],
                      }
                    : elm
                )
              );
            }}
          />
        )}
        {!setMobileAddressOpen ? null : (
          <AddressList
            clientId={clientId}
            data={expandableData}
            onEdit={showBranchProfile}
            onViewLocation={onViewLocation}
            open={setMobileAddressOpen}
            close={() => setSetMobileAddressOpen(false)}
            onSubmit={(branch) => {}}
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
            onSubmit={() => {}}
          />
        )}
      </Card>
    </>
  );
};

export default ClientsList;

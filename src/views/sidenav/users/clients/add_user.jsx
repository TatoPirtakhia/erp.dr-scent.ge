import { Modal, Form, Input, Button, App, Row, Col, Select, Tooltip, Divider, Upload, InputNumber, Grid } from "antd";
import { useState, useEffect } from "react";
import Flex from "../../../../components/shared-components/Flex";
import { useDispatch } from "react-redux";
import debouncedValidateEmail from "../../../../utils/emailCheck";
import { addClient, addDocumentImage, getAdminsForClient } from "../../../../store/slices/UsersSlice";
import { ROW_GUTTER } from "../../../../constants/ThemeConstant";
import {  getCountries, getRegions } from "../../../../store/slices/CountrySlice";
import {
    UserOutlined,
    MailOutlined,
    AimOutlined
} from "@ant-design/icons"
import AvatarStatus from "../../../../components/shared-components/AvatarStatus";
import { getTranslation } from "../../../../lang/translationUtils";
import resizeImage from "../../../../utils/resizeImage";
import { getCompanyType } from "../../../../store/slices/companyTypeSlice";
import TextArea from "antd/es/input/TextArea";
import MapBox from "../../../../Maps";
import StepsWizard from "../../../../utils/steps";
import AddOrUpdateLayout from "../../../../components/shared-components/add_or_edit_layout";
import { getCities } from "../../../../store/slices/CitiesSlice";
const { useBreakpoint } = Grid;
const AddUser = (props) => {


    const { notification } = App.useApp()
    const { visible, close, onSubmit, longitude, latitude, isMobile } = props;
    
    const [LocationVisible, setLocationVisible] = useState(false)
    const [location, setLocation] = useState({ latitude: null, longitude: null });
    const [googleType, setGoogleType] = useState("link")
    const [current, setCurrent] = useState(0);
    const [clientId, setClientId] = useState(null)
    const [image, setImage] = useState([])
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([])
    const [imageSRC, setImageSRC] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const [country, setCountry] = useState([])
    const [country_id, setCountry_id] = useState(null)
    const [countryOptions, setCountryOptions] = useState([])
    const [states, setStates] = useState([])
    const [selectedStates, setSelectedStates] = useState({})
    const [cities, setCities] = useState([])
    const [citiesOptions, setCitiesOptions] = useState([])
    const [countryId, setCountryId] = useState(81)
    const [selectedCountry, setSelectedCountry] = useState({})
    const [stateId, setStateId] = useState(null)

    const [cityId, setCityId] = useState(null)
    const [clients, setClients] = useState([])
    const [companyType, setCompanyType] = useState([])
    const [companyTypeId, setCompanyTypeId] = useState(null)
    const [companyTypeOptions, setCompanyTypeOptions] = useState([])
    const [selectedAdmins, setSelectedAdmins] = useState([])
    const [form] = Form.useForm()
    const dispatch = useDispatch()

    const [userData, setUserData] = useState({})



    useEffect(() => {
        dispatch(getCountries()).then((response) => {
            if (!response.error) {
                setCountry(response.payload.countries)
                setSelectedCountry(response.payload.countries.find(elm => elm.id === 81))
                setCountryOptions(response.payload.countries.map((elm) => ({
                    value: elm.id,
                    data: elm,
                    label: <Flex gap={5} alignItems="center">
                        <div >
                            {
                                <img
                                    src={elm.image}
                                    alt={elm.name}
                                    width={20}
                                    height={20}
                                />
                            }
                        </div>
                        {`${elm.name}`}
                    </Flex>
                })))
            }
        })


    }, [])


    useEffect(() => {
        dispatch(getCompanyType()).then(res => {
            if (!res.error) {
                setCompanyType(res.payload)
                setCompanyTypeOptions(res.payload.map(elm => ({ data: elm, label: elm.name, value: elm.id })))
            }
        })

    }, [])

    useEffect(() => {
        dispatch(getCities({ country_id: null , state_id: null})).then((response) => {
            if (!response.error) {
                setCities(response.payload.data)
                setCitiesOptions(response.payload.data.map((elm) => ({
                    value: elm.id,
                    data: elm,
                    label: <Flex gap={5} alignItems="center">
                        {`${elm.name}`}
                    </Flex>
                })))
            }
        })
    }, [])
    useEffect(() => {
        if (!countryId) return
        dispatch(getRegions(countryId)).then((response) => {
            if (!response.error) {
                setStates(response.payload.states)
            }
        })
    }, [countryId])

    useEffect(() => {
        dispatch(getAdminsForClient()).then((response) => {
            if (!response.error) {
                setClients(response.payload.map((elm) => ({
                    label: (
                        <div className="p-1">
                            <AvatarStatus
                                id={elm.id}
                                first_name={elm.first_name}
                                subTitle={elm.email}
                                icon={<UserOutlined />}
                                size="small"
                            />
                        </div>
                    ),
                    value: elm.id,
                    data: elm
                })))
            }
        })
    }, [cityId])


    const click = async (data) => {
        if (isLoading) return
        try {
            // setIsLoading(true)
            const body = {
                first_name: data.clientInfo.first_name.trim(),
                brand_name: data.clientInfo.brand_name ? data.clientInfo.brand_name.trim() : '',
                phone1: data.clientInfo.phone1 ? data.clientInfo.phone1.trim().replace(/\s+/g, '') : "",
                phone2: data.clientInfo.phone2 ? data.clientInfo.phone2.trim().replace(/\s+/g, '') : "",
                email: data.clientInfo.email.toLowerCase().trim(),

                personal_id: data.clientInfo.personal_id.trim(),
                selectedUsers: data.address.clients,

                address: data.address.address.trim(),
                country_id: country_id,
                longitude: data.address.longitude,
                latitude: data.address.latitude,
                state_id: stateId,
                city_id: data.address.city_id,
                company_type_id: data.address.company_type_id,
                note: data.address.note,
                user_type: 3,
            }

            dispatch(addClient(body)).then(async (response) => {
                if (!response.error) {

                    notification.success({
                        message: getTranslation("sidenav.client.Done"),
                        description: getTranslation(response.payload.message),
                    })
                    onSubmit({
                        ...response.payload.newUser
                    })
                    setClientId(response.payload.newUser.id)
                    setCurrent(current + 1)
                }
                setIsLoading(false)
            })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <AddOrUpdateLayout
            maskClosable={false}
            open={visible}
            width={900}
            close={close}
            footer={null}
            title={getTranslation("sidenav.client.userAddModalTitle")}
            component={<>
                <StepsWizard
                    form={form}
                    clientId={clientId}
                    current={current}
                    setStateId={setStateId}
                    setCountry_id={setCountry_id}
                    country={country}
                    setCurrent={setCurrent}
                    setSelectedCountry={setSelectedCountry}
                    setSelectedStates={setSelectedStates}
                    states={states}
                    setCountryId={setCountryId}
                    clients={clients}
                    selectedCountry={selectedCountry}
                    countryOptions={countryOptions}
                    citiesOptions={citiesOptions}
                    selectedAdmins={selectedAdmins}
                    setSelectedAdmins={setSelectedAdmins}
                    companyTypeOptions={companyTypeOptions}
                    setLocationVisible={setLocationVisible}
                    click={click}
                    location={location}
                    close={close}
                />

                {!LocationVisible ? null : (
                    <MapBox
                        data={[]}
                        latitude={latitude}
                        longitude={longitude}
                        visible={LocationVisible}
                        enableNewPin={true}
                        close={() => setLocationVisible(false)}
                        onSubmit={(location) => {
                            setLocation({
                                latitude: location.latitude,
                                longitude: location.longitude
                            })
                            form.setFieldsValue({
                                longitude: location.longitude,
                                latitude: location.latitude
                            })
                        }}
                    />
                )}
            </>}
        />
    );
};

export default AddUser;

import React, { useContext, useState } from "react"
import { Card, Table, Input, Button, Empty } from "antd"
import {
    DeleteOutlined,
    EditOutlined,
    SearchOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons"
import EllipsisDropdown from "../../../../components/shared-components/EllipsisDropdown"
import Flex from "../../../../components/shared-components/Flex"
import utils from "../../../../utils/index"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import CustomHelmet from "../../../../utils/customHelmet"
import { MessageBoxContext } from "../../../../context/MessageBoxContext"
import { getTranslation } from "../../../../lang/translationUtils"
import AddUnit from "./add_unit"
import { delete_unit, get_unit } from "../../../../store/slices/UnitSlice"
import EditUnit from "./edit"

const Unit = () => {
    const { mb } = useContext(MessageBoxContext)
    const locale = useSelector((state) => state.theme.locale);
    const [listFilteredUnits, setListFilteredUnits] = useState([])
    const [showUnit, setShowUnit] = useState(false)
    const [showEditUnit, setShowEditUnit] = useState(false)
    const [UnitData, setUnitData] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [selectedData, setSelectedData] = useState([])
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(get_unit())
            .then((response) => {
                if (!response.error) {
                    setUnitData(response.payload.data)
                }
            })
    }, [])

    const [filterData, setFilterData] = useState({
        Unit: "All",
        search: "",
    })

    useEffect(() => {
        let l = utils.wildCardSearch(UnitData, filterData.search)
        if (filterData.Unit !== "All") {
            l = utils.filterArray(l, locale === 'ka' ? 'name_ka' : "name_en", filterData.Unit)
        }
        setListFilteredUnits(l)
    }, [filterData, UnitData])

    const viewDetails = (row) => {
        setSelectedData(row)
        setShowEditUnit(true)
    }

    const viewDelete = (row) => {
        mb({
            okText: getTranslation("sidenav.settings.unit.deleteButton"),
            title: getTranslation("sidenav.settings.unit.deleteTitle"),
            cancelText: getTranslation("sidenav.settings.unit.Cancel"),
            text: (
                <>
                    {getTranslation("sidenav.settings.unit.deleteText")}
                    {" - "}
                    <strong style={{ color: "#FF6B72" }}>
                        {row.name}
                    </strong>
                </>
            ),
            okFunction: () => deleteSingle(row),
        })
    }

    const dropdownMenu = (row) => [
        {
            key: "1",
            label: getTranslation("sidenav.settings.unit.Edit"),
            onClick: () => viewDetails(row),
            icon: <EditOutlined />,
        },
        {
            key: "2",
            label: getTranslation("sidenav.settings.unit.Delete"),
            onClick: () => viewDelete(row),
            icon: <DeleteOutlined />,
        },
    ]


    const deleteRow = () => {
        const selectedIds = selectedRows.map((row) => row.id)
        dispatch(delete_unit(selectedIds)).then((res) => {
            if (!res.error) {
                setUnitData((prev) =>
                    prev.filter((p) => !selectedIds.includes(p.id))
                )
                setSelectedRows([])
            }
        })
    }

    const deleteSingle = (row) => {
        const selectedIds = [row.id]
        dispatch(delete_unit(selectedIds)).then((res) => {
            if (!res.error) {
                setUnitData((prev) => prev.filter((p) => selectedIds[0] !== p.id))
                setSelectedRows((prev) => prev.filter((id) => id !== selectedIds[0]))
            }
        })
    }
    const tableColumns = [

        {
            title: getTranslation("sidenav.settings.unit.table_Unit_name"),
            align: 'center',
            render: (_, record) => (
                <Flex alignItems='center' gap={10} >
                    <span>{locale === 'ka' ? record.name_ka : record.name_en}</span>
                </Flex>
            ),
        },

        {
            title: "",
            width: 5,
            dataIndex: "actions",
            render: (_, elm) => (
                <div className="text-right">
                    <EllipsisDropdown menu={dropdownMenu(elm)} />
                </div>
            ),
        },
    ]

    const rowSelection = {
        onChange: (key, rows) => {
            setSelectedRows(rows)
            setSelectedRowKeys(key)
        },
    }

    const onSearch = (e) => {
        setFilterData((prev) => ({ ...prev, search: e.target.value }))
    }
    return (
        <>
            <CustomHelmet title="sidenav.settings.Unit" />
            <Card>
                <div className="flex flex-col  md:flex-row md:justify-between ">
                    <div className="mr-md-3 mb-3">
                        <Input
                            placeholder={getTranslation("globalInputSearch")}
                            prefix={<SearchOutlined />}
                            onChange={(e) => onSearch(e)}
                        />
                    </div>
                    <div>
                        {selectedRows.length === 0 ? (
                            <Button
                                onClick={() => setShowUnit(true)}
                                type="primary"
                                icon={<PlusCircleOutlined />}
                                block
                            >
                                {getTranslation("sidenav.settings.unit.add_Unit")}
                            </Button>
                        ) : (
                            <Button
                                onClick={deleteRow}
                                type="primary"
                                icon={<DeleteOutlined />}
                                style={{
                                    backgroundColor: "red",
                                    borderColor: "red",
                                    padding: "4px 8px",
                                    fontSize: "15px",
                                }}
                                block
                            >
                                delete {selectedRows.length} Unit
                            </Button>
                        )}
                    </div>
                </div>
                <div className="table-responsive">
                    <Table
                        columns={tableColumns}
                        dataSource={listFilteredUnits}
                        rowKey="id"
                        locale={{
                            emptyText: <Empty
                                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                description={getTranslation("sidenav.settings.unit.empty")}
                            />
                        }}
                        rowSelection={{
                            selectedRowKeys: selectedRowKeys,
                            type: "checkbox",
                            preserveSelectedRowKeys: false,
                            hideSelectAll: false,
                            ...rowSelection,
                        }}
                    />


                </div>
                {!showUnit ? null : (
                    <AddUnit
                        lang={locale}
                        visible={showUnit}
                        close={() => setShowUnit(false)}
                        onSubmit={(Unit) => {
                            setUnitData((prev) => [Unit, ...prev])
                        }}
                    />
                )}


                {!showEditUnit ? null : (
                    <EditUnit
                        visible={showEditUnit}
                        data={selectedData}
                        close={() => setShowEditUnit(false)}
                        onSubmit={(Unit) => {
                            setUnitData((prev) =>
                                prev.map((elm) => elm.id === Unit.id ? Unit : elm)
                            )
                        }}
                    />
                )}
            </Card>
        </>

    )
}

export default Unit

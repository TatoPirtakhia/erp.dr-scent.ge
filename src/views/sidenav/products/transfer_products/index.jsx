import React, { useState, useEffect } from 'react';
import { Flex, Table, Transfer, Select, InputNumber, Empty, Button, App } from 'antd';
import { useDispatch } from 'react-redux';
import { get_product, get_product_by_stock_room, transfer } from '../../../../store/slices/ProductSlice';
import { get_stockRoom } from '../../../../store/slices/stockRoom';
import { NoImage } from '../../../../assets/svg/icon';
import { API_BASE_URL } from '../../../../constants/ApiConstant';
import { getTranslation } from '../../../../lang/translationUtils';
import { CountUp } from 'use-count-up';
import CustomHelmet from '../../../../utils/customHelmet';

const TableTransfer = (props) => {
    const { leftColumns, rightColumns, stockRoomOptions, selectedStockRoomId, selectedStockRoomIdRight, setSelectedStockRoomId, setSelectedStockRoomIdRight, ...restProps } = props;

    const renderHeader = (direction) => {
        return (
            <div>
                <Select
                    style={{ width: '100%' }}
                    allowClear
                    placeholder={getTranslation(`sidenav.products.transfer.${direction === 'left' ? 'Left' : 'Right'}_stock_room`)}
                    onChange={(value) => {

                        direction === 'left' ? setSelectedStockRoomId(value) : setSelectedStockRoomIdRight(value);
                        if (direction === 'left' && selectedStockRoomId === value && selectedStockRoomIdRight === value) {
                            setSelectedStockRoomIdRight(null)
                        };
                    }}
                    options={stockRoomOptions.filter(option => option.value !== selectedStockRoomId && option.value !== selectedStockRoomIdRight)}
                />
            </div>
        );
    };

    return (
        <Transfer
            locale={{
                itemUnit: getTranslation('sidenav.products.transfer.product'),
                itemsUnit: getTranslation('sidenav.products.transfer.products'),
                searchPlaceholder: getTranslation('globalInputSearch'),
            }}
            style={{
                width: '100%',
            }}
            {...restProps}
        >
            {({
                direction,
                filteredItems,
                onItemSelect,
                onItemSelectAll,
                selectedKeys: listSelectedKeys,
                disabled: listDisabled,
            }) => {
                const columns = direction === 'left' ? leftColumns(direction) : rightColumns(direction);
                const rowSelection = {
                    getCheckboxProps: () => ({
                        disabled: listDisabled,
                    }),
                    onChange(selectedRowKeys) {
                        onItemSelectAll(selectedRowKeys, 'replace');
                    },
                    selectedRowKeys: listSelectedKeys,
                    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
                };
                return (
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        rowKey="id"
                        dataSource={filteredItems}
                        size="small"
                        style={{
                            pointerEvents: listDisabled ? 'none' : undefined,
                        }}
                        title={() => renderHeader(direction)}
                        onRow={({ key, disabled: itemDisabled }) => ({
                            onClick: (event) => {
                                if (itemDisabled || listDisabled) {
                                    return;
                                }
                                const { target } = event;
                                const isInputClick = target.tagName === 'INPUT' || target.closest('.ant-input-number');
                                if (!isInputClick) {
                                    onItemSelect(key, !listSelectedKeys.includes(key));
                                }
                            },
                        })}
                        locale={{
                            emptyText: <Empty
                                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                description={getTranslation("sidenav.products.transfer.empty")}
                            />
                        }}
                    />
                );
            }}
        </Transfer>
    );
};

const filterOption = (input, item) => item.name?.toLowerCase().includes(input.toLowerCase());

const TransferProduct = () => {
    const { notification } = App.useApp()
    const [targetKeys, setTargetKeys] = useState([]);
    const [stockRoom, setStockRoom] = useState([]);
    const [stockRoomOptions, setStockRoomOptions] = useState([]);
    const [selectedStockRoomId, setSelectedStockRoomId] = useState(null);
    const [selectedStockRoomIdRight, setSelectedStockRoomIdRight] = useState(null);
    const [products, setProducts] = useState([]);
    const [rightProduct, setRightProduct] = useState([]);
    const [refresh, setRefresh] = useState(false);



    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(get_stockRoom()).then((response) => {
            if (!response.error) {
                setStockRoom(response.payload.data);
                setStockRoomOptions(response.payload.data.map(elm => ({
                    label: elm.name,
                    value: elm.id,
                    data: elm,
                })));
            }
        });
    }, [dispatch]);

    useEffect(() => {
        if (!selectedStockRoomId) return
        dispatch(get_product_by_stock_room({id: selectedStockRoomId, type: 'all'})).then((response) => {
            if (!response.error) {
                setProducts(response.payload.map(elm => ({ ...elm, originalQuantity: elm.quantity, rightQuantity: elm.quantity, key: elm.id })));
                setRightProduct([])
                setTargetKeys([])
            }
        });
    }, [selectedStockRoomId, refresh]);

    useEffect(() => {
        if (!targetKeys) return
        const filtered = products.filter((product) => targetKeys.includes(product.id));
        setRightProduct(filtered.map((elm) => ({ ...elm, originalQuantity: elm.originalQuantity, rightQuantity: elm.quantity })));
    }, [targetKeys]);

    const handleQuantityChange = (value, record, direction) => {
        const updatedProducts = rightProduct.map((product) => {
            if (product.id === record.id) {
                if (direction === 'right') {
                    return { ...product, rightQuantity: value };
                }
            }
            return product;
        });
        const updatedProduct = products.map((product) => {
            if (product.id === record.id) {
                if (direction === 'right') {
                    return { ...product, rightQuantity: value };
                }
            }
            return product;
        });
        setProducts(updatedProduct);
        setRightProduct(updatedProducts);
    };

    const onChange = (nextTargetKeys) => {
        setTargetKeys(nextTargetKeys);
    };

    const columns = (direction) => [
        {
            key: `name_${direction}`,
            title: getTranslation('sidenav.products.transfer.name'),
            align: 'center',
            render: (_, record) => (
                <div className='flex items-center gap-3'>
                    {!record.image ? <NoImage height={35} width={40} /> : <img alt='Product Image' height={35} width={40} style={{ objectFit: "contain" }} src={`${API_BASE_URL}images/products/${record.image}`} />}
                    <span>{record.name}</span>
                </div>
            ),
        },
        direction === "right" ? {
            key: 'quantity_right_total',
            title: getTranslation('sidenav.products.transfer.total_quantity'),
            align: 'center',
            render: (_, record) => (
                <CountUp isCounting duration={0.7} end={record.originalQuantity ? parseInt(record.originalQuantity) : 0} thousandsSeparator="," />
            ),
        } : {},
        direction === "right" ?
            {
                key: 'quantity_left',
                title: getTranslation('sidenav.products.transfer.quantity'),
                align: 'center',
                render: (_, record) => (
                    <InputNumber
                        min={0}
                        max={parseInt(record.quantity)}
                        value={parseInt(record.rightQuantity)}
                        onChange={(value) => handleQuantityChange(value, record, direction)}
                        onClick={(e) => e.stopPropagation()}
                    />
                ),
            } :
            {
                key: 'quantity_right',
                title: getTranslation('sidenav.products.transfer.quantity'),
                align: 'center',
                render: (_, record) => (
                    <CountUp isCounting duration={0.7} end={record.originalQuantity ? parseInt(record.originalQuantity) : 0} thousandsSeparator="," />
                ),
            },
    ];
    const handleSave = () => {
        if (!selectedStockRoomIdRight) {
            notification.warning({
                message: getTranslation("Warring!"),
                description: getTranslation('sidenav.products.transfer.select_stock_room_required'),
            })
            return
        }
        if (!rightProduct.length) {
            notification.warning({
                message: getTranslation("Warring!"),
                description: getTranslation('sidenav.products.transfer.select_product_required'),
            })
            return
        }
        const isEmpty = rightProduct.some((elm) => elm.rightQuantity === 0);

        if (isEmpty) {
            notification.warning({
                message: getTranslation("Warring!"),
                description: getTranslation('sidenav.products.transfer.select_product_quantity_required'),
            })
            return
        }


        const body = {
            stock_room_from: selectedStockRoomId,
            stock_room_to: selectedStockRoomIdRight,
            products: rightProduct.map((elm) => ({ id: elm.id, leftQuantity: elm.originalQuantity - elm.rightQuantity, quantity: elm.rightQuantity }))
        }

        dispatch(transfer(body)).then((response) => {
            if (!response.error) {
                notification.success({
                    message: getTranslation("Success!"),
                    description: getTranslation('sidenav.products.transfer.success'),
                })
                setRightProduct([])
                setTargetKeys([])
                setRefresh(!refresh)

            }
        })

    };
    return (
        <>
        <CustomHelmet title="sidenav.products.transfer" />
            <Flex align="start" gap="middle" vertical>
                <TableTransfer
                    dataSource={products}
                    targetKeys={targetKeys}
                    showSearch
                    showSelectAll={false}
                    onChange={onChange}
                    filterOption={filterOption}
                    leftColumns={() => columns('left')}
                    rightColumns={() => columns('right')}
                    stockRoomOptions={stockRoomOptions}
                    setSelectedStockRoomId={setSelectedStockRoomId}
                    setSelectedStockRoomIdRight={setSelectedStockRoomIdRight}
                    selectedStockRoomId={selectedStockRoomId}
                    selectedStockRoomIdRight={selectedStockRoomIdRight}
                />
                <div className='flex justify-end w-full'>
                    <Button type="primary" onClick={handleSave} style={{ marginTop: 16 }}>
                        {getTranslation('sidenav.products.transfer.save')}
                    </Button>
                </div>
            </Flex>
        </>
    );
};

export default TransferProduct;

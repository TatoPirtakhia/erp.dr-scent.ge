import React from 'react';
import { Grid, Modal, Drawer } from 'antd';
import { getTranslation } from '../../../lang/translationUtils';
import utils from '../../../utils';
const { useBreakpoint } = Grid;

const AddOrUpdateLayout = (props) => {
    const isMobile = !utils.getBreakPoint(useBreakpoint()).includes('lg');
    const {  component,  open, close, title, maskClosable, footer , width} = props

    return (
        <>
            {!isMobile ? (
                <Modal
                    maskClosable={maskClosable}
                    title={getTranslation(title)}
                    open={open}
                    width={width}
                    onCancel={close}
                    footer={footer}
                >
                    {/* Render your component here */}
                    <div>{component}</div>
                </Modal>
            ) : (
                <Drawer
                    title={getTranslation(title)}
                    placement="left"
                    size='large'
                    closable={true}
                    onClose={close}
                    open={open}
                >
                    {/* Render your component here */}
                    <div>{component}</div>
                </Drawer>
            )}
        </>
    );
};

export default AddOrUpdateLayout;

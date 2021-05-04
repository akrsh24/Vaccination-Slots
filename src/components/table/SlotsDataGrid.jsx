import { Table, Tag } from 'antd';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { AlertComponent, sortData } from '../../util/Util';

const headers = [
    {
        title: 'Type',
        dataIndex: 'vaccine',
        key: 'vaccine',
        render: vaccine => (
            <>
                <Tag color="blue">
                    {vaccine.toUpperCase()}
                </Tag>
            </>
        )
    },
    {
        title: 'Date Of Vaccine',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Count',
        dataIndex: 'available_capacity',
        key: 'available_capacity',
    },
    {
        title: 'Min-Age',
        dataIndex: 'min_age_limit',
        key: 'min_age_limit',
    },
    {
        title: 'Center Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Pincode',
        dataIndex: 'pincode',
        key: 'pincode',
    },
    {
        title: 'Fee',
        dataIndex: 'fee_type',
        key: 'fee_type',
    }
];

const TableContainer = styled.section`
    width: 100%;
    margin: 5% 0;
    overflow-x: auto;
`;

const StyledTable = styled(Table)`
    font-family: arial, sans-serif;
    /* border-collapse: collapse; */
    width: 100%;
`;

const getDatasourceObject = ({ dataArray }) => {
    let dataObject = [];

    dataArray.length && dataArray.forEach((session, idx) => {
        const { name, address, pincode, fee_type, date, available_capacity, vaccine, min_age_limit } = session;
        let dataObj = {
            key: idx,
            name,
            address,
            pincode,
            fee_type,
            date: moment(date).format("L"),
            available_capacity,
            vaccine,
            min_age_limit
        }
        dataObject.push(dataObj);
    });
    return dataObject;
}


const SlotsDataGrid = memo(({ slotsDetails, statusMsg }) => {
    const [columns, setColumns] = useState([]);
    const [datasources, setDatasources] = useState([]);

    useEffect(() => {
        setColumns(headers);
    }, []);

    useEffect(() => {
        const sortedData = sortData({ data: [...slotsDetails], type: 'date', key: 'date' });
        setDatasources(getDatasourceObject({ dataArray: sortedData }));
    }, [slotsDetails]);

    return (
        <TableContainer>
            <br />
            {
                !datasources.length && statusMsg.length ?
                    <div>
                        <AlertComponent message={statusMsg} />
                    </div>
                    :
                    <StyledTable
                        dataSource={datasources}
                        columns={columns}
                        bordered={true}
                        pagination={false}
                        size="middle"
                    />
            }

        </TableContainer >
    )
});
export default SlotsDataGrid;
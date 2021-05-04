import { Alert } from "antd";
import moment from "moment";
import styled from "styled-components";

export const setDetailsObject = ({ sessionData, centreData }) => {
    const { name, address, pincode, fee_type } = centreData;
    const { date, available_capacity, vaccine, min_age_limit } = sessionData;
    return {
        name,
        address,
        pincode,
        fee_type,
        date,
        available_capacity,
        vaccine,
        min_age_limit
    }
}

export const sortData = ({ data, type, key }) => {
    if (type === 'date')
        return data.sort((a, b) => new Date(b[key]) - new Date(a[key]));

    return data.sort((a, b) => b.name - a.name);
}

const StyledAlert = styled(Alert)`
    width:100%;
    text-align:center;
`;

export const AlertComponent = ({ message }) => {
    return (
        <StyledAlert message={message} type="info" />
    )
}

export const getMaxDate = ({ currentDate }) => {
    let date = moment(currentDate).add(30, 'days').calendar();
    console.log(moment(date).format('yyyy-MM-DD'));
    return moment(date).format('yyyy-MM-DD');
}
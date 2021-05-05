import { Button, Input, InputNumber, Radio, Select } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import styled from 'styled-components';
import useDistrictList from '../../hooks/useDistrictList';
import useStateList from '../../hooks/useStateList';
import { AlertComponent, getMaxDate, setDetailsObject } from '../../util/Util';
import SlotsDataGrid from '../table/SlotsDataGrid';
const { Option } = Select;

const QueryFormContainer = styled.section`
     width:100%;
     border:1px solid black;
     
     padding:2%;
`;

const Container = styled.section`
    width:100%;

    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    flex-wrap:wrap;
`;

const FlexSectionItems = styled.section`
   display:flex;
   justify-content:center;
   align-items:center;
   text-align:center;
   flex-wrap:wrap;

   width:50%;
   padding:10px 0;

   @media (max-width:767px){
     width:100%;
     flex-direction:row;
     justify-content:space-evenly;
     align-items:flex-start;
     text-align:center;
   }

`;

const Label = styled.label`
    margin:2%;
`;

const StyledForm = styled.form`
    width:100%;

    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    flex-wrap:wrap;
     
`;

const StyledButton = styled(Button)`
    margin:2%;
`;

let tempInputValue = "";

const QueryForm = () => {
    const [slotDate, setSlotDate] = useState(new Date());
    const [pincodes, setPincode] = useState("");
    const [stateValue, setStateValue] = useState("");
    const [district, setDistrict] = useState('');

    const [slotData, setSlotData] = useState([]);
    const [statusMsg, setStatusMsg] = useState("");

    const [filterType, setFiterType] = useState('pincode');
    const [stateList] = useStateList();
    const [districtList] = useDistrictList({ stateID: stateValue });

    const onChange = e => {
        setFiterType(e.target.value);
    };

    const findSlots = async ({ dateToFind, key, type }) => {
        if (type === "pincode") {
            try {
                let vaccineSlots = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${key}&date=${dateToFind}`);
                vaccineSlots = vaccineSlots.json();
                vaccineSlots.then(data => findNextAvailableDate({ ...data }));
            } catch (error) {
                console.error(error);
            }
        }
        else {
            try {
                let vaccineSlots = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${key}&date=${dateToFind}`);
                vaccineSlots = vaccineSlots.json();
                vaccineSlots.then(data => findNextAvailableDate({ ...data }));
            } catch (error) {
                console.error(error);
            }
        }

    }

    const findNextAvailableDate = ({ centers }) => {
        let isAvailableFlag = false;
        let datesArray = [];
        try {
            if (centers.length) {
                centers.forEach(center => {
                    const sessions = center?.sessions;
                    if (sessions) {
                        sessions.forEach(session => {
                            const { available_capacity } = session;
                            if (available_capacity > 0) {
                                let tableData = setDetailsObject({ sessionData: session, centreData: center });
                                datesArray.push(tableData);
                                isAvailableFlag = true;
                            }
                        })
                    }
                })
                if (!isAvailableFlag) {
                    console.error("No slot available for this date");
                    setStatusMsg("No slot available for this date + 7 days")
                }
                setSlotData(datesArray);
            }
            else {
                console.error("No center available");
                setStatusMsg("No center available on this pincode")
                setSlotData(datesArray);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleDate = ({ target }) => {
        const date = target.value;
        setSlotDate(date);
    }

    const onBlur = () => {
        setPincode(tempInputValue);
    }

    const handlePincode = (value) => {
        console.log(value);
        tempInputValue = value;
    }

    const handleDistrict = (value) => {
        setDistrict(value);
    }

    const handleStateValue = (value) => {
        console.log(value);
        setStateValue(value);
    }

    const handleSubmit = () => {
        let userPincode = + pincodes;
        let formattedDate = moment(slotDate).format('DD-MM-YYYY');
        if (filterType === 'pincode') {
            if (userPincode < 1 && (userPincode.toString).length !== 6)
                alert("Enter valid pincode and date");
            else if (slotDate && userPincode)
                findSlots({ dateToFind: formattedDate, key: userPincode, type: "pincode" });
        }
        else {
            if (!district.length)
                alert("Enter valid district and date");
            else if (slotDate && district)
                findSlots({ dateToFind: formattedDate, key: district, type: "district" });
        }
    }

    const PincodeFilterForm = () => {
        return (
            <FlexSectionItems>
                <Label htmlFor="pincode">Pin Code</Label>
                <InputNumber
                    id="pincodeInput"
                    onChange={handlePincode}
                    value={pincodes}
                    key="pincodeInput"
                    onBlur={onBlur}
                    style={{
                        width: "75%"
                    }}
                />
                <StyledButton type="primary" onClick={handleSubmit}>
                    Search
                </StyledButton>
            </FlexSectionItems >
        )
    }

    const DistrictFilterForm = () => {
        console.log(districtList);
        return (
            <>
                <FlexSectionItems>
                    <Label htmlFor="state">State</Label>
                    <Select
                        showSearch
                        value={stateValue}
                        style={{ width: '75%', marginBottom: "10px", textAlign: 'right' }}
                        placeholder="Select a state"
                        optionFilterProp="children"
                        onChange={handleStateValue}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {
                            stateList?.states && stateList?.states.map(state => {
                                return <Option key={state.state_id}>{state.state_name}</Option>
                            })
                        }
                    </Select>
                </FlexSectionItems>
                <FlexSectionItems>
                    <Label htmlFor="district">District</Label>
                    <Select
                        showSearch
                        style={{ width: '75%' }}
                        value={district}
                        placeholder="Select a district"
                        optionFilterProp="children"
                        onChange={handleDistrict}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        disabled={!stateValue.length}
                    >
                        {
                            districtList?.districts && districtList?.districts.map(districtObj => {
                                return <Option key={districtObj.district_id}>{districtObj.district_name}</Option>
                            })
                        }

                    </Select>
                </FlexSectionItems>
                <StyledButton type="primary" onClick={handleSubmit}>
                    Search
                </StyledButton>
            </>
        )
    }

    const FilterTypeForm = () => {
        switch (filterType) {
            case "district": return <DistrictFilterForm />
            default: return <PincodeFilterForm />
        }
    }

    const QueryFormItems = () => {
        return (
            <>
                <FlexSectionItems>
                    <Label htmlFor="dateToFind">Vaccine Date</Label>
                    <Input
                        type="date"
                        name="dateToFind"
                        id="dateToFind"
                        value={moment(slotDate).format('yyyy-MM-DD')}
                        onChange={(e) => handleDate(e)}
                        max={getMaxDate(slotData)}
                        style={{
                            width: "53%"
                        }}
                    />
                </FlexSectionItems>
                <FlexSectionItems>
                    <Radio.Group onChange={onChange} value={filterType}>
                        <Radio value="pincode">Pincode</Radio>
                        <Radio value="district">District</Radio>
                    </Radio.Group>
                </FlexSectionItems>
                <FilterTypeForm />
            </>
        )
    }

    return (
        <QueryFormContainer>
            <h1 style={{ textAlign: "center", border: "1px dashed black" }}>Slot Finder</h1>
            <StyledForm name="queryForm" id="form">
                <Container>
                    <QueryFormItems />
                    <AlertComponent message="Data is available for 30 days window only" />
                    {
                        slotData.length > 0 ?
                            <SlotsDataGrid slotsDetails={slotData} statusMsg={statusMsg} />
                            :
                            <SlotsDataGrid slotsDetails={[]} statusMsg={statusMsg} />
                    }
                </Container>
            </StyledForm>
        </QueryFormContainer >
    );
}
export default QueryForm;
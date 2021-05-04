import moment from 'moment';
import { useState } from 'react';
import styled from 'styled-components';
import './App.css';

const Container = styled.main`
    margin: 10vh 5vw;
    padding:1%;
    border:1px solid black;
    width:90vw;

    display:flex;
    justify-content:center;
    align-items:center;
    flex-wrap:wrap;

    @media (max-width:767px){
      flex-direction:column;
   }
`;

const FlexSection = styled.section`
   width:33%;
   margin: 5px 0 5px 5px;
   padding:10px 0;

   @media (max-width:767px){
     width:100%;
     margin: 5px 0 5px 5px;
     padding:10px 0;
   }
`;

function App() {

  const [slotDate, setSlotDate] = useState(new Date());
  const [pincodes, setPincode] = useState(0);
  const [slotData, setSlotData] = useState([]);
  const [statusMsg, setStatusMsg] = useState("No data");

  const sortData = ({ data, type, key }) => {
    console.log(data, type, key);
    if (type === 'date')
      return data.sort((a, b) => new Date(b[key]) - new Date(a[key]));

    return data.sort((a, b) => b.name - a.name);
  }

  const findSlots = async ({ dateToFind, pincode }) => {
    console.log(dateToFind, pincode);
    try {
      let vaccineSlots = await fetch(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${dateToFind}`);
      vaccineSlots = vaccineSlots.json();
      vaccineSlots.then(data => findNextAvailableDate({ ...data }));
    } catch (error) {
      console.log(error);
    }
  }

  const setDetailsObject = ({ sessionData, centreData }) => {
    const { name, address, pincode, fee_type } = centreData;
    const { date, available_capacity, vaccine } = sessionData;
    return {
      name,
      address,
      pincode,
      fee_type,
      date,
      available_capacity,
      vaccine
    }
  }

  // const handleHeaderClick = ({ data, type, key }) => {
  //   const sortedData = sortData({ data, type, key });
  //   console.log(sortedData);
  //   // setSlotData(sortedData);
  // }

  const getSlotTable = ({ data }) => {
    console.log("table");
    const sortedData = sortData({ data: [...data], type: 'date', key: 'date' });
    return (
      <div id="slotTable">
        <table>
          <thead>
            <tr>
              <th>Center Name</th>
              <th>Address</th>
              <th>Pincode</th>
              <th>Fee Type</th>
              <th>Date</th>
              <th>Count</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {
              sortedData.length ?
                sortedData.map((session, idx) => {
                  const { name,
                    address,
                    pincode,
                    fee_type,
                    date,
                    available_capacity,
                    vaccine } = session;
                  return (
                    <tr key={idx}>
                      <td>
                        {name}
                      </td>
                      <td>
                        {address}
                      </td>
                      <td>
                        {pincode}
                      </td>
                      <td>
                        {fee_type}
                      </td>
                      <td>
                        {date}
                      </td>
                      <td>
                        {available_capacity}
                      </td>
                      <td>
                        {vaccine}
                      </td>
                    </tr>
                  )
                })
                :
                <tr>
                  <td>
                    {statusMsg}
                  </td>
                </tr>
            }
          </tbody>
        </table>
      </div >
    )
  }

  const findNextAvailableDate = ({ centers }) => {
    let isAvailableFlag = false;
    let datesArray = [];
    // console.log(centers);
    try {
      if (centers.length) {
        centers.forEach(center => {
          const sessions = center?.sessions;
          if (sessions) {
            sessions.forEach(session => {
              const { available_capacity } = session;
              if (available_capacity > 0) {
                // console.log(`Session Available on ${date} with vaccine ${vaccine} , address -> ${center.name}`);
                let tableData = setDetailsObject({ sessionData: session, centreData: center });
                // console.log(tableData);
                datesArray.push(tableData);
                isAvailableFlag = true;
              }
            })
          }
        })
        if (!isAvailableFlag) {
          console.log("No slot available for this date");
          setStatusMsg("No slot available for this date + 7 days")
        }
        setSlotData(datesArray);
      }
      else {
        console.log("No center available");
        setStatusMsg("No center available on this pincode")
        setSlotData(datesArray);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let formattedDate = moment(slotDate).format('DD-MM-YYYY');
    console.log(formattedDate, pincodes);
    if (pincodes < 1 && (pincodes.toString).length !== 6)
      alert("Enter pincode and date");
    else {
      if (slotDate && pincodes)
        findSlots({ dateToFind: formattedDate, pincode: pincodes });
    }

  }

  const handleDate = ({ target }) => {
    const date = target.value;
    console.log(date);
    setSlotDate(date);
  }

  const handlePincode = ({ target }) => {
    const userPincode = target.value;
    setPincode(+ userPincode);
  }

  return (
    <form id="form" onSubmit={handleSubmit}>
      <Container>
        <FlexSection>
          <label htmlFor="dateToFind">Vaccine Date</label>
          <input
            type="date"
            name="dateToFind"
            id="dateToFind"
            value={moment(slotDate).format('yyyy-MM-DD')}
            onChange={(e) => handleDate(e)}
          />
          &nbsp; &nbsp;
        </FlexSection>
        <FlexSection>
          <label htmlFor="pincode">Pin Code</label>
          <input
            type="number"
            name="pincode"
            id="pincode"
            min="1"
            onChange={(e) => handlePincode(e)}
          />
          <button type="submit" id="submitBtn">
            Find
          </button>
        </FlexSection>
        {
          slotData.length > 0 ?
            getSlotTable({ data: slotData })
            :
            getSlotTable({ data: [] })
        }
      </Container>
    </form>
  );
}

export default App;

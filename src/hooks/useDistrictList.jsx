import { useEffect, useState } from 'react';
const useDistrictList = ({ stateID }) => {
    const [districtList, setDistrictList] = useState([]);
    useEffect(() => {
        if (stateID.length) {
            const getDistrictList = async () => {
                try {
                    let district = await fetch(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateID}`);
                    district = district.json();
                    district.then(data => setDistrictList(data));
                } catch (error) {
                    console.log(error);
                }
            }
            getDistrictList();
        }
    }, [stateID]);

    return [districtList];
}
export default useDistrictList;
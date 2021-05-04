import { useEffect, useState } from 'react';
const useStateList = () => {
    const [stateList, setStateList] = useState([]);
    const getStateList = async () => {
        try {
            let states = await fetch(`https://cdn-api.co-vin.in/api/v2/admin/location/states`);
            states = states.json();
            states.then(data => setStateList(data));
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getStateList();
    }, []);

    return [stateList];
}
export default useStateList;
import axios from "axios";
import { atom, selector } from "recoil";


export const userInfoAtom = atom({
    key : "userInfoAtom",
    default : selector({
        key : "userInfoSelector",
        get : async () => {
            const token = localStorage.getItem('token');

            if(!token){
                return {}
            }
            try{
                const response = await axios.get(`http://localhost:3000/api/v1/user/getinfo`,{
                    headers : {
                        Authorization : `Bearer ${token}`
                    }
                });
                console.log(response.data);
                return response.data
            } catch(error){
                console.log(error);
                return {}
            }
            
        }
    })
})


export const balanceAtom = atom({
    key: 'balanceAtom',
    default: selector({
        key: 'balanceSelector',
        get: async () => {
            const token = localStorage.getItem('token');
            if(!token){
                return {}
            }
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/account/balance`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                console.log(response.data)
                const final = response.data.balance.balance
                return final.toFixed(2);
            } catch (error) {
                
                throw error;
            }
        }
    })
});
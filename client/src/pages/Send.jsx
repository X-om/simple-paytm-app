import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "../components/Card";
import Inputbox from "../components/Inputbox";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilRefresher_UNSTABLE } from "recoil";
import { balanceAtom } from "../store/atoms";

export default function Send(){

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const lastname = searchParams.get("lastname");
    const [amount,setAmount] = useState(0);
    const [responseMessage,setResponseMessage] = useState({ status:'' ,message : '' });
    const [loading,setLoadingStatus] = useState(false);
    const navigate = useNavigate();
    const refreshBalance = useRecoilRefresher_UNSTABLE(balanceAtom);

    const handleTransfer = async () =>{
        if(amount <= 0){
            setResponseMessage(
                {
                    status : "failed",
                    message : "please enter the valid amount"
                }
            )
            return;
        }
        setLoadingStatus(true);
        try{
            const response = await axios.post(`http://localhost:3000/api/v1/account/transfer`,{
                to : id,
                amount : +amount
            },{
                headers : {
                    Authorization :  `Bearer ${localStorage.getItem('token')}`
                }
            });
            setResponseMessage(response.data);
        } catch(error){
            const errorMessage = error.response?.data?.message || 'Transfer failed';
            setResponseMessage({ status: 'failed', message: errorMessage });
            alert('transfer faileed');
        } finally{
            setLoadingStatus(false);
        }
    }

    useEffect(()=>{
        let timeout;
        if(responseMessage.status === 'success'){
            refreshBalance();
            timeout = setTimeout(()=>{
                navigate('/dashboard');
            },1000);
        }
        return () => clearTimeout(timeout);
    },[responseMessage,navigate]);  

    return(
        <div className="flex justify-center h-screen">
            <div className="flex flex-col justify-center">
                <Card> 
                    <div>Send Money</div>
                    <div>{name[0].toUpperCase()}</div>
                    <div>{name} {lastname}</div>
                    <Inputbox 
                        label={'Amount (in Rs)'} 
                        placeholder={'Enter Amount'}
                        onChange={(e)=>{
                            setAmount(e.target.value);
                    }}/>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded-md w-full font-medium font-sans hover:bg-green-400"
                        onClick={handleTransfer}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : 'Initiate Transfer'}
                    </button>
                </Card>
                <div>
                <div>
                    {responseMessage.status && (
                        <div className={`my-10 flex justify-center rounded-md py-6 ${responseMessage.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                            <div className={`flex flex-col justify-center text-lg font-semibold ${responseMessage.status === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                {responseMessage.message}
                            </div>
                        </div>
                    )}
                </div>
                </div>
            </div>
        </div>
    )
}


import { useNavigate } from "react-router-dom"
import Button from "./Button";

export const UserCard = ({user}) =>{
    const navigate = useNavigate();
    return (
        <div className="flex justify-between my-4 bg-slate-200 p-2 rounded-lg shadow-md">
            <div className="flex">
                <div className=" rounded-full h-12 w-12 bg-slate-400 flex justify-center">
                    <div className="flex flex-col justify-center h-full text-xl font-bold">
                        {user.firstName[0].toUpperCase()}
                    </div>
                </div>
                <div className="flex flex-col justify-center ml-2">
                    <div className="flex font-sans text-lg">
                        {user.firstName} {user.lastName}
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center h-full mt-2">
                <Button 
                label={'send money'}
                onClick={()=>{
                    navigate(`/send?id=${user._id}&name=${user.firstName}&lastname=${user.lastName}`)
                }}
                />
            </div>
        </div>
    )
}
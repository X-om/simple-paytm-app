import { useEffect, useState } from "react"
import Inputbox from "./Inputbox"
import axios from "axios";
import { UserCard } from "./UserCard";

export const Users = () =>{
    const [users,setUsers] = useState([]);
    const [filter,setFilter] = useState('');
    
    useEffect(()=>{
        const timeout = setTimeout(()=>{
            axios.get(`http://localhost:3000/api/v1/user/bulk?filter=${filter}`,{
                headers : {
                    Authorization : `Bearer ${localStorage.getItem('token')}`
                }
            })
                .then((response)=>{
                console.log(response.data)
                setUsers(response.data.user);

            }).catch((error)=>{
                console.log(`error while fetching users ${error}`);
                setUsers([]);
                
            });
        },500);

        return () => clearTimeout(timeout);
    },[filter]);

    return(
        <>
            <div className="mt-6 font-bold text-lg p-2 mx-0 shadow-md rounded-lg">
               Users
            </div>

            <div className=" my-4">
            <Inputbox 
                label={'Search User'} 
                placeholder={'type username'} 
                onChange={(e)=>{
                    setFilter(e.target.value);
            }}/>
            <div>
                {
                    users.map(user => <UserCard key={user._id} user={user}/>)
                }
            </div>
            </div>
        </>
    )


}
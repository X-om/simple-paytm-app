import {useState } from "react";
import Heading from "../components/Heading";
import Inputbox from "../components/Inputbox";
import Subheading from "../components/Subheading";
import Button from "../components/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BottomWarning from "../components/BottomWarning";
import { useRecoilRefresher_UNSTABLE } from "recoil";
import { balanceAtom, userInfoAtom } from "../store/atoms";

export default function Signup() {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const refreshUserInfo = useRecoilRefresher_UNSTABLE(userInfoAtom);
    const refreshBalance = useRecoilRefresher_UNSTABLE(balanceAtom);

    return <div className="bg-slate-200 h-screen flex justify-center">
        <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4 ">
                <Heading label={"sign up"} />
                <Subheading label={"Enter your infromation to create an account"} />
                <Inputbox label={"FirstName"} placeholder={"Enter your first name"}
                    onChange={(e) => {
                        setFirstName(e.target.value);
                    }} />
                <Inputbox label={"LastName"} placeholder={"Enter your last name"}
                    onChange={(e) => {
                        setLastName(e.target.value);
                    }}
                />
                <Inputbox label={"username"} placeholder={"@om_argade"}
                    onChange={(e) => {
                        setUserName(e.target.value);
                    }}
                />
                <Inputbox label={"Email"} placeholder={"omargade@gamil.com"} type={"email"}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                />
                <Inputbox label={"Password"} placeholder={"Create password"} type={"password"}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <div className="pt-4">
                    <Button onClick={async () => {
                        const response = await axios.post(`http://localhost:3000/api/v1/user/signup`, {
                            firstName,
                            lastName,
                            username : userName,
                            email,
                            password
                        });
                        localStorage.setItem('token', response.data.Token);
                        refreshUserInfo();
                        refreshBalance();
                        navigate('/dashboard');
                    }} label={"Sign up"} />
                </div>
                <BottomWarning label={'Already have an account'} buttonText={'Sign in'} to={'/signin'}/>
            </div>
        </div>
    </div>

}


import { useRecoilValueLoadable, useResetRecoilState } from "recoil"
import { Appbar } from "../components/Appbar"
import Balance from "../components/Balance"
import { balanceAtom, userInfoAtom } from "../store/atoms";
import Loading from "../components/Loading";
import ErrorLoadingBalance from "../components/ErrorLoadingBalance";
import { Users } from "../components/Users";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";

export default function Dashboard() {
    
    const loadable = useRecoilValueLoadable(balanceAtom);
    const navigate = useNavigate();
    const resetUserInfoAtom = useResetRecoilState(userInfoAtom);
    const resetBalance = useResetRecoilState(balanceAtom);
    return (
        <div>
            <Appbar />
            <div className="flex flex-col mx-4 mt-8">
                <div className="flex justify-between rounded-lg">
                    {
                        loadable.state === 'loading' ? (
                            <Loading loadingInfo={'Fetching your balance'} />
                        ) : loadable.state === 'hasError' ? (
                            <ErrorLoadingBalance />
                        ) : (
                            <Balance value={loadable.contents} />
                        )
                    }
                    <div className="flex flex-col justify-center">
                        <Logout onPress={()=>{
                            localStorage.removeItem('token');
                            localStorage.clear();
                            resetUserInfoAtom();
                            resetBalance();
                            navigate('/signin');
                        }}/>
                    </div>
                </div>

                <Users />
            </div>
        </div>
    )
}

import { useRecoilValueLoadable } from "recoil"
import { userInfoAtom } from "../store/atoms"
import Loading from "./Loading";

export const Appbar = () => {
    const userinfo = useRecoilValueLoadable(userInfoAtom);
    return (
        <div className="shadow-lg h-14 flex justify-between">
            <div className="flex flex-col justify-center h-12 px-4 ml-2 mt-1 bg-slate-300 rounded-lg font-semibold ">
                PayTM App
            </div>
            <div className="flex">
                <div className="flex flex-col justify-center h-full mr-4">
                    Hello
                </div>

                <div className="rounded-lg h-12 w-max bg-slate-200 flex justify-center px-4 py-2 mt-1 mr-2 hover:bg-slate-300">

                    {
                        userinfo.state === 'loading' ? (
                            <div className="flex justify-center h-full">
                                <Loading loadingInfo={''} />
                            </div>
                        ) : userinfo.state === 'hasError' ? (
                            <div className=" text-red-500 font-bold text-lg">
                                ?
                            </div>
                        ) : (
                            <div className="flex justify-center h-full text-xl">
                                {
                                    userinfo.contents.firstName
                                }
                            </div>
                        )
                    }


                </div>
            </div>

        </div>
    )
}
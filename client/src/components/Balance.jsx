export default function Balance({value}){

    return(
        <div className="flex flex-col w-60 h-max py-5 px-2 bg-slate-200 rounded-lg shadow-lg">
            <div className="font-bold text-lg ml-2">
                Your Balance
            </div>
            <div className=" font-semibold mt-2 ml-2 text-lg">
                Rs {value}/-
            </div>
        </div>
    )
}
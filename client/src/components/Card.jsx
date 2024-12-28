

export const Card = ({children}) =>{

    const header = children[0];
    const letter = children[1]; 
    const name = children[2];
    const amountInput = children[3];
    const button = children[4];
    return (
        <div className=" flex flex-col h-max w-max px-4 py-6 shadow-xl bg-slate-50">
            <div className="flex justify-center mx-20">
                <div className="text-2xl font-semibold">
                    {header}
                </div>
            </div>
            <div className="rounded-md py-2 shadow-sm mt-10 flex flex-col justify-center"> 
                <div className="flex px-2">
                    <div className=" bg-green-500 rounded-full h-12 w-12 flex justify-center">
                        <div className="flex flex-col justify-center">
                            <div className=" text-2xl font-bold text-white">
                                {letter}
                            </div>    
                        </div>
                    </div>

                    <div className="flex justify-center px-4">
                        <div className="flex flex-col justify-center">
                            <div className="text-xl font-bold">
                                {name} 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-2">
                {amountInput}
            </div>
            <div className="my-4 flex justify-center">
                {button}
            </div>
        </div>
    )
}
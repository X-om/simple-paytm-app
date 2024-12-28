export default function Logout({onPress}){
    return (
        <div className="flex flex-col justify-center p-2">
            <button 
                type="button" 
                className="h-12 w-12 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 flex items-center justify-center"
                onClick={onPress}
                >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>
            </button>
            <div className="my-1 text-sm flex items-center justify-center text-gray-500">
                logout
            </div>
        </div>
    )
}
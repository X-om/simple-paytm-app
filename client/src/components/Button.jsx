export default function Button({label,onClick}){
    return <button onClick={onClick} type="button"
            className="w-full bg-gray-800 hover:bg-gray-900 text-white focus:outline-none focus:ring-4
            focus:ring-gray-400 font-medium text-sm px-5 py-2.5 me-2 mb-2 border rounded-md">
        {label}
    </button>
}
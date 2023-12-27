import axios from "axios";
import { useState } from "react";



type Props = {
    setMessages:any;
};


export const Header = ({setMessages} :  Props) => {

    const [reset, setReset] = useState(false)

    const resetConversation = async () => {
        setReset(true);

        await axios.get("localhost").then((res) => {
            if(res.status == 200){
            setMessages([]);
        } else {
            console.log('there was an error with the API request to the backend')
        }
    })
        


    return(
        <div className="flex justify-between items-center w-full p-4 bg-gray-900 text-white font-bold shadow">
            <div className="italic">Rachel</div>
            <button 
            className={
                "transition-all duration-300 text-blue-300 hover:text-pink-500" + (reset && "animate-pulse")
            }
            onClick={resetConversation}>
            </button>
        </div>
    )
}
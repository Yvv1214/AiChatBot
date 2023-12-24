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
        <div>
            title
        </div>
    )
}
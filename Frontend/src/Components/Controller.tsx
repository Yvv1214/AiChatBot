import {useState} from "react";
import { Header } from "./Header";
import { Microphone } from "../assets/Microphone";



export const Controller = () => {
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState<any[]>([])

    const createBlobUrl = (data: any) => {};

    const stopRecording = async () => {};



    return(
        <div className="h-screen overflow-y-hidden">
            <Header setMessages={setMessages}/>
            <div className="flex flex-col justify-between h-full overflow-y-scroll pb-96">
                woedfss to seee
                <div className="fixed bottom-0 w-full py-6 text-center bg-gradient-to-r from-blue-700 to-purple-700	">
                   <div className="flex justify-center items-center w-full ">
                        <Microphone  stopRecording={stopRecording}/>
                   </div> 
                </div>
                
            </div>
        </div>
    )

}
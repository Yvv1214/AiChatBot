import {useState} from "react";
import { Header } from "./Header";



export const Controller = () => {
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState<any[]>([])

    const createBlobUrl = (data: any) => {}

    const stopRecording = async () => {}



    return(
        <div className="h-screen overflow-y-hidden">
            <Header setMessages={setMessages}/>
            <div className="flex flex-col justify-between h-full overflow-y-scroll pb-96">
                woedfss to seee
            </div>
        </div>
    )

}
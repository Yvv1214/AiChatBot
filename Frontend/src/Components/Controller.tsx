import {useState} from "react";
import { Header } from "./Header";
import { Microphone } from "./Microphone";
import axios from "axios";




export const Controller = () => {
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState<any[]>([])


    const createBlobUrl = (data: any) => {
        const blob = new Blob([data], {type: 'audio/mpeg'});
        const url = window.URL.createObjectURL(blob);
        return url;
    };


    const stopRecording =  async(blobUrl: string) => {
        setLoading(true)
        //append recorded message
        const myMessage = {sender: 'me', blobUrl}
        const messageArray = [...messages, myMessage]

        //convert blob url to blob object
        fetch(blobUrl)
            .then((res) => res.blob())
            .then(async (blob) => {
                //construct audio to send file
                const formData =  new FormData();
                formData.append('file', blob, 'myfile.wav');

                // send form data to API endpoint
                await axios.post('http://localhost:8000/chatBot', formData, {
                    headers:{'Content-Type': 'audio/mpeg'},
                    responseType: 'arraybuffer',
                })
                .then((res: any) => {
                    const blob = res.data;
                    const audio = new Audio();
                    audio.src = createBlobUrl(blob);

                    //Append to audio
                    const botMessage = {sender:'rachel', blobUrl: audio.src};
                    messageArray.push(botMessage);
                    setMessages(messageArray);
                })

                .catch((error: string) => {
                    console.log(error)
                })
            })

        setLoading(false)

    }



    return(
        <div className="h-screen overflow-y-hidden">
            <Header setMessages={setMessages}/>
            <div className="flex flex-col justify-between h-full overflow-y-scroll pb-96">
                {/* conversation  */}
                <div>
                    {messages.map((audio, index) => {
                        return( 
                        <div 
                            key={index + audio.sender} 
                            className={"flex flex-col " + (audio.sender == 'rachel' && 'flex items-end')}>
                            {/* sender */}
                            <div className="mt-4">
                                <p className={audio.sender == 'rachel' 
                                ? 'text-right mr-2 italic text-green-500' 
                                : 'ml-2 italic text-blue-500'}>
                                    {audio.sender}
                                </p>

                            {/* audio message */}
                            <audio 
                            src={audio.blobUrl} 
                            className="appearance-none" 
                            controls/>

                            </div>
                        </div>)
                    })}

                    {messages.length ==  0 && !loading && (
                        <div className="text-center font-light italic mt-10">
                            Send Rachel a message...
                        </div>
                    )}

                    {loading && messages.length > 0 && (
                        <div  className="text-center font-light italic mt-10 animate-pulse">
                            Gimme a few seconds...
                        </div>
                    )}
                </div>

                <div className="fixed bottom-0 w-full py-6 text-center bg-gradient-to-r from-blue-700 to-purple-700	">
                    
                   <div className="flex justify-center items-center w-full ">
                        <Microphone  stopRecording={stopRecording}/>
                   </div> 
                </div>
                
            </div>
        </div>
    )

}
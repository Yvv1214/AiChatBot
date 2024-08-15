import { useState } from "react";
import { Header } from "./Header";
import { Microphone } from "./Microphone";
import axios from "axios";
import { useEffect } from "react";




export const Controller = () => {
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState<any[]>([])
    const [apiKey, setApiKey] = useState<string | null>(null);


    useEffect(() => {
        // Retrieve API key from local storage
        const storedApiKey = localStorage.getItem("openai-api-key");
        if (storedApiKey) {
            setApiKey(storedApiKey);
        }
    }, []);


    const createBlobUrl = (data: any) => {
        const blob = new Blob([data], { type: 'audio/mpeg' });
        const url = window.URL.createObjectURL(blob);
        return url;
    };


    const stopRecording = async (blobUrl: string) => {
        try {
            setLoading(true);

            // append recorded message
            const myMessage = { sender: 'me', blobUrl };
            const messageArray = [...messages, myMessage];

            // convert blob url to blob object
            const blob = await fetch(blobUrl).then((res) => res.blob());

            // construct audio to send file
            const formData = new FormData();
            formData.append('file', blob, 'myfile.wav');

            //check for api key
            if (!apiKey) {
                throw new Error("API key not found. Please submit your API key.");
              }

            // send form data to API endpoint
            const response = await axios.post('http://localhost:8000/chatBot', formData, {
                headers: { 'Content-Type': 'audio/mpeg',
                            "Authorization": 'Bearer ${apiKey}'
                         },
                responseType: 'arraybuffer',
            });

            const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });

            // create Blob URL for the recorded audio
            const audioBlobUrl = createBlobUrl(audioBlob);

            // Append to audio
            const botMessage = { sender: 'rachel', blobUrl: audioBlobUrl };
            messageArray.push(botMessage);
            setMessages(messageArray);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
            console.log('loading', loading);
            console.log(messages);
        }
    };



    return (
        <div className="h-screen overflow-y-hidden">
            <Header setMessages={setMessages} />
            <div className="flex flex-col justify-between h-full overflow-y-scroll pb-96">
                {/* conversation  */}
                <div>
                    {messages.map((audio, index) => {
                        return (
                            <div
                                key={index + audio.sender}
                                className={"flex flex-col " + (audio.sender == 'rachel' && 'flex items-end')}>
                                {/* sender */}
                                <div className="m-4">
                                    <p className={audio.sender == 'rachel'
                                        ? 'text-right mr-2 italic text-green-500'
                                        : 'ml-2 italic text-blue-500'}>
                                        {audio.sender}
                                    </p>

                                    {/* audio message */}
                                    <audio
                                        src={audio.blobUrl}
                                        className="appearance-none"
                                        controls />

                                </div>
                            </div>)
                    })}

                    {loading && (
                        <div className="text-center font-light italic mt-10 animate-pulse">
                            Gimme a few seconds...
                        </div>
                    )}

                    {messages.length == 0 && !loading && (
                        <div className="text-center font-light italic mt-10">
                            Send Rachel a message...
                        </div>
                    )}


                </div>

                <div className="fixed bottom-0 w-full py-6 text-center bg-gradient-to-r from-blue-700 to-purple-700	">

                    <div className="flex justify-center items-center w-full ">
                        <Microphone stopRecording={stopRecording} />
                    </div>
                </div>

            </div>
        </div>
    )

}
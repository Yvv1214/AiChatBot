import React from 'react'
import { ReactMediaRecorder } from 'react-media-recorder'


type Props = {
    stopRecording: any;
}


export const Microphone = ({stopRecording}: Props) => {



    return(
        <ReactMediaRecorder
        audio
        onStop={stopRecording}
        render={({status, startRecording, stopRecording}) => 
        <div className='mt-2'>
            <button 
            onMouseDown={startRecording} 
            onMouseUp={stopRecording}
            className='bg-white text-black p-4 rounded-full'>btn</button>
        </div>}
        />
    )
}
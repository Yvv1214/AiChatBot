import { ReactMediaRecorder } from 'react-media-recorder'
import { RecordIcon } from './RecordIcon'


type Props = {
    stopRecording: any;
}


export const Microphone = ({stopRecording}: Props) => {



    return(
        <ReactMediaRecorder
        audio
        onStop={stopRecording}
        render={({status, startRecording, stopRecording}) => (
        <div className='mt-2'>
            <button 
            onMouseDown={startRecording} 
            onMouseUp={stopRecording}
            className='bg-white text-black p-4 rounded-full'>
                <RecordIcon classText={status == 'recording' ? 'animate-pulse text-red-500' : 'text-sky-500'}/>
            </button>
            <p className='mt-2  text-white font-light'>{status}</p>
        </div>
        )}
        />

        
    )
}

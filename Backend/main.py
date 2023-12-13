#unicorn main:app --reload

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
import openai


#custom functions imports
from functions.openai_requests import convert_audio_to_text, get_chat_response 
from functions.database import store_messages, clear_chat
from functions.text_to_speech import convert_text_to_speech


#initiate app
app = FastAPI()

# CORS - Origins what domains u accept into backend
origins = [
    "http://localhost:5173"
    "http://localhost:5174"
    "http://localhost:4173"
    "http://localhost:4174"
    "http://localhost:3000"
]


# CORS - Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/reset")
async def reset_chat():
    clear_chat()
    return {"message": "chat has been cleared"}


# Post bot response 
# Note not playing in browser when using post
@app.post('/post-audio')
async def post_audio(file: UploadFile = File(...)):
    print('postssss')
    return{'message': 'postss'}



# GET AUDIO, TRANSCRIBE IT, GET BOT RESPONSE, AND SAVE CHAT
@app.get('/get-audio')
async def get_audio():

    #Get Audio
    audio_input = open("Voice.mp3", 'rb')

    #Transcribe Audio
    message_transcribed = convert_audio_to_text(audio_input)
    if not message_transcribed:
        return HTTPException(status_code=400, detail='failed to transcribe audio')

    #get chatGPT response
    chat_response = get_chat_response(message_transcribed)
    if not chat_response:
        return HTTPException(status_code=400, detail='failed to get response')

    #store the messages
    store_messages(message_transcribed, chat_response)
    print(message_transcribed)
    print(chat_response)
    
    #convert response to audio
    audio_output = convert_text_to_speech(chat_response)
    if not audio_output:
        return HTTPException(status_code=400, detail='failed to get Eleven labs audio response')
    
    # create a generator that yields chunks of data
    def iterfile():
        yield audio_output
    
    #return audio file
    
    return StreamingResponse(iterfile(), media_type="audio/mpeg")
    
    
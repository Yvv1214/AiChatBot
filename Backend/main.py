from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
import openai
import requests
import json
import requests
from pathlib import Path


#retrieve enviremental variables
openai.organization = config('OPEN_AI_ORG')
openai.api_key = config('OPEN_AI_KEY')
ELEVEN_LABS_API_KEY = config("ELEVEN_LABS_API_KEY")


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



# GET AUDIO, TRANSCRIBE IT, GET BOT RESPONSE, AND SAVE CHAT
@app.post('/post-audio')
async def post_audio(file: UploadFile = File(...)):

    #Get Audio
    audio_input = open("Voice.mp3", 'rb')
    #get audio from frontend
    # with open(file.filename, "wb") as buffer:
    #     buffer.write(file.file.read())
    # audio_input = open(file.filename, "rb")

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
        return HTTPException(status_code=400, detail='failed to get openai audio response')
    
    # create a generator that yields chunks of data
    def iterfile():
        yield audio_output
    
    #return audio file
    
    return StreamingResponse(iterfile(), media_type="audio/mpeg")






@app.post("/chatBot")
async def post_audio():

#Transcribe audio to text
    audio_file = open("Voice.mp3", "rb")   

    transcript = openai.audio.transcriptions.create(
    model="whisper-1",
    file = audio_file,
    response_format="text"
    )
    print(transcript)
    if not transcript:
        return HTTPException(status_code=400, detail='failed to transcribe audio')


#Get chatBot response
    completion = openai.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
    {"role": "system", "content": "You are an assistant. Your name is Rachel. Keep your answers under 30 words."},
    {"role": "user", "content": transcript}
        ]
    )

    print(completion.choices[0].message)
    if not completion:
        return HTTPException(status_code=400, detail='failed to get openai response')

#Convert response to audio
    text = str(completion.choices[0].message)

    audio = openai.audio.speech.create(
    model="tts-1",
    voice="alloy",
    response_format="mp3",
    input= text
    )

    audio.stream_to_file("audio.mp3")

    if not audio:
        return HTTPException(status_code=400, detail='failed to get openai response audio')
    
    #return audio file

    with open("audio.mp3", "wb") as file:
        file.write(audio.content)

    return FileResponse("audio.mp3", media_type="audio/mpeg")


    
    
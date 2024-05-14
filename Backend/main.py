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
    "http://localhost:8000"
]


# CORS - Middleware
#in the `allow_origins` parameter, you can specify the origins (URLs) from which you want to allow requests.
app.add_middleware(
    CORSMiddleware,
    allow_origins='http://localhost:5173',
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/reset")
async def reset_chat():
    clear_chat()
    return {"message": "chat has been cleared"}






@app.post("/chatBot")
async def post_audio(file:UploadFile = File(...)):

#Transcribe audio to text
    # audio_file = open("Voice.mp3", "rb")

#Get speech audio from frontend 
    with open(file.filename, "wb") as buffer:
        buffer.write(file.file.read())
    audio_file = open(file.filename, "rb")


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

    print(completion.choices[0].message.content)
    if not completion:
        return HTTPException(status_code=400, detail='failed to get openai response')

#Convert response to audio
    text = str(completion.choices[0].message.content)

    audio = openai.audio.speech.create(
    model="tts-1",
    voice="alloy",
    response_format="mp3",
    input= text
    )

    audio.stream_to_file("audio.mp3")

    if not audio:
        return HTTPException(status_code=400, detail='failed to get openai response audio')
    
#Store messages
    store_messages(transcript,text)
    
#return audio file

    with open("audio.mp3", "wb") as file:
        file.write(audio.content)

    return FileResponse("audio.mp3", media_type="application/octet-stream")


    
    
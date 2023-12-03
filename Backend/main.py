#unicorn main:app --reload

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
import openai


#custom functions imports
from functions.openai_requests import convert_audio_to_text


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


@app.get("/test")
async def root():
    print('changes')
    return {"message": "thiss command runs the backend and reload means it relaods on change and when u refresh it will update command uvicorn main:app --reload"}


# Post bot response 
# Note not playing in browser when using post
@app.post('/post-audio')
async def post_audio(file: UploadFile = File(...)):
    print('postssss')
    return{'message': 'postss'}



# Get Audio
@app.get('/get-audio')
async def get_audio():

    #Get Audio
    audio_input = open("Voice.mp3", 'rb')

    #Transcribe Audio
    message_transcribed = convert_audio_to_text(audio_input)
    print(message_transcribed)
    return "done"
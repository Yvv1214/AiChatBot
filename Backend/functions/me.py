from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
import openai
import requests
from pathlib import Path


#retrieve enviremental variables
openai.organization = config('OPEN_AI_ORG')
openai.api_key = config('OPEN_AI_KEY')

from functions.database import get_messages


app = FastAPI()


@app.post("/chatBot")
async def post_audio():

# Get audio
    # audio_input = open("Voice.mp3", 'rb')

#Transcribe audio to text
    audio_file = open("Voice.mp3", "rb")   

    transcript = openai.audio.transcriptions.create(
    model="whisper-1",
    file = audio_file
    response_format="text"
    )
    print(transcript)

#Get chatBot response
    completion = openai.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
    {"role": "system", "content": "You are an assistant. Your name is Rachel. Keep your answers under 30 words."},
    {"role": "user", "content": transcript}
        ]
    )

    print(completion.choices[0].message)

#Convert response to audio
    speech_file_path = Path(__file__).parent / "speech.mp3"
    response = openai.audio.speech.create(
    model="tts-1",
    voice="alloy",
    input=completion
    )
    response.stream_to_file(speech_file_path)



import openai 
from decouple import config




#retrieve enviremental variables
openai.organization = config('OPEN_AI_ORG')
openai.api_key = config('OPEN_AI_KEY')



#open ai = whisper
#https://platform.openai.com/docs/api-reference/audio/createTranslation
#convert audio to text
def convert_audio_to_text(audio_file):
    try:
        transcribe = openai.audio.transcriptions.create(
            model='whisper-1', 
            file=audio_file,
            response_format="text"
            )
        
        return transcribe
    except Exception as e:
        print(e,'error')
        return 
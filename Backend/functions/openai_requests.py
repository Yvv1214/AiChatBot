import openai 
from decouple import config

#import function from database.py
from functions.database import get_messages


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
    

#Open ai ChapGPT get resopen to our message
def get_chat_response(message_input):
    messages = get_messages()
    user_message = {"role": "user", "content":message_input}
    messages.append(user_message)
    print(messages)

    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages = messages
        )
        
        message_text = response["choices"][0]["messages"]["content"]
        print(message_text)
        return message_text
    
    except Exception as e:
        print(e)
        return
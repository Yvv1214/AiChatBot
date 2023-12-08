import json
import random


#get recent messages
def get_messages():

    #Define file name and learn instructions for the bot
    #https://platform.openai.com/docs/guides/fine-tuning/preparing-your-dataset
    file_name = "stored_data.json",
    learn_instruction = {
        "role": "system",
        "content": "You are interviewing the user for a job as a retail assistant. Ask short questions that are relevant to the junior position. Your name is Rachel. Keep your answers under 30 words."
    }

    #initialize messages
    messages = []


    #add a random element 

    x = random.uniform(0,1)
    if x < 0.5:
        learn_instruction["content"]= learn_instruction + "Your response will include some dry humor"
    else: 
        learn_instruction["content"]
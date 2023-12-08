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
    #aichatbot would add humor 50% of the time

    x = random.uniform(0,1)
    if x < 0.5:
        learn_instruction["content"]= learn_instruction | "Your response will include some dry humor"
    else: 
        learn_instruction["content"]

    #append instructions to messages array
    messages.append(learn_instruction)

    #get last messages
    try:
        with open(file_name) as user_file:
            data = json.load(user_file)

            #append last 5 items of data if < 5 then get all item else get the previous 5
            if data:
                if len(data) < 5:
                    for item in data:
                        messages.append(item)
                else:
                    for item in data[-5:]:
                        messages.append(item)

    except Exception as e:
        print(e)
        pass

    #return the message
    return messages
import torch
import json 
from transformers import T5Tokenizer, T5ForConditionalGeneration, T5Config

text_str = ''



def run_summarization(text, summarySize):
    """
    :param text: Plain summary_text of long article
    :return: summarized summary_text
    """

    '''
    We already have a sentence tokenizer, so we just need 
    to run the sent_tokenize() method to create the array of sentences.
    '''
    # 1 Intialize Model
    model = T5ForConditionalGeneration.from_pretrained('t5-base')

    

    # 2 Intialize Tokenizer
    tokenizer = T5Tokenizer.from_pretrained('t5-base')
    device = torch.device('cpu')

    # 3 pre-processing : Append summarize keyword 
    preprocess_text = text.strip().replace("\n","")
    t5_prepared_Text = "summarize: "+preprocess_text

    print ("original text preprocessed: \n", preprocess_text)

    tokenized_text = tokenizer.encode(t5_prepared_Text, return_tensors="pt", max_length=2000).to(device)

    textWordCount = len(text.split())

    minLength = round(0.5 * textWordCount)
    maxLength = round(0.8 * textWordCount)
    if summarySize == "smaller":
        minLength = round(0.2 * textWordCount)
        maxLength = round(0.6 * textWordCount)

    print ("minLength: ", minLength)
    print ("maxLength: ", maxLength)

    # summmarize 
    summary_ids = model.generate(tokenized_text,
                                    num_beams=4,
                                    no_repeat_ngram_size=2,
                                    min_length=minLength,
                                    max_length=maxLength,
                                    early_stopping=True)
    

    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    print ("\n\nSummarized text: \n",summary)

    return summary


if __name__ == '__main__':
    result = run_summarization(text_str)
    print(result)
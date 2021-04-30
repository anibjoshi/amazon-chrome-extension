from app import app
import pandas as pd
import nltk
import numpy as np
import json
from nltk.tokenize import sent_tokenize,word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer, WordNetLemmatizer
import re
import operator
from sklearn.metrics.pairwise import cosine_similarity
import string
from gensim.summarization import summarize

# nltk.download('averaged_perceptron_tagger')

# nltk.download('vader_lexicon')
# nltk.download('punkt')
# nltk.download('stopwords')
# nltk.download('wordnet')
# nltk_stopwords= set(stopwords.words('english'))

class Prediction:

    def __init__(self):
        print("Calling prediction API")
    
    def generate_summary(self, reviews):
        # summary= summarize(reviews, ratio=0.01)
        gensim_summary= summarize(reviews, word_count=200)
        final_summary= self.format_summarization(gensim_summary)
        return final_summary
    
    def format_summarization(self,gensim_summary):

        summary=[]
        sentences=sent_tokenize(gensim_summary)
        for sentence in sentences:
            sentence= sentence.capitalize()
            summary.append(sentence)

        final_summary= ""
        for sentence in summary:
            final_summary= final_summary+ ' '+ sentence
        return final_summary
    
    def readContent(self, review_json):
        reviews = json.loads(review_json)
        df= pd.DataFrame.from_dict(reviews, orient='index')

        print('Reviews dataframe created')
        # df['reviewText']= df['reviewTitle'] + '. '+ df['reviewText']
        df['reviewDate']= df['reviewDate'].apply(lambda date:re.sub('Reviewed in the United States on ',"", date).strip())
        df['reviewRating']= df['reviewRating'].apply(lambda rating: re.sub(' out of 5 stars',"", rating).strip()) 
        df['reviewText']=df['reviewText'].str.encode('ascii', 'ignore').str.decode('ascii')
        df['reviewText']= df['reviewText'].apply(lambda review: review.lower())
        df['reviewText']= df['reviewText'].apply(lambda review: re.sub('\n', ' ', review))
        df['reviewText'] = df['reviewText'].apply(lambda review: re.sub(u"(\u2018|\u2019)", "'", review))

        # df['reviewTitle']= df['reviewTitle'].apply(lambda title: title.lower())

        df['reviewRating']= df.reviewRating.astype('float')
        df['reviewClass']=df.apply(lambda row: 1 if row.reviewRating>=4.0 else 0, axis=1)
        df['length']= df['reviewText'].apply(lambda review: len(review))

        number_of_positive_reviews =len(df[df['reviewClass']==1]['reviewText']) 
        number_of_negative_reviews =len(df[df['reviewClass']==0]['reviewText'])
        total_number_of_reviews=len(df['reviewText'])

        df=df[df['length']>100]
        df.reset_index(drop=True)
        
        print('Text cleaning done')
    
        reviews=df[df['reviewClass']==1]['reviewText']
        # number_of_positive_reviews =len(reviews) 
        positive_reviews=''
        for review in reviews:
            positive_reviews= positive_reviews+" "+review
        print('Positive reviews classified')

        reviews=df[df['reviewClass']==0]['reviewText']
        # number_of_negative_reviews =len(reviews)
        negative_reviews=''
        for review in reviews:
            negative_reviews= negative_reviews+" "+review
        print('Negative reviews classified')
        
        reviews= df['reviewText']
        # total_number_of_reviews=len(df['reviewText'])
        all_reviews=''
        for review in reviews:
            all_reviews= all_reviews+" "+review
        print('Positive, Negative reviews returned')

        return positive_reviews, negative_reviews, all_reviews, number_of_positive_reviews, number_of_negative_reviews,total_number_of_reviews

    def remove_punctuations(self, text):
        regex = re.compile('[' + re.escape(string.punctuation) + '\\r\\t\\n]')
        nopunctuated_text = regex.sub(" ", str(text))
        return nopunctuated_text

    def acceptable_tags_bigrams(self,bigram):
        first_type= ('JJ', 'VBZ', 'RB' )
        second_type= ('NN', 'JJ','VB')
        tags = nltk.pos_tag(bigram)
        if 'i' in bigram or 'much' in bigram or 'is' in bigram:
            return False
        if tags[0][1] in first_type and tags[1][1] in second_type:
            return True
        else:
            return False

    def acceptable_tags_trigrams(self, trigram):
        first_type= ('NN', 'RB','VB', 'JJ')
        second_type= ('IN', 'RB', 'DT', 'RB', 'JJ')
        third_type= ('NN', 'VBN','NN', 'RB', 'IN')
        tags = nltk.pos_tag(trigram)
        if 'i' in trigram or 'so' in trigram or 'is' in trigram or 'the' in trigram:
            return False
        if tags[0][1] in first_type and tags[1][1] in second_type and tags[2][1] in third_type:
            return True
        else:
            return False

    def get_keywords(self, review_comments):
        sentences= sent_tokenize(review_comments)
        cleaned_sentences= [ self.remove_punctuations(sentence) for sentence in sentences]
        review_comments_tokens= [word_tokenize(sentence) for sentence in cleaned_sentences]
        review_comments_tokens= [token for token_list in review_comments_tokens for token in token_list]
        print('Text prepping for keyword extraction done')

        bigram_finder= nltk.collocations.BigramCollocationFinder.from_words(review_comments_tokens)
        df_bigram_frequency = pd.DataFrame(bigram_finder.ngram_fd.items(), columns=['keywords','frequency']).sort_values(by='frequency', ascending=False)
        df_bigram_frequency.reset_index(inplace=True, drop=True)
        df_bigram_frequency['pos_tag']= df_bigram_frequency['keywords'].apply(lambda bigram: self.acceptable_tags_bigrams(bigram))
        bigram_keywords=df_bigram_frequency[df_bigram_frequency['pos_tag']== True][['keywords', 'frequency']][:10]
        # print('bigram_keywords',bigram_keywords)
        # bigram_keywords= bigram_keywords.to_json()

        print('Bigrams created')

        trigram_finder= nltk.collocations.TrigramCollocationFinder.from_words(review_comments_tokens)
        df_trigram_frequency = pd.DataFrame(trigram_finder.ngram_fd.items(), columns=['keywords','frequency']).sort_values(by='frequency', ascending=False)
        df_trigram_frequency.reset_index(inplace=True, drop=True)
        df_trigram_frequency['pos_tag']= df_trigram_frequency['keywords'].apply(lambda trigram: self.acceptable_tags_trigrams(trigram))
        trigram_keywords=df_trigram_frequency[df_trigram_frequency['pos_tag']== True][['keywords', 'frequency']][:10]
        # print('trigram_keywords',trigram_keywords)
        # trigram_keywords= trigram_keywords.to_json()
        print('Trigrams created')

        df_keywords= bigram_keywords.append(trigram_keywords).reset_index(drop=True)
        
        keywords= []
        for index in range(len(df_keywords)):
            keyword_tuple=df_keywords.loc[index]['keywords']
            clean_tuple= ' '.join(keyword_tuple)
            keyword_frequency= df_keywords.loc[index]['frequency']
            display_keyword= clean_tuple+ ' ('+ str(keyword_frequency)+')'
            keywords.append(display_keyword)
        
        # keywords= keywords.to_json()

        return json.dumps(keywords)
    


from youtube_blacklist import words



def find_single_words():
    words_list = words.split(",")
    single_words = []
    for word in words_list:
        t = word.lstrip()
        if t.isalpha():
            print(t)
            single_words.append(t)
        else:
            print("wtf")
    return single_words
    
# break_words()
# print(words_list)
find_single_words()
print(single_words)
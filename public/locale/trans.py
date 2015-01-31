import json 
from pprint import pprint
import urllib
import requests


tr=open('locale-en.json')
data = json.load(tr)
tr.close()

api_key = "AIzaSyDjc6ZctgLju0LyWXQCH9yiEPHg2ehk_RY"
src = "en"
dest = "ur"
keys = sorted(data.keys()) #All the keys
texts = [data[k] for k in keys] #All the values

print texts

#Encodes args into url
def encode(vect):
    url = ""
    for v in vect:
       url += "&q={}".format(urllib.quote(v))
    return url

url = "https://www.googleapis.com/language/translate/v2?key={}&source={}&target={}{}".format(api_key,src, dest, encode(texts) )
print url

outf = open("locale-foo.json", "w")

outf.write("{")
outf.write("\n")


r = requests.get(url)
#print r.json()
for i, t in enumerate(r.json()["data"]["translations"]):
    outf.write('    "')
    outf.write(keys[i])
    outf.write('": "')
    outf.write(t["translatedText"].encode("UTF-8"))
    outf.write('",')
    outf.write("\n")

outf.write("}")
outf.close()


#pprint()

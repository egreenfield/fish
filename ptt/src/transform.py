import tempfile
import os

from playsound import playsound
#from pydub import AudioSegment
import pydub


def transform(sourceFile,destFile):

    # amplify
    song = pydub.AudioSegment.from_mp3(sourceFile)
    #song = song + 13
    song = song + 5
    song = pydub.effects.speedup(song,1.2)
    song.export(destFile, format="mp3")
 
def testTransform():
    transform("raw.mp3","song.mp3")
    os.system('mpg321 -a b2 song.mp3')

if __name__ == "__main__":
    testTransform()
    

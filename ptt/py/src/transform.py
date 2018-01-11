#!/usr/bin/env python3
import pydub
import playSoundFile


def transform(sourceFile,destFile):

    # amplify
    #print("loading")
    song = pydub.AudioSegment.from_mp3(sourceFile)
    #song = song + 13
    print("amping")
    song = song + 5
    print("speeding")
    song = pydub.effects.speedup(song,1.2)
    print("writing")
    song.export(destFile, format="mp3")
 
def testTransform():
	outputFile = "../output/testTransform.mp3"
	transform("../output/raw.mp3",outputFile)
	#playSoundFile.play(outputFile)

if __name__ == "__main__":
    testTransform()
    

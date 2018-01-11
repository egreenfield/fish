#!/usr/bin/env python3
import boto3
import sys
import playSoundFile

from transform import transform

from playsound import playsound
#from pydub import AudioSegment
import pydub

def init(aws,outputDir):
    global polly
    global gOutputDir    
    polly = aws.client("polly",region_name='us-west-2')
    gOutputDir = outputDir


def tts(message,outputFile):
    global polly    

    filesize = 0
    print("fetching audio");
    response = polly.synthesize_speech(OutputFormat="mp3",Text=message,VoiceId="Brian");
    body = response['AudioStream']
    f = open(outputFile,"wb") # tempfile.NamedTemporaryFile(suffix="mp3")

    audio = body.read(1024*1024)
    while len(audio) > 0:
        f.write(audio)
        print("\tread ",len(audio)," bytes")
        filesize += len(audio)
        audio = body.read(1024*1024)
        
    print("audio file was ",filesize," bytes")
    f.close()

def say(message):
    global gOutputDir

    rawFile = gOutputDir + "/raw.mp3"
    outputFile = gOutputDir + "/output.mp3"

    tts(message,rawFile)
    print("transforming")
    transform(rawFile,outputFile)
    print("playing")
    playSoundFile.play(outputFile)

 

if __name__ == "__main__":
    aws = boto3.Session(profile_name='personal')
    init(aws,"../output")
    arguments = sys.argv[1:]
    message = "hello cruel world"
    if(len(arguments) > 0):
        message = arguments[0] 
    say(message=message)
    

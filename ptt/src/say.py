import boto3
import tempfile
import sys
import tempfile
import os
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
    response = polly.synthesize_speech(OutputFormat="mp3",Text=message,VoiceId="Brian");
    print("response is",response)
    body = response['AudioStream']
    f = open(outputFile,"wb") # tempfile.NamedTemporaryFile(suffix="mp3")

    audio = body.read(1024*1024)
    while len(audio) > 0:
        f.write(audio)
        print("\tread ",len(audio)," bytes")
        filesize += len(audio)
        audio = body.read(1024*1024)
        
    print("file was ",filesize," bytes")
    f.close()

def say(message):
    global gOutputDir

    rawFile = gOutputDir + "/raw.mp3"
    outputFile = gOutputDir + "/output.mp3"

    tts(message,rawFile)
    transform(rawFile,outputFile)

#    playsound(songName)
#    os.system('mpg123 -q song.mp3 &')
    # os.system('aplay -D bluealsa:HCI=hci0,DEV=FC:65:DE:0B:E3:2C,PROFILE=a2dp song.wav')
    cmd = "mpg321 -a b2 " + outputFile
    print("command is",cmd)
    os.system(cmd)
 

if __name__ == "__main__":
    aws = boto3.Session(profile_name='personal')
    init(aws,"../output")
    arguments = sys.argv[1:]
    message = "hello cruel world"
    if(len(arguments) > 0):
        message = arguments[0] 
    say(message=message)
    

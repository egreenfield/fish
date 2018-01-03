import boto3
import tempfile
import sys
import tempfile

from playsound import playsound
#from pydub import AudioSegment
import pydub

def init(aws):
    global polly    
    polly = aws.client("polly",region_name='us-west-2')

def say(message):
    global polly    

    filesize = 0
    response = polly.synthesize_speech(OutputFormat="mp3",Text=message,VoiceId="Brian");
    body = response['AudioStream']
    f = tempfile.NamedTemporaryFile(suffix="mp3")

    audio = body.read(1024*1024)
    while len(audio) > 0:
        f.write(audio)
        filesize += len(audio)
        audio = body.read(1024*1024)
        
    print("file was ",filesize," bytes")
    songName = f.name

    if 1:
        # amplify
        song = pydub.AudioSegment.from_mp3(f.name)
        louderSong = song + 13
        fasterSong = pydub.effects.speedup(louderSong,1)
        fasterSong.export("song.mp3", format="mp3")

        f.close()        
        songName = "song.mp3"

    playsound(songName)
    f.close()
 

if __name__ == "__main__":
    aws = boto3.Session(profile_name='personal')
    init(aws)
    arguments = sys.argv[1:]
    message = "hello cruel world"
    if(len(arguments) > 0):
        message = arguments[0] 
    say(message=message)
    
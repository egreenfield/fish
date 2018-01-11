import subprocess

def play(filename):
	cmd = "mpg321 -q -a alexa " + filename
	print("command is",cmd)
	subprocess.call(cmd,shell=True)
	#    playsound(songName)
    # os.system('aplay -D bluealsa:HCI=hci0,DEV=FC:65:DE:0B:E3:2C,PROFILE=a2dp song.wav')
    #os.system(cmd)

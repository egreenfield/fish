import boto3

aws = boto3.Session(profile_name='personal')
polly = aws.client("polly",region_name='us-west-2')

try:
    # Request the list of available lexicons
    response = polly.describe_voices()
except (BotoCoreError, ClientError) as error:
    # The service returned an error, exit gracefully
    print(error)
    sys.exit(-1)

# Get the list of lexicons in the response
voices = response.get("Voices", [])
print("{0} voices(s) found".format(len(voices)))

# Output a formatted list of lexicons with some of the attributes
for voice in voices:
    print((u" - {Name} ({Id}), "
           "{LanguageName}").format(**voice))

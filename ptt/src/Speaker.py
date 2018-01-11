import boto3

aws = boto3.Session(profile_name='personal')

sqs = aws.resource('sqs',region_name='us-west-2')

queue = sqs.get_queue_by_name(QueueName='fishTalk')

while 1:
    messages = queue.receive_messages(WaitTimeSeconds=5)
    for message in messages:
        print("Message received: {0}".format(message.body))
        message.delete()

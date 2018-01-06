import boto3
import sys

aws = boto3.Session(profile_name='personal')

sqs = aws.resource('sqs',region_name='us-west-2')

# Retrieving a queue by its name
queue = sqs.get_queue_by_name(QueueName='fishTalk')


arguments = sys.argv[1:]
message = arguments[0]


# Create a new message
response = queue.send_message(MessageBody=message)

# The response is not a resource, but gives you a message ID and MD5
print("MessageId created: {0}".format(response.get('MessageId')))
print("MD5 created: {0}".format(response.get('MD5OfMessageBody')))



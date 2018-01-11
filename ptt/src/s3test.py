import boto3

session = boto3.Session(profile_name='personal')
# Any clients created from this session will use credentials
# from the [dev] section of ~/.aws/credentials.
#s3 = session.client('s3')

# Let's use Amazon S3
s3 = session.resource('s3')

for bucket in s3.buckets.all():
    print(bucket.name)

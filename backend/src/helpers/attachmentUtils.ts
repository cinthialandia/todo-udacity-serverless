import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";

const XAWS = AWSXRay.captureAWS(AWS);

const s3 = new XAWS.S3({
  signatureVersion: "v4",
}) as AWS.S3;
const s3Bucket = process.env.ATTACHMENT_S3_BUCKET;
const s3UrlExpiration = process.env.SIGNED_URL_EXPIRATION;

const getAttachmentPresignedUrl = async (
  todoId: string,
  userId: string
): Promise<string> =>
  s3.getSignedUrl("putObject", {
    Bucket: s3Bucket,
    Key: `${todoId}-${userId}`,
    Expires: s3UrlExpiration,
  });

export const AttachmentUtils = { getAttachmentPresignedUrl };

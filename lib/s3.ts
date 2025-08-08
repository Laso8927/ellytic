import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const region = process.env.AWS_S3_REGION || "eu-central-1"; // Germany (Frankfurt) by default
const bucket = process.env.AWS_S3_BUCKET;

export const s3 = new S3Client({ region });

export async function uploadBufferToS3(params: {
  key: string;
  body: Buffer;
  contentType?: string;
}) {
  if (!bucket) throw new Error("Missing AWS_S3_BUCKET env");
  const { key, body, contentType } = params;
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );
  return { bucket, key, region };
}


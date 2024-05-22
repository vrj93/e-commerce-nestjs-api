import { S3 } from 'aws-sdk';
const getImageS3 = async (images: any): Promise<any> => {
  const region = process.env.AWS_BUCKET_REGION;
  const accessKey = process.env.AWS_ACCESS_KEY;
  const secretKey = process.env.AWS_SECRET_KEY;

  try {
    const s3 = new S3({
      region: region,
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    });

    const imageUrl = [];
    for (const image of images) {
      const params = {
        Bucket: 'e-commerce-nestjs-images',
        Key: `product/${image}`,
      };
      imageUrl.push(await s3.getSignedUrlPromise('getObject', params));
    }
    return imageUrl;
  } catch (err) {
    throw new Error(err);
  }
};

export default getImageS3;

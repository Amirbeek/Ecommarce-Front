import multiparty from 'multiparty';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';

const bucketName = 'amir-next-ecommerce';

export default async function upload(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const form = new multiparty.Form();
    try {
        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) reject(err);
                resolve({ fields, files });
            });
        });

        const client = new S3Client({
            region: 'eu-north-1',  // Update this to the correct region
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            },
        });
        console.log(client);
        const links = [];
        for (const file of files.file) {
            const ext = file.originalFilename.split('.').pop();
            const newFileName = `${Date.now()}.${ext}`;

            const fileContent = fs.readFileSync(file.path);
            const contentType = mime.lookup(file.path);

            const uploadParams = {
                Bucket: bucketName,
                Key: newFileName,
                Body: fileContent,
                ACL: 'public-read',
                ContentType: contentType,
            };

            const command = new PutObjectCommand(uploadParams);
            await client.send(command);

            const link = `https://${bucketName}.s3.amazonaws.com/${newFileName}`;
            console.log(link)
            links.push(link);
        }

        return res.status(200).json({ links });
    } catch (error) {
        console.error('Error uploading to S3:', error);
        return res.status(500).json({ error: 'Failed to upload to S3' });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};

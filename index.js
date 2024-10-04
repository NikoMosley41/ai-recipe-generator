import { Polly, S3 } from 'aws-sdk';

const polly = new Polly();
const s3 = new S3();

export async function handler(event) {
    try {
        // Extract text input from the event
        const text = event.text;
        
        // Specify parameters for Polly
        const params = {
            Text: text,
            OutputFormat: 'mp3',
            VoiceId: 'Joanna' // You can change this to the desired voice
        };

        // Synthesize speech using Polly
        const data = await polly.synthesizeSpeech(params).promise();

        // Generate a unique key for the audio file
        const key = `audio-${Date.now()}.mp3`;

        // Specify parameters for S3
        const s3Params = {
            Bucket: 'polly-audio-files-storage-niko', // Replace with your S3 bucket name
            Key: key,
            Body: data.AudioStream,
            ContentType: 'audio/mpeg'
        };

        // Upload audio file to S3
        await s3.upload(s3Params).promise();

        const outputMessage = `The audio file has been successfully stored in the S3 bucket by the name ${key}`;

        return {
            statusCode: 200,
            body: JSON.stringify({ message: outputMessage })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' })
        };
    }
}
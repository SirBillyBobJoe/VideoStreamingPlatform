import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, uploadProcessedVideo } from './storage';
import { setupDirectories } from './storage';


setupDirectories();

const app = express();
app.use(express.json());

app.on('error', (err) => {
  console.error('Server error:', err);
});

app.post('/process-video', async (req, res) => {
  //get the bucket and filename from the Cloud Pub/Sub message
  let data;
  try {

    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
    data = JSON.parse(message);
    if (!data.name) {
      throw new Error('Invalid message payload recieved.');
    }

  } catch (error) {
    console.error(error);
    return res.status(400).send('Bad Request: missing filename.');
  }

  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;

  //Download the raw video from Cloud storage
  await downloadRawVideo(inputFileName);

  //convert to 360p
  try {
    await convertVideo(inputFileName, outputFileName);
  } catch (err) {
    deleteVideos(outputFileName, inputFileName);

    console.error(err);
    return res.status(500).send('Internal Server Error: video processing failed.');
  }

  //upload video to Cloud Storage
  await uploadProcessedVideo(outputFileName);

  deleteVideos(outputFileName, inputFileName);

  return res.status(200).send('Processing completed successfully');
});

//delete the Videos and clean up so we save space
async function deleteVideos(outputFileName: string, inputFileName: string) {
  await Promise.all([
    deleteProcessedVideo(outputFileName),
    deleteRawVideo(inputFileName)
  ]);
}

app.get('/test', (req, res) => {
  res.send('Test successful!');
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

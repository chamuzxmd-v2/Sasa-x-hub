const express = require('express');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const mongoose = require('mongoose');
const ffmpeg = require('fluent-ffmpeg');
const Video = require('../models/Video');
const { auth, ageVerified } = require('../middleware/auth');
const router = express.Router();

// GridFS Storage
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = `video_${Date.now()}_${file.originalname}`;
      resolve({ filename, bucketName: 'videos' });
    });
  }
});

const upload = multer({ storage });

// Upload video
router.post('/upload', auth, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, tags, category } = req.body;
    
    const video = new Video({
      title,
      description,
      tags: tags.split(','),
      category,
      videoId: req.files.video[0].id,
      thumbnailId: req.files.thumbnail?.[0]?.id,
      uploadedBy: req.user._id
    });

    // Process video with FFmpeg
    const videoPath = req.files.video[0].path;
    const outputPath = `./uploads/processed_${req.files.video[0].filename}`;
    
    ffmpeg(videoPath)
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .size('1280x720')
      .on('end', async () => {
        await video.save();
        res.json({ message: 'Video uploaded and processing started', videoId: video._id });
      })
      .run();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get popular videos
router.get('/popular', async (req, res) => {
  const videos = await Video.find({ status: 'approved', ageVerified: true })
    .populate('uploadedBy', 'username avatar')
    .sort({ views: -1 })
    .limit(20);
  res.json(videos);
});

// Get video stream
router.get('/stream/:videoId', async (req, res) => {
  const { videoId } = req.params;
  const bucket = mongoose.connection.db.collection('fs.files');
  const files = await bucket.find({ _id: new mongoose.Types.ObjectId(videoId) }).toArray();
  
  if (files.length === 0) {
    return res.status(404).json({ error: 'Video not found' });
  }

  const readstream = mongoose.connection.db.collection('fs.chunks').find({
    files_id: files[0]._id
  }).sort({ n: 1 });

  res.writeHead(200, {
    'Content-Type': 'video/mp4',
    'Accept-Ranges': 'bytes',
    'Content-Length': files[0].length
  });

  readstream.pipe(res);
});

module.exports = router;

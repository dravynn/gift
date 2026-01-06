import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { loadGifts, saveGifts, addGift, matchGifts } from './lib/gifts.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({methods: ['DELETE', 'GET', 'PUT', 'POST'], origin: '*'}));
app.use(express.json())

// Ensure images directory exists
const imagesDir = path.join(__dirname, 'images')
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
}

// Serve uploaded images
app.use('/images', express.static(imagesDir))

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'gift-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (extname && mimetype) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'))
    }
  }
})

// Get all gifts
app.get('/api/gifts', (req, res) => {
  try {
    const gifts = loadGifts()
    res.json({ gifts })
  } catch (error) {
    res.status(500).json({ error: 'Failed to load gifts' })
  }
})

// Get gift suggestions based on friend info
app.get('/api/suggest-gifts', (req, res) => {
  try {
    const { sex, age, national, job } = req.query

    if (!sex || !age || !national || !job) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    const friendInfo = {
      sex: sex.toString(),
      age: parseInt(age),
      national: national.toString(),
      job: job.toString(),
    }

    const gifts = matchGifts(friendInfo)
    res.json({ gifts })
  } catch (error) {
    res.status(500).json({ error: 'Failed to get suggestions' })
  }
})

// Add new gift with optional image upload
app.post('/api/gifts', upload.single('image'), (req, res) => {
  try {
    const { name, description, price, gender, ageMin, ageMax, nationalities, jobs } = req.body

    if (!name || !description || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    let imagePath = null
    if (req.file) {
      imagePath = `/images/${req.file.filename}`
    } else if (req.body.imageUrl) {
      // Allow URL as fallback
      imagePath = req.body.imageUrl
    }

    const gift = {
      id: Date.now().toString(),
      name,
      description,
      price: parseFloat(price),
      image: imagePath || undefined,
      categories: {
        gender: gender ? gender.split(',').map(s => s.trim()).filter(Boolean) : undefined,
        ageRange: ageMin && ageMax
          ? { min: parseInt(ageMin), max: parseInt(ageMax) }
          : undefined,
        nationalities: nationalities
          ? nationalities.split(',').map(s => s.trim()).filter(Boolean)
          : undefined,
        jobs: jobs
          ? jobs.split(',').map(s => s.trim()).filter(Boolean)
          : undefined,
      },
    }

    addGift(gift)
    res.status(201).json({ success: true, gift })
  } catch (error) {
    console.error('Error adding gift:', error)
    res.status(500).json({ error: 'Failed to add gift' })
  }
})

// Delete gift
app.delete('/api/gifts/:id', (req, res) => {
  try {
    const { id } = req.params
    const gifts = loadGifts()
    const giftIndex = gifts.findIndex(g => g.id === id)

    if (giftIndex === -1) {
      return res.status(404).json({ error: 'Gift not found' })
    }

    const gift = gifts[giftIndex]
    
    // Delete associated image file if exists
    if (gift.image && gift.image.startsWith('/images/')) {
      const imagePath = path.join(imagesDir, path.basename(gift.image))
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath)
        }
      } catch (err) {
        console.error('Error deleting image file:', err)
      }
    }

    gifts.splice(giftIndex, 1)
    saveGifts(gifts)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete gift' })
  }
})

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`)
})


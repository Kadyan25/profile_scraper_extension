import express from 'express';
import { 
  scrapeProfile, 
  getAllProfiles, 
  getProfile, 
  deleteProfile 
} from '../controllers/scraper.controller.js';

const router = express.Router();


router.get('/profiles', getAllProfiles);

router.post('/scrape-profile', scrapeProfile);
router.get('/profiles/:id', getProfile);
router.delete('/profiles/:id', deleteProfile);

export default router;

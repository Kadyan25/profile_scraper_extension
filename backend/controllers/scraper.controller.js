import { detectPlatform } from '../utils/platform-detector.js';
import { scrapeLinkedIn } from '../scrapers/linkedin.scraper.js';
import { scrapeInstagram } from '../scrapers/instagram.scraper.js';
import Profile from '../models/Profile.model.js';

export const scrapeProfile = async (req, res) => {
  try {
    const { url, html } = req.body;

    if (!url || !html) {
      return res.status(400).json({
        error: 'Missing required fields: url and html',
        platform: null,
        data: null
      });
    }

    const platform = detectPlatform(url);

    if (!platform) {
      return res.status(400).json({
        error: 'Unsupported platform or invalid URL',
        platform: null,
        data: null
      });
    }

    let scrapedData;
    
    switch (platform) {
      case 'linkedin':
        scrapedData = scrapeLinkedIn(html, url);
        break;
      case 'instagram':
        scrapedData = scrapeInstagram(html, url);
        break;
      default:
        throw new Error('No scraper available for this platform');
    }

    // Build profile data based on platform
    const profileData = {
      platform,
      url,
      scrapedAt: new Date()
    };

    if (platform === 'linkedin') {
      profileData.name = scrapedData.name || null;
      profileData.headline = scrapedData.headline || null;
      profileData.location = scrapedData.location || null;
      profileData.about = scrapedData.about || null;
      profileData.followers = scrapedData.followers || 0;
      profileData.connections = scrapedData.connections || 0;
    } else if (platform === 'instagram') {
      profileData.username = scrapedData.username || null;
      profileData.followers = scrapedData.followers || 0;
      profileData.following = scrapedData.following || 0;
      profileData.posts = scrapedData.posts || 0;
    }

    const [savedProfile, created] = await Profile.upsert(profileData, {
      returning: true
    });

    console.log(`✅ Profile ${created ? 'created' : 'updated'} in database:`, savedProfile.id);

    res.json({
      platform,
      data: scrapedData,
      timestamp: savedProfile.scrapedAt,
      saved: true,
      profileId: savedProfile.id,
      isNew: created
    });

  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({
      error: error.message || 'Failed to scrape profile',
      platform: null,
      data: null
    });
  }
};

export const getAllProfiles = async (req, res) => {
  try {
    const { platform, limit = 50, page = 1 } = req.query;
    
    const offset = (page - 1) * limit;
    const where = platform ? { platform } : {};

    console.log('📊 Fetching profiles with:', { where, limit, offset });

    const { count, rows } = await Profile.findAndCountAll({
      where,
      order: [['scrapedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    console.log(`✅ Found ${count} total profiles, returning ${rows.length} rows`);

    res.json({
      profiles: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('❌ Error fetching profiles:', error);
    res.status(500).json({ 
      error: 'Failed to fetch profiles',
      message: error.message,
      profiles: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 50,
        pages: 0
      }
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    console.log('✅ Retrieved profile:', profile.id);
    res.json(profile);
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    res.status(500).json({ 
      error: 'Failed to fetch profile',
      message: error.message
    });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findByPk(req.params.id);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    await profile.destroy();

    console.log('✅ Profile deleted:', req.params.id);
    res.json({ 
      message: 'Profile deleted successfully', 
      profile 
    });
  } catch (error) {
    console.error('❌ Error deleting profile:', error);
    res.status(500).json({ 
      error: 'Failed to delete profile',
      message: error.message
    });
  }
};

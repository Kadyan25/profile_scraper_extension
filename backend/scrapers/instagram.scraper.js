import * as cheerio from 'cheerio';

export const scrapeInstagram = (html, url) => {
  try {
    const $ = cheerio.load(html);
    
    // Try multiple extraction methods
    let data = extractFromMetaTags($) || 
               extractFromScriptTag($) || 
               extractFromPageText($) ||
               getDefaultData();
    
    // Ensure username is extracted from URL if not found
    if (!data.username || data.username === 'N/A') {
      data.username = extractUsername(url);
    }

    return {
      url,
      username: data.username,
      followers: data.followers,
      following: data.following,
      posts: data.posts
    };
  } catch (error) {
    console.error('Instagram scraping error:', error);
    return {
      url,
      username: extractUsername(url),
      followers: 0,
      following: 0,
      posts: 0
    };
  }
};

// Method 1: Extract from meta tags (most reliable)
const extractFromMetaTags = ($) => {
  try {
    console.log('Trying meta tags extraction...');
    
    const ogTitle = $('meta[property="og:title"]').attr('content');
    const ogDescription = $('meta[property="og:description"]').attr('content');
    const twitterDescription = $('meta[name="twitter:description"]').attr('content');
    
    const description = ogDescription || twitterDescription;
    
    console.log('Meta og:title:', ogTitle);
    console.log('Meta description:', description);

    if (!description || description === 'N/A') {
      return null;
    }

    const data = {
      username: 'N/A',
      followers: 0,
      following: 0,
      posts: 0
    };

    // Extract username from title if available
    if (ogTitle) {
      const titleMatch = ogTitle.match(/\(@([^)]+)\)/);
      if (titleMatch) {
        data.username = titleMatch[1].trim();
      }
    }

    // Extract stats from description
    const followersMatch = description.match(/([\d,.]+[KMB]?)\s*Followers/i);
    const followingMatch = description.match(/([\d,.]+[KMB]?)\s*Following/i);
    const postsMatch = description.match(/([\d,.]+[KMB]?)\s*Posts/i);

    if (followersMatch) {
      data.followers = parseInstagramNumber(followersMatch[1]);
    }

    if (followingMatch) {
      data.following = parseInstagramNumber(followingMatch[1]);
    }

    if (postsMatch) {
      data.posts = parseInstagramNumber(postsMatch[1]);
    }

    console.log('Meta extraction result:', data);

    // Return if we got useful data
    if (data.followers > 0) {
      return data;
    }

    return null;
  } catch (error) {
    console.error('Error in meta tags extraction:', error);
    return null;
  }
};

// Method 2: Extract from JSON-LD script tags
const extractFromScriptTag = ($) => {
  try {
    console.log('Trying script tag extraction...');
    
    const scripts = $('script[type="application/ld+json"]');
    
    for (let i = 0; i < scripts.length; i++) {
      try {
        const scriptContent = $(scripts[i]).html();
        if (!scriptContent) continue;
        
        const jsonData = JSON.parse(scriptContent);
        
        if (jsonData && jsonData['@type'] === 'ProfilePage') {
          console.log('Found ProfilePage JSON-LD');
          return {
            username: jsonData.author?.alternateName || 'N/A',
            followers: 0,
            following: 0,
            posts: 0
          };
        }
      } catch (e) {
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error('Error in script tag extraction:', error);
    return null;
  }
};

// Method 3: Extract from page text (fallback)
const extractFromPageText = ($) => {
  try {
    console.log('Trying page text extraction...');
    
    const bodyText = $('body').text();
    
    const followersMatch = bodyText.match(/([\d,.]+[KMB]?)\s*followers/i);
    const followingMatch = bodyText.match(/([\d,.]+[KMB]?)\s*following/i);
    const postsMatch = bodyText.match(/([\d,.]+[KMB]?)\s*posts/i);

    if (followersMatch || followingMatch || postsMatch) {
      console.log('Found stats in page text');
      return {
        username: 'N/A',
        followers: followersMatch ? parseInstagramNumber(followersMatch[1]) : 0,
        following: followingMatch ? parseInstagramNumber(followingMatch[1]) : 0,
        posts: postsMatch ? parseInstagramNumber(postsMatch[1]) : 0
      };
    }

    return null;
  } catch (error) {
    console.error('Error in page text extraction:', error);
    return null;
  }
};

// Helper function to parse Instagram numbers (handles K, M, B suffixes)
const parseInstagramNumber = (numStr) => {
  if (!numStr) return 0;
  
  // Remove commas
  numStr = numStr.replace(/,/g, '');
  
  // Check for K, M, B suffixes
  const multipliers = {
    'K': 1000,
    'M': 1000000,
    'B': 1000000000
  };
  
  const suffix = numStr.slice(-1).toUpperCase();
  
  if (multipliers[suffix]) {
    const number = parseFloat(numStr.slice(0, -1));
    return Math.round(number * multipliers[suffix]);
  }
  
  return parseInt(numStr) || 0;
};

// Extract username from URL
const extractUsername = (url) => {
  try {
    const match = url.match(/instagram\.com\/([^\/\?]+)/);
    return match ? match[1] : 'N/A';
  } catch {
    return 'N/A';
  }
};

// Default data structure
const getDefaultData = () => {
  return {
    username: 'N/A',
    followers: 0,
    following: 0,
    posts: 0
  };
};

import * as cheerio from 'cheerio';

export const scrapeLinkedIn = (html, url) => {
  try {
    const $ = cheerio.load(html);
    
    const data = {
      url,
      name: extractName($),
      headline: extractHeadline($),
      location: extractLocation($),
      about: extractAbout($),
      followers: extractFollowers($),
      connections: extractConnections($)
    };

    console.log('✅ LinkedIn extraction result:', data);
    return data;
  } catch (error) {
    console.error('LinkedIn scraping error:', error);
    throw new Error('Failed to parse LinkedIn profile');
  }
};

const extractName = ($) => {
  try {
    const selectors = [
      'h1.text-heading-xlarge',
      'h1.inline.t-24.v-align-middle.break-words',
      '.pv-text-details__left-panel h1',
      'h1[class*="text-heading"]',
      'h1.top-card-layout__title'
    ];

    for (const selector of selectors) {
      const name = $(selector).first().text().trim();
      if (name) {
        console.log('Name extracted:', name);
        return name;
      }
    }
    
    // Fallback: search in meta tags
    const ogTitle = $('meta[property="og:title"]').attr('content');
    if (ogTitle) {
      const name = ogTitle.split('|')[0].trim();
      if (name) {
        console.log('Name from meta:', name);
        return name;
      }
    }
    
    console.log('Name not found');
    return 'N/A';
  } catch (error) {
    console.error('Error extracting name:', error);
    return 'N/A';
  }
};

const extractHeadline = ($) => {
  try {
    const selectors = [
      '.text-body-medium.break-words',
      '.pv-text-details__left-panel .text-body-medium',
      'div.text-body-medium[class*="break-words"]',
      '.top-card-layout__headline'
    ];

    for (const selector of selectors) {
      const headline = $(selector).first().text().trim();
      if (headline && headline.length > 10 && !headline.includes('Contact info')) {
        console.log('Headline extracted:', headline.substring(0, 50));
        return headline;
      }
    }
    
    // Fallback: from meta description
    const ogDescription = $('meta[property="og:description"]').attr('content');
    if (ogDescription) {
      const headline = ogDescription.split('|')[0].trim();
      if (headline && headline.length > 10) {
        console.log('Headline from meta:', headline.substring(0, 50));
        return headline;
      }
    }
    
    console.log('Headline not found');
    return 'N/A';
  } catch (error) {
    console.error('Error extracting headline:', error);
    return 'N/A';
  }
};

const extractLocation = ($) => {
  try {
    const selectors = [
      '.text-body-small.inline.t-black--light.break-words',
      '.pv-text-details__left-panel .text-body-small',
      'span.text-body-small[class*="break-words"]',
      '.top-card-layout__first-subline'
    ];

    for (const selector of selectors) {
      const location = $(selector).first().text().trim();
      if (location && !location.includes('Contact info') && !location.includes('connections')) {
        console.log('Location extracted:', location);
        return location;
      }
    }
    
    console.log('Location not found');
    return 'N/A';
  } catch (error) {
    console.error('Error extracting location:', error);
    return 'N/A';
  }
};

const extractAbout = ($) => {
  try {
    const selectors = [
      '#about ~ * .inline-show-more-text',
      '[data-generated-suggestion-target] .inline-show-more-text',
      '.pv-about-section .pv-about__summary-text',
      'section[data-section="summary"] .inline-show-more-text',
      '.pv-shared-text-with-see-more .inline-show-more-text span[aria-hidden="true"]',
      'div[class*="about"] .inline-show-more-text'
    ];

    for (const selector of selectors) {
      const about = $(selector).first().text().trim();
      if (about && about.length > 20) {
        console.log('About extracted:', about.substring(0, 100) + '...');
        return about;
      }
    }
    
    console.log('About not found');
    return 'N/A';
  } catch (error) {
    console.error('Error extracting about:', error);
    return 'N/A';
  }
};

const extractFollowers = ($) => {
  try {
    // Method 1: Look in body text
    const bodyText = $('body').text();
    const followerMatch = bodyText.match(/(\d+(?:,\d+)*)\s*followers?/i);
    
    if (followerMatch) {
      const count = parseInt(followerMatch[1].replace(/,/g, ''));
      console.log('Followers extracted:', count);
      return count;
    }
    
    // Method 2: Look for specific class patterns
    const followerElements = $('span:contains("follower"), span:contains("followers")');
    for (let i = 0; i < followerElements.length; i++) {
      const text = $(followerElements[i]).text();
      const match = text.match(/(\d+(?:,\d+)*)\s*follower/i);
      if (match) {
        const count = parseInt(match[1].replace(/,/g, ''));
        console.log('Followers from element:', count);
        return count;
      }
    }
    
    console.log('Followers not found');
    return 0;
  } catch (error) {
    console.error('Error extracting followers:', error);
    return 0;
  }
};

const extractConnections = ($) => {
  try {
    // Method 1: Look in body text
    const bodyText = $('body').text();
    const connectionMatch = bodyText.match(/(\d+(?:,\d+)*)\s*connections?/i);
    
    if (connectionMatch) {
      const count = parseInt(connectionMatch[1].replace(/,/g, ''));
      console.log('Connections extracted:', count);
      return count;
    }
    
    // Method 2: Look for "X connection" or "X+ connections"
    const connectionMatch2 = bodyText.match(/(\d+)\+?\s*connections?/i);
    if (connectionMatch2) {
      const count = parseInt(connectionMatch2[1]);
      console.log('Connections extracted (method 2):', count);
      return count;
    }
    
    // Method 3: Look for specific elements
    const connectionElements = $('span:contains("connection"), span:contains("connections")');
    for (let i = 0; i < connectionElements.length; i++) {
      const text = $(connectionElements[i]).text();
      const match = text.match(/(\d+(?:,\d+)*)\+?\s*connection/i);
      if (match) {
        const count = parseInt(match[1].replace(/,/g, ''));
        console.log('Connections from element:', count);
        return count;
      }
    }
    
    console.log('Connections not found');
    return 0;
  } catch (error) {
    console.error('Error extracting connections:', error);
    return 0;
  }
};

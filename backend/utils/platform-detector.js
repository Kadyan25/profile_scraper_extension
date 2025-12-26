const PLATFORM_PATTERNS = {
  linkedin: /^https:\/\/(www\.)?linkedin\.com\/in\/[^\/]+\/?$/,
  instagram: /^https:\/\/(www\.)?instagram\.com\/[^\/]+\/?$/
};

export const detectPlatform = (url) => {
  for (const [platform, pattern] of Object.entries(PLATFORM_PATTERNS)) {
    if (pattern.test(url)) {
      return platform;
    }
  }
  return null;
};

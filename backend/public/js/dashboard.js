let currentFilter = 'all';
let allProfiles = [];

document.addEventListener('DOMContentLoaded', () => {
  console.log('Dashboard loaded, fetching profiles...');
  loadProfiles();
  setupFilters();
});

async function loadProfiles() {
  try {
    showLoading();
    console.log('Fetching from /api/profiles...');
    
    const response = await fetch('/api/profiles?limit=100');
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Received data:', data);
    console.log('Number of profiles:', data.profiles?.length || 0);
    
    allProfiles = data.profiles || [];
    updateStats(allProfiles);
    displayProfiles(filterProfiles(allProfiles, currentFilter));
  } catch (error) {
    console.error('Error loading profiles:', error);
    showError('Failed to load profiles: ' + error.message);
  }
}

function setupFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      currentFilter = e.target.dataset.filter;
      console.log('Filter changed to:', currentFilter);
      displayProfiles(filterProfiles(allProfiles, currentFilter));
    });
  });
}

function filterProfiles(profiles, filter) {
  if (filter === 'all') return profiles;
  return profiles.filter(p => p.platform === filter);
}

function updateStats(profiles) {
  const linkedinCount = profiles.filter(p => p.platform === 'linkedin').length;
  const instagramCount = profiles.filter(p => p.platform === 'instagram').length;
  
  document.getElementById('totalProfiles').textContent = profiles.length;
  document.getElementById('linkedinCount').textContent = linkedinCount;
  document.getElementById('instagramCount').textContent = instagramCount;
  
  console.log('Stats updated - Total:', profiles.length, 'LinkedIn:', linkedinCount, 'Instagram:', instagramCount);
}

function displayProfiles(profiles) {
  const container = document.getElementById('profilesContainer');
  
  console.log('Displaying profiles:', profiles.length);
  
  if (profiles.length === 0) {
    container.innerHTML = '<div class="no-profiles">No profiles found. Start scraping profiles with the Chrome extension!</div>';
    return;
  }
  
  container.innerHTML = profiles.map(profile => createProfileCard(profile)).join('');
  
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const profileId = e.target.dataset.id;
      deleteProfile(profileId);
    });
  });
}

function createProfileCard(profile) {
  console.log('Creating card for profile:', profile);
  const platform = profile.platform;
  
  if (platform === 'linkedin') {
    return `
      <div class="profile-card">
        <span class="platform-badge linkedin">LinkedIn</span>
        <div class="profile-header">
          <div class="profile-name">${profile.name || 'N/A'}</div>
          <div class="profile-headline">${profile.headline || 'N/A'}</div>
        </div>
        <div class="profile-details">
          <div class="detail-row">
            <span class="detail-label">📍 Location</span>
            <span class="detail-value">${profile.location || 'N/A'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">👥 Followers</span>
            <span class="detail-value">${formatNumber(profile.followers || 0)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">🔗 Connections</span>
            <span class="detail-value">${formatNumber(profile.connections || 0)}</span>
          </div>
        </div>
        <div class="profile-actions">
          <button class="btn btn-view" onclick="window.open('${profile.url}', '_blank')">View Profile</button>
          <button class="btn btn-delete" data-id="${profile.id}">Delete</button>
        </div>
        <div class="timestamp">Scraped: ${new Date(profile.scrapedAt).toLocaleString()}</div>
      </div>
    `;
  } else if (platform === 'instagram') {
    return `
      <div class="profile-card">
        <span class="platform-badge instagram">Instagram</span>
        <div class="profile-header">
          <div class="profile-name">@${profile.username || 'N/A'}</div>
          <div class="profile-headline">Instagram Profile</div>
        </div>
        <div class="profile-details">
          <div class="detail-row">
            <span class="detail-label">👥 Followers</span>
            <span class="detail-value">${formatNumber(profile.followers || 0)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">👤 Following</span>
            <span class="detail-value">${formatNumber(profile.following || 0)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">📝 Posts</span>
            <span class="detail-value">${formatNumber(profile.posts || 0)}</span>
          </div>
        </div>
        <div class="profile-actions">
          <button class="btn btn-view" onclick="window.open('${profile.url}', '_blank')">View Profile</button>
          <button class="btn btn-delete" data-id="${profile.id}">Delete</button>
        </div>
        <div class="timestamp">Scraped: ${new Date(profile.scrapedAt).toLocaleString()}</div>
      </div>
    `;
  } else {
    console.warn('Unknown platform:', platform);
    return '';
  }
}

function formatNumber(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

async function deleteProfile(profileId) {
  if (!confirm('Are you sure you want to delete this profile?')) return;
  
  try {
    console.log('Deleting profile:', profileId);
    const response = await fetch(`/api/profiles/${profileId}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      console.log('Profile deleted successfully');
      loadProfiles();
    } else {
      const error = await response.json();
      console.error('Delete failed:', error);
      alert('Failed to delete profile: ' + error.error);
    }
  } catch (error) {
    console.error('Error deleting profile:', error);
    alert('Error deleting profile: ' + error.message);
  }
}

function showLoading() {
  document.getElementById('profilesContainer').innerHTML = '<div class="loading">Loading profiles...</div>';
}

function showError(message) {
  document.getElementById('profilesContainer').innerHTML = `<div class="no-profiles">❌ ${message}</div>`;
}

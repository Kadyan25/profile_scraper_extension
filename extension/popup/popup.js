const BACKEND_URL = 'http://localhost:3000/api/scrape-profile';

const SUPPORTED_URLS = {
  linkedin: /^https:\/\/www\.linkedin\.com\/in\/.+/,
  instagram: /^https:\/\/www\.instagram\.com\/[^\/]+\/?$/
};

document.getElementById('captureBtn').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  const resultDiv = document.getElementById('result');
  const captureBtn = document.getElementById('captureBtn');

  try {
    captureBtn.disabled = true;
    statusDiv.className = 'status info';
    statusDiv.textContent = 'Capturing page data...';
    resultDiv.classList.remove('show');

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url) {
      throw new Error('Unable to access current tab');
    }

    const isSupported = Object.values(SUPPORTED_URLS).some(regex => regex.test(tab.url));
    
    if (!isSupported) {
      statusDiv.className = 'status error';
      statusDiv.textContent = 'Unsupported page. Please navigate to a LinkedIn or Instagram profile page.';
      captureBtn.disabled = false;
      return;
    }

    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.documentElement.outerHTML
    });

    if (!results || !results[0] || !results[0].result) {
      throw new Error('Failed to capture page HTML');
    }

    const html = results[0].result;

    statusDiv.textContent = 'Sending data to backend...';

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: tab.url,
        html: html
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Backend request failed');
    }

    const data = await response.json();

    statusDiv.className = 'status success';
    statusDiv.textContent = `✓ Data extracted and saved to database!`;
    
    resultDiv.textContent = JSON.stringify(data.data, null, 2);
    resultDiv.classList.add('show');

  } catch (error) {
    statusDiv.className = 'status error';
    statusDiv.textContent = `Error: ${error.message}`;
    console.error('Error:', error);
  } finally {
    captureBtn.disabled = false;
  }
});

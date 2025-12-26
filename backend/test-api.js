const testLinkedIn = async () => {
  const sampleHTML = `
    <!DOCTYPE html>
    <html>
      <body>
        <h1 class="text-heading-xlarge">John Doe</h1>
        <div class="text-body-medium break-words">Software Engineer at Tech Company</div>
        <span class="text-body-small break-words">San Francisco, California</span>
        <div>500 followers</div>
        <div>300 connections</div>
      </body>
    </html>
  `;

  const response = await fetch('http://localhost:3000/api/scrape-profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://www.linkedin.com/in/johndoe',
      html: sampleHTML
    })
  });

  const data = await response.json();
  console.log('LinkedIn Test Result:', JSON.stringify(data, null, 2));
};

const testInstagram = async () => {
  const sampleHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="og:title" content="Jane Smith (@janesmith)">
        <meta property="og:description" content="1,234 Followers, 567 Following, 89 Posts - Travel blogger">
      </head>
      <body></body>
    </html>
  `;

  const response = await fetch('http://localhost:3000/api/scrape-profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: 'https://www.instagram.com/janesmith',
      html: sampleHTML
    })
  });

  const data = await response.json();
  console.log('Instagram Test Result:', JSON.stringify(data, null, 2));
};

// Run tests
console.log('Testing LinkedIn scraper...');
await testLinkedIn();

console.log('\nTesting Instagram scraper...');
await testInstagram();

console.log('\n✅ All tests completed!');

text
# Multi-Platform Profile Scraper

A full-stack web application that scrapes LinkedIn and Instagram profiles using a Chrome extension and displays the data in a beautiful dashboard. Built with Node.js, Express, MySQL, and Sequelize.

## 🚀 Features

### Supported Platforms
- ✅ **LinkedIn** - Extract name, headline, location, followers, and connections
- ✅ **Instagram** - Extract username, followers, following, and posts

### Core Functionality
- 🔍 Automatic platform detection
- 💾 MySQL database storage with Sequelize ORM
- 📊 Beautiful web dashboard with filtering
- 🎨 Responsive design with modern UI
- 🔄 Real-time data synchronization
- 🗑️ Profile management (view, delete)

## 📸 Screenshots

![Dashboard Overview](screenshots/dashboard.png)
*Main dashboard showing scraped profiles*

![LinkedIn Profile](screenshots/linkedin-card.png)
*LinkedIn profile card with extracted data*

![Instagram Profile](screenshots/instagram-card.png)
*Instagram profile card with stats*

![Chrome Extension](screenshots/extension.png)
*Chrome extension popup interface*

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MySQL (v8.0+)
- **ORM:** Sequelize
- **HTML Parser:** Cheerio

### Frontend
- **Dashboard:** Vanilla JavaScript, HTML5, CSS3
- **Extension:** Chrome Extension Manifest V3

### Architecture
- RESTful API design
- MVC pattern
- Modular scraper architecture
- Environment-based configuration

## 📋 Prerequisites

Before installation, ensure you have:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- **Google Chrome** browser
- **Git** (optional, for cloning)

## 🔧 Installation

### 1. Clone or Download the Project

git clone https://github.com/yourusername/profile-scraper.git
cd profile-scraper

text

Or download and extract the ZIP file.

### 2. Backend Setup

#### Install Dependencies

cd backend
npm install

text

#### Configure Environment

Create a `.env` file in the `backend` folder:

PORT=3000

MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=profile_scraper

text

**Important:** Replace `your_mysql_password_here` with your actual MySQL password!

#### Start MySQL

Make sure MySQL is running:

**Windows:**
net start MySQL80

text

**Mac/Linux:**
sudo systemctl start mysql

or
sudo service mysql start

text

#### Run the Server

npm start

text

You should see:
✅ Database 'profile_scraper' is ready
✅ MySQL connected successfully
✅ Database tables synchronized
🚀 Server running on http://localhost:3000
📊 Dashboard: http://localhost:3000/dashboard
🔍 API Profiles: http://localhost:3000/api/profiles

text

The database and tables will be created automatically!

### 3. Chrome Extension Setup

#### Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Navigate to and select the `extension` folder
5. The extension icon should appear in your Chrome toolbar

#### Pin the Extension (Optional)

- Click the puzzle piece icon in Chrome toolbar
- Find "Multi-Platform Profile Scraper"
- Click the pin icon to keep it visible

## 📖 Usage Guide

### Scraping LinkedIn Profiles

1. **Navigate to a LinkedIn profile**
   - Example: `https://www.linkedin.com/in/satyanadella/`
   - Make sure you're logged into LinkedIn

2. **Open the extension**
   - Click the extension icon in Chrome toolbar

3. **Capture the profile**
   - Click "Send Page to Backend" button
   - Wait for success message

4. **View in dashboard**
   - Open `http://localhost:3000/dashboard`
   - Your profile should appear instantly

### Scraping Instagram Profiles

1. **Navigate to an Instagram profile**
   - Example: `https://www.instagram.com/virat.kohli/`
   - Login to Instagram recommended for better results

2. **Open the extension**
   - Click the extension icon

3. **Capture the profile**
   - Click "Send Page to Backend" button
   - Wait for confirmation

4. **Check the dashboard**
   - Profile appears with username and stats

### Dashboard Features

#### Filter Profiles
- **All** - Show all scraped profiles
- **LinkedIn** - Show only LinkedIn profiles
- **Instagram** - Show only Instagram profiles

#### Profile Actions
- **View Profile** - Opens the original profile in a new tab
- **Delete** - Removes profile from database (with confirmation)

#### Refresh Data
- Click the **🔄 Refresh** button to reload all profiles

## 📁 Project Structure

profile-scraper-project/
├── backend/
│ ├── config/
│ │ └── database.js # Database configuration
│ ├── controllers/
│ │ └── scraper.controller.js # Request handlers
│ ├── models/
│ │ └── Profile.model.js # Sequelize Profile model
│ ├── routes/
│ │ └── scraper.routes.js # API routes
│ ├── scrapers/
│ │ ├── linkedin.scraper.js # LinkedIn scraping logic
│ │ └── instagram.scraper.js # Instagram scraping logic
│ ├── utils/
│ │ └── platform-detector.js # URL platform detection
│ ├── public/
│ │ ├── css/
│ │ │ └── dashboard.css # Dashboard styles
│ │ ├── js/
│ │ │ └── dashboard.js # Dashboard functionality
│ │ └── dashboard.html # Dashboard page
│ ├── .env # Environment variables (create this)
│ ├── package.json # Dependencies
│ └── server.js # Express server
├── extension/
│ ├── popup/
│ │ ├── popup.html # Extension UI
│ │ ├── popup.css # Extension styles
│ │ └── popup.js # Extension logic
│ ├── icons/
│ │ ├── icon16.png
│ │ ├── icon48.png
│ │ └── icon128.png
│ └── manifest.json # Extension configuration
└── README.md # This file

text

## 🔌 API Endpoints

### POST `/api/scrape-profile`
Scrape and save a profile to the database.

**Request Body:**
{
"url": "https://www.linkedin.com/in/username/",
"html": "<html>...</html>"
}

text

**Response:**
{
"platform": "linkedin",
"data": {
"name": "John Doe",
"headline": "Software Engineer",
"location": "San Francisco",
"followers": 1500,
"connections": 500
},
"saved": true,
"profileId": 1,
"isNew": true
}

text

### GET `/api/profiles`
Get all profiles with pagination and filtering.

**Query Parameters:**
- `platform` (optional): `linkedin` or `instagram`
- `limit` (optional): Number of results (default: 50)
- `page` (optional): Page number (default: 1)

**Example:**
GET /api/profiles?platform=linkedin&limit=20&page=1

text

**Response:**
{
"profiles": [...],
"pagination": {
"total": 45,
"page": 1,
"limit": 20,
"pages": 3
}
}

text

### GET `/api/profiles/:id`
Get a single profile by ID.

**Response:**
{
"id": 1,
"platform": "linkedin",
"url": "https://www.linkedin.com/in/username/",
"name": "John Doe",
"headline": "Software Engineer",
"followers": 1500,
"scrapedAt": "2025-12-26T10:30:00.000Z"
}

text

### DELETE `/api/profiles/:id`
Delete a profile by ID.

**Response:**
{
"message": "Profile deleted successfully",
"profile": {...}
}

text

## 🗄️ Database Schema

### `profiles` Table

| Field        | Type         | Description                          |
|--------------|--------------|--------------------------------------|
| id           | INTEGER      | Primary key (auto-increment)         |
| platform     | ENUM         | 'linkedin' or 'instagram'            |
| url          | STRING(500)  | Profile URL (unique)                 |
| name         | STRING(255)  | Full name (LinkedIn only)            |
| username     | STRING(255)  | Username (Instagram only)            |
| headline     | TEXT         | Professional headline (LinkedIn)     |
| location     | STRING(255)  | Location (LinkedIn)                  |
| about        | TEXT         | About section (LinkedIn)             |
| followers    | INTEGER      | Follower count (both platforms)      |
| connections  | INTEGER      | Connection count (LinkedIn)          |
| following    | INTEGER      | Following count (Instagram)          |
| posts        | INTEGER      | Post count (Instagram)               |
| scrapedAt    | DATE         | Timestamp of scraping                |
| createdAt    | DATE         | Record creation timestamp            |
| updatedAt    | DATE         | Record update timestamp              |

**Indexes:**
- Unique index on `url`
- Composite index on `(platform, scrapedAt)`

## ⚠️ Known Limitations

### Instagram Scraping
- **Display Name** and **Bio** may show as "N/A" because Instagram loads these fields dynamically via JavaScript after initial page load
- Username, followers, following, and posts counts are reliably extracted from meta tags
- This is a limitation of HTML-only scraping without browser automation (Puppeteer/Playwright)

### General Limitations
- Requires being logged into platforms for best results
- Rate limiting by platforms may affect scraping
- Some profiles may have privacy settings that prevent scraping
- HTML structure changes by platforms may break scrapers

## 🚧 Troubleshooting

### Backend won't start

**Issue:** `Cannot GET /api/profiles`
- **Solution:** Make sure you've run `npm install` in the backend folder

**Issue:** MySQL connection error
- **Solution:** Check your `.env` file has correct MySQL credentials
- Verify MySQL is running: `mysql -u root -p`

**Issue:** Port 3000 already in use
- **Solution:** Change `PORT` in `.env` to another port (e.g., 3001)

### Extension not working

**Issue:** "Unsupported page" message
- **Solution:** Make sure you're on a valid LinkedIn or Instagram profile page
- URL must match: `https://www.linkedin.com/in/username/` or `https://www.instagram.com/username/`

**Issue:** Extension not sending data
- **Solution:** Check backend is running on `http://localhost:3000`
- Open extension popup → Right-click → Inspect → Check Console for errors

### Dashboard is blank

**Issue:** No profiles showing
- **Solution:** Open browser console (F12) and check for errors
- Test API directly: `http://localhost:3000/api/profiles`
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

## 🔮 Future Enhancements

### Potential Features
- [ ] Twitter/X profile scraping
- [ ] GitHub profile scraping
- [ ] Batch scraping from profile lists
- [ ] Export data to CSV/JSON
- [ ] Profile comparison tool
- [ ] Historical tracking (track changes over time)
- [ ] Advanced search and filtering
- [ ] Profile tags and categories
- [ ] API authentication with JWT
- [ ] User accounts and multi-tenancy

### Technical Improvements
- [ ] Use Puppeteer for full JavaScript rendering
- [ ] Implement caching layer (Redis)
- [ ] Add profile update scheduling
- [ ] Implement rate limiting
- [ ] Add comprehensive test suite
- [ ] Docker containerization
- [ ] CI/CD pipeline
- [ ] Cloud deployment (AWS/Azure/GCP)


## 🙏 Acknowledgments

- Built with Node.js and Express.js
- Database powered by MySQL and Sequelize
- HTML parsing with Cheerio
- UI design inspired by modern web applications

---

**⭐ If you found this project helpful, please give it a star on GitHub!**

---

## Quick Start Commands

Backend setup
cd backend
npm install

Configure .env file
npm start

Load extension
Chrome → chrome://extensions/ → Load unpacked → Select 'extension' folder
Access dashboard
Open http://localhost:3000/dashboard
text

**Happy Scraping! 🚀**

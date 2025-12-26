import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  platform: {
    type: DataTypes.ENUM('linkedin', 'instagram'),
    allowNull: false,
    validate: {
      isIn: [['linkedin', 'instagram']]
    }
  },
  url: {
    type: DataTypes.STRING(500),
    allowNull: false,
    unique: true,
    validate: {
      isUrl: true
    }
  },
  // LinkedIn fields
  name: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'LinkedIn: Full name'
  },
  headline: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'LinkedIn: Professional headline'
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'LinkedIn: Location'
  },
  about: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'LinkedIn: About section'
  },
  connections: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'LinkedIn: Number of connections'
  },
  // Instagram fields
  username: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Instagram: Username'
  },
  following: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Instagram: Number following'
  },
  posts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Instagram: Number of posts'
  },
  // Common fields
  followers: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Follower count (both platforms)'
  },
  scrapedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'profiles',
  timestamps: true,
  indexes: [
    {
      fields: ['platform', 'scrapedAt']
    },
    {
      fields: ['url'],
      unique: true
    }
  ]
});

export default Profile;

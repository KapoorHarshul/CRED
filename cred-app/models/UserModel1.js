const { Sequelize, DataTypes } = require("sequelize");

// Create a Sequelize instance (adjust credentials as needed)
const sequelize = new Sequelize('cred_app_db', 'root', '7harshul77', {
  host: '127.0.0.1',
  dialect: 'mysql'
});

// Define the User model
const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  token: {
    type: DataTypes.STRING
  },
  resetToken: {
    type: DataTypes.STRING
  },
  resetTokenExpiry: {
    type: DataTypes.DATE
  }
}, {
  tableName: "users",
  timestamps: true
});

module.exports = { sequelize, User };

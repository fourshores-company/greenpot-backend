module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true
      },
      birthDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      addressLine1: {
        type: DataTypes.STRING,
        allowNull: true
      },
      addressLine2: {
        type: DataTypes.STRING,
        allowNull: true
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true
      },
      zip: {
        type: DataTypes.STRING,
        allowNull: true
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        isEmail: true,
        unique: true
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      googleId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true
      },
    },
    {}
  );
  User.associate = (models) => {
    User.belongsToMany(models.Role, {
      through: 'RoleUsers',
      as: 'roles',
      foreignKey: 'userId'
    });
  };
  return User;
};

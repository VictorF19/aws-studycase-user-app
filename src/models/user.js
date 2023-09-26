module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true 
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    picture: DataTypes.STRING
  });

  return User;
}
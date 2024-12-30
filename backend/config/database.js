const config = {
  mongoURI:
    process.env.MONGODB_URI ||
    "mongodb+srv://lasannavodya:DelLCS5EiIBT3jFu@course.uf2pi.mongodb.net/Task-app?retryWrites=true&w=majority&appName=Course",
  jwtSecret: process.env.JWT_SECRET || "wdbfiweufbiwebfwebf1243enlencewvw",
};

module.exports = config;

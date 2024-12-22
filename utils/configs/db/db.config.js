const mongoose = require('mongoose');

try {
    mongoose.connect(process.env.CONNECTION_STRING);
    console.log("DATABASE CONNECTED");
} catch (error) {
    console.log("error");
}
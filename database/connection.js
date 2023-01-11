const mongoose = require('mongoose');
global.objectID = mongoose.Types.ObjectId;

const url = `${process.env.MONGODB_URL}`;
// const url = "mongodb+srv://anshuman:anshuman@cluster0.m2zirw5.mongodb.net/?retryWrites=true&w=majority";
const options =  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};
module.exports.mongodb = async () =>{
        mongoose.connect(url,
        options,
        (error) => { error ? console.log('MongoDB connection Error: ', error) : console.log('DB connected')})
};


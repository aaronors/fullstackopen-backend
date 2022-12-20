const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
    .connect(url)
    .then((result) => {
        console.log("connected to MongoDB");
    })
    .catch((error) => {
        console.log("error connecting to MongoDB:", error.message);
    });

const personSchema = new mongoose.Schema({
    name:{
        type: String,
        minLength: 3,
        required: true
    },
    number:{
        type: String,
        minLength: 8,
        validate: {
            validator: (number) => {
                const parts = number.split("-");

                console.log("-- 0");
                if(parts.length > 2) return false;
                console.log("-- 1");
                if(parts[0].length < 2 || parts[0].length > 3) return false;
                console.log("-- 2");
                if(isNaN(parts[0]) || isNaN(parts[1])) return false;
                console.log("-- 3");

                return true;
            },
            message: "If number contains '-' the first part must be of length two or three and the second part must contain numbers"
        },
        required: true
    }
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Person", personSchema);

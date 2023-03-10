const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log(
        "Please provide the password as an argument: node mongo.js <password>"
    );
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fsoexercise:${password}@cluster0.dd3yloa.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model("Person", personSchema);

mongoose.set("strictQuery", true);
mongoose.connect(url);

if (process.argv.length == 5) {
    mongoose
        .connect(url)
        .then((result) => {
            console.log("connected");

            const person = new Person({
                name: process.argv[3],
                number: process.argv[4],
            });

            return person.save();
        })
        .then(() => {
            console.log(
                `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
            );
            return mongoose.connection.close();
        })
        .catch((err) => console.log(err));
} else {
    console.log("phonebook:");
    Person.find()
        .then((result) => {
            result.forEach((person) => {
                console.log(`${person.name} ${person.number}`);
            });
            mongoose.connection.close();
        });
}

// controller module
// handles requests from routes in routes/index.js
// example controller functions
// database operations would be done here

const getExample = (req, res) => {
    res.send("Example response from the controller");
}

const postExample = (req, res) => {
    const data = req.body;
    res.status(201).send({ message: "Data received", data });
}

module.exports = {
    getExample,
    postExample
};
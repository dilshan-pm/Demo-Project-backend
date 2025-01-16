const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const { Pool } = require("pg");


const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());



app.post("/verify-otp", (req, res) => {
    const { otp } = req.body;


    if (otp === "123456") {
        return res.status(200).json();
    } else {
        return res.status(403).json();
    }
});

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "school_db",
    password: "12345",
    port: 5432,
});

app.get("/subjects", async (req, res) => {
    try {
        console.log("fetching...");

        const result = await pool.query("SELECT * FROM subjects");

        console.log(result);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


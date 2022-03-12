import { Router } from "express";
require("dotenv").config();

const router = Router();

//load the booster JSON
//const booster = require("../boosterData.json");

// router.get("/", (req, res) => {
// 	//res.status(200).json(booster);
// 	//res.json({ message: "Hello, world!" });
// });

const { Pool } = require("pg");
const dbUrl = process.env.DATABASE_URL;

const pool = new Pool({
	connectionString: dbUrl,
	connectionTimeoutMillis: 5000,
	//ssl: { rejectUnauthorized: false },
});

router.get("/energisers", (req, res) => {
    console.log(dbUrl);
    //res.send("Hello");
    pool.query("SELECT * FROM energisers")
    .then((result) => {
        console.log(result);
        res.json(result.rows);
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    });
});

// Create a new energiser
router.post("/newEnergiser", function (req, res) {
	const title = req.body.title;
    const description = req.body.description;
    const link = req.body.link;

	pool
		.query("SELECT * FROM energisers WHERE title = $1", [title])
		.then((result) => {
			if (result.rows.length > 0) {
				return res
					.status(400)
					.send("An Energiser with the same title is already exists!");
			} else {
				pool
					.query(
						"INSERT INTO energisers (title, description, link) VALUES ($1, $2, $3)",
						[title, description, link]
					)
					.then((result) => res.json(result.rows))
					.catch((err) => {
                        console.log(err);
                        res.status(500).send(err);
                    });
			}
		});
});


router.get("/users", (req, res) => {
    console.log(dbUrl);
    //res.send("Hello");
    pool.query("SELECT * FROM users")
    .then((result) => {
        console.log(result);
        res.json(result.rows);
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    });
});

//SignUp

router.post("/signup", function (req, res) {
	const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

	pool
		.query("SELECT * FROM users WHERE email = $1", [email])
		.then((result) => {
			if (result.rows.length > 0) {
				return res
					.status(400)
					.send("A Email with the same address is already exists!");
			} else {
				pool
					.query(
						"Insert Into users (name, email, password) values ($1, $2, $3)",
						[
							name,
							email,
							password,
						]
					)
					.then((result) => res.json(result.rows))
					.catch((e) => console.error(e));
			}
		});
});


export default router;

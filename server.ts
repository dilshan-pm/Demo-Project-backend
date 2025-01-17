import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { DataSource } from "typeorm";
import "reflect-metadata";
import User from "./typeorm/src/entity/User";

console.log("Error");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.post("/verify-otp", (req: Request, res: Response): Response => {
  const { otp } = req.body;

  if (!otp) {
    return res.status(400).json();
  }

  if (otp === "123456") {
    return res.status(200).json();
  } else {
    return res.status(403).json();
  }
});

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "12345",
  database: "subject_db",
  synchronize: true,
  logging: true,
  entities: ["./typeorm/src/entity/User"],
  migrations: ["./typeorm/src/migration"],
});

AppDataSource.initialize()
  .then(() => {
    console.log("Connected to the database");

    app.get("/users", async (req: Request, res: Response): Promise<void> => {
      try {
        console.log("Fetching data...");

        const subjectRepository = AppDataSource.getRepository(User);

        const subjects = await subjectRepository.find();
        res.status(200).json(subjects);
      } catch (err) {
        console.error("Error fetching data:", (err as Error).message);
        res.status(500).send("Server Error");
      }
    });
  })
  .catch((error: Error) => {
    console.error("Database connection error:", error.message);
  });

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

const bodyParser = require("body-parser");
import "reflect-metadata";
import { AppDataSource } from "./data-source"
const cors = require('cors');
import express, { Request, Response } from "express";
import { log } from "console";
import User from "./entity/User";

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    const app = express();
    
    app.use(cors());

    app.use(express.json());
    app.use(bodyParser.json());

    // Create
  app.post('/users', async (req: Request, res: Response) => {
      console.log('Recieved pst Req');
      const { subject } = req.body;

      try {
        const userRepository = AppDataSource.getRepository(User);
        if (!userRepository) {
          throw new Error("Failed to load metadata for User entity.");
        }
        console.log('Repository:', userRepository); // Debug log
        
        const user = userRepository.create({ subject });
        console.log('Created user:', user); // Debug log
        
        const savedUser = await userRepository.save(user);
        console.log('Saved user:', savedUser); // Debug log

        return res.status(201).json(savedUser);
      } catch (err) {
        console.error("Full error:", err);
        return res.status(500).json({ error: "Failed to create user" ,
          details: err.message
        });
      }
    })

      //Read

      app.get('/users', async (_: Request, res: Response) => {
        
        
        // const user = new User()
        try {
          const userRepository = AppDataSource.getRepository(User);
          console.log('wvb,jbwjvb,b', userRepository)
          const users = await userRepository.find()

          if (!userRepository) {
            throw new Error("Failed to load metadata for User entity.");
           }
          console.log('Repository:', userRepository);
          
        
          return res.status(200).json(users);
        } catch (err) {
          console.error("Full error:", err);
          return res.status(500).json({ error: "Failed to create user" ,
            details: err.message
          });
        }
    });

  app.listen(5000, () => {
      console.log("Server is running at http://localhost:5000");
    });
  })
  .catch((error) => {
    console.error("Error during Data Source initialization:", error);
  })
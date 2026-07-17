import express from "express";
import subjectsRouter from "./routes/subjects";

const app = express();
const port = 8000;

app.use(express.json());

app.use('/api/subjects', subjectsRouter)

app.get("/", (_req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

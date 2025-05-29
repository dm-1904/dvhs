console.log("Starting server...");
import express from "express";
import mlsSearchRouter from "./mlsSearchRoute";

const app = express();

app.use(mlsSearchRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`MLS proxy is running on port ${PORT}`));

import express from "express";
import { run } from "./db/conn.js";
import { router } from "./routes/previsaoRoutes.js";

const app = express();

app.use("/", router);

await run();
app.listen(5000, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Aplicação rodando.....");
});

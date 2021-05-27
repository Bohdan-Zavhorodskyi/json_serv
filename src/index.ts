import express from "express";
import fileUpload from "express-fileupload";
import routes from "./routes";

const app = express();
const port = 8080;

app.use(fileUpload({}))
app.use(express.urlencoded({ extended: false }))

app.use("/health", routes.health);
app.use("/file", routes.file);

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

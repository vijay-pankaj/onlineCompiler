const express = require("express");
const cors = require("cors");

const runPython = require("./runners/runPython");
const runCpp = require("./runners/runCpp");
const runJava = require("./runners/runJava");
const runJS = require("./runners/runJS");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/run", async (req, res) => {
  const { code, language } = req.body;

  try {
    let output;

    if (language === "python") output = await runPython(code);
    else if (language === "cpp") output = await runCpp(code);
    else if (language === "java") output = await runJava(code);
    else if (language === "javascript") output = await runJS(code);

    res.json({ output });
  } catch (err) {
    res.json({ error: err.toString() });
  }
});

// app.listen(5000, () => console.log("Server running"));
app.listen(5000, "0.0.0.0", () => console.log("Server running"));
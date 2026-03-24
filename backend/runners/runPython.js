const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// container path
const containerDir = "/runners";

// host path (IMPORTANT)
const hostDir = "/home/ubuntu/onlineCompiler/backend/runners";

const runPython = (code) => {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(containerDir, { recursive: true });

    const fileName = `script_${Date.now()}.py`;
    const filePath = path.join(containerDir, fileName);

    // file container ke andar banegi (mapped to host)
    fs.writeFileSync(filePath, code);

    const command = `docker run --rm -v ${hostDir}:/app -w /app python:3.9-slim python ${fileName}`;

    exec(command, (error, stdout, stderr) => {
      fs.unlinkSync(filePath);

      if (error) return reject(stderr);
      resolve(stdout);
    });
  });
};

module.exports = runPython;

const { exec } = require("child_process");
const fs = require("fs");

const runPython = (code) => {
  return new Promise((resolve, reject) => {
    const fileName = "script.py";
    fs.writeFileSync(fileName, code);

    // const command = `/usr/bin/docker run --rm -v ${process.cwd()}:/app python:3.9 python /app/${fileName}`;
    const command = `docker run --rm -v ${process.cwd()}:/app python:3.9 python /app/${fileName}`;

    exec(command, (error, stdout, stderr) => {
      if (error) return reject(stderr);
      resolve(stdout);
    });
  });
};

module.exports = runPython;
const { exec } = require("child_process");
const fs = require("fs");

const runJS = (code) => {
  return new Promise((resolve, reject) => {
    fs.writeFileSync("script.js", code);

    const command = `
    docker run --rm -v ${process.cwd()}:/app node:18 
    node /app/script.js
    `;

    exec(command, (error, stdout, stderr) => {
      if (error) return reject(stderr);
      resolve(stdout);
    });
  });
};

module.exports = runJS;
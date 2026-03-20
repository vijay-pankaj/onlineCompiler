const { exec } = require("child_process");
const fs = require("fs");

const runCpp = (code) => {
  return new Promise((resolve, reject) => {
    const fileName = "main.cpp";
    fs.writeFileSync(fileName, code);

    const command = `
    docker run --rm -v ${process.cwd()}:/app gcc:latest 
    bash -c "g++ /app/main.cpp -o /app/main && /app/main"
    `;

    exec(command, (error, stdout, stderr) => {
      if (error) return reject(stderr);
      resolve(stdout);
    });
  });
};

module.exports = runCpp;
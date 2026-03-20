const { exec } = require("child_process");
const fs = require("fs");

const runJava = (code) => {
  return new Promise((resolve, reject) => {
    fs.writeFileSync("Main.java", code);

    const command = `
    docker run --rm -v ${process.cwd()}:/app openjdk:11 
    bash -c "javac /app/Main.java && java -cp /app Main"
    `;

    exec(command, (error, stdout, stderr) => {
      if (error) return reject(stderr);
      resolve(stdout);
    });
  });
};

module.exports = runJava;
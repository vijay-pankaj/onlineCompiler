const { exec } = require("child_process");
const fs = require("fs");

const runJava = (code) => {
  return new Promise((resolve, reject) => {
    const fileName = "Main.java";
    fs.writeFileSync(fileName, code);

    const command = `/usr/bin/docker run --rm -v ${process.cwd()}:/app openjdk:11 bash -c "javac /app/${fileName} && java -cp /app Main"`;

    exec(command, (error, stdout, stderr) => {
      if (error) return reject(stderr);
      resolve(stdout);
    });
  });
};

module.exports = runJava;
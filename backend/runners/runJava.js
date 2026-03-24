const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// container path
const containerDir = "/runners";

// host path (IMPORTANT)
const hostDir = "/home/ubuntu/onlineCompiler/backend/runners";

const runJava = (code) => {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(containerDir, { recursive: true });

    const unique = Date.now();
    const className = `Main${unique}`;
    const fileName = `${className}.java`;

    const filePath = path.join(containerDir, fileName);

    // fix class name
    const finalCode = code.replace(/public class \w+/, `public class ${className}`);

    // ✅ file container me create hogi (mapped to host)
    fs.writeFileSync(filePath, finalCode);

    const command = `docker run --rm -v ${hostDir}:/app -w /app eclipse-temurin:11 bash -c "javac ${fileName} && java ${className}"`;

    exec(command, (error, stdout, stderr) => {
      // cleanup
      try {
        fs.unlinkSync(filePath);
        fs.unlinkSync(path.join(containerDir, `${className}.class`));
      } catch {}

      if (error) return reject(stderr);
      resolve(stdout);
    });
  });
};

module.exports = runJava;

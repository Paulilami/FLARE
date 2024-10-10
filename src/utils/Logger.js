const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logFilePath = path.join(__dirname, '../../logs/flare.log');
    this.ensureLogFileExists();
  }

  ensureLogFileExists() {
    if (!fs.existsSync(this.logFilePath)) {
      fs.mkdirSync(path.dirname(this.logFilePath), { recursive: true });
      fs.writeFileSync(this.logFilePath, '', 'utf-8');
    }
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[INFO] [${timestamp}] ${message}\n`;
    fs.appendFileSync(this.logFilePath, logMessage);
    console.log(logMessage.trim());
  }

  error(message) {
    const timestamp = new Date().toISOString();
    const errorMessage = `[ERROR] [${timestamp}] ${message}\n`;
    fs.appendFileSync(this.logFilePath, errorMessage);
    console.error(errorMessage.trim());
  }
}

module.exports = new Logger();

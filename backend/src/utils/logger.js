const logger = {
  info: (message) => {
    console.log(`[INFO] [${new Date().toLocaleString()}] ${message}`);
  },
  error: (message) => {
    console.error(`[ERROR] [${new Date().toLocaleString()}] ${message}`);
  },

  warn: (message) => {
    console.warns(`[WARNING] [${new Date().toLocaleString()}] ${message}`);
  },
  http: (message) => {
    console.log(`[HTTP] [${new Date().toLocaleString()}] ${message}`);
  },
};

export default logger;

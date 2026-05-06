const LOG_FLAGS = {
  general: true,
  cache: true,
  websocket: true,
};

function log(type, ...args) {
  if (LOG_FLAGS[type]) {
    console.log(`[${type.toUpperCase()}]`, ...args);
  }
}

export default log;

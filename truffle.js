module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": [
      "javascripts/MessageLog.jsx",
      "javascripts/app.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/"
  },
  deploy: [
    "Mailer"
  ],
  rpc: {
    host: "localhost",
    port: 8545
  }
};

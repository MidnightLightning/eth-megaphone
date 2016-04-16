var accounts;
var account;
var balance;

function hex2a(hexx) {
  var hex = hexx.toString();//force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2) {
    var nibble = hex.substr(i, 2);
    if (!(nibble == '0x' || nibble == '00')) {
      var ord = parseInt(nibble, 16);
      if (ord >= 20 && ord <= 127) {
        str += String.fromCharCode(ord);
      } else {
        str += '?';
      }
    }
  }
  return str;
}

function a2hex(strr) {
  var str = strr.toString();//force string
  var hex = '';
  for (var i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16);
  }
  return hex;
}

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function addToLog(message) {
  var log = document.getElementById("log");
  var logEntry = document.createElement("div");
  logEntry.innerHTML = `From: ${message.sender}, To: ${message.recipient}, Message: ${message.messageAscii}`;
  //log.appendChild(logEntry);
}

function asciiValue(str) {
  if (str.substr(0, 2) == '0x') return str;
  // Check and see if it only has numeric digits
  var re = /\D/g;
  if (re.test(str)) {
    return '0x'+a2hex(str);
  }
  return str;
}

function sendMessage() {
  var mailer = Mailer.deployed();

  var receiver = document.getElementById("receiver").value;
  var message = document.getElementById("message").value;

  setStatus("Initiating transaction... (please wait)");

  receiver = asciiValue(receiver);

  mailer.send(receiver, message, {from: account}).then(function() {
    setStatus("Transaction complete!");
  }).catch(function(e) {
    console.error(e);
    setStatus("Error sending message; see log.");
  });
};

window.onload = function() {
  var mailer = Mailer.deployed();
  ReactDOM.render(
    React.createElement(MessageLog, {
      mailer: mailer
    }),
    document.getElementById("log")
  );
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[0];
  });
}

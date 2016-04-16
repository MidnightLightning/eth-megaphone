var accounts;
var account;
var balance;

function hex2a(hexx) {
  var hex = hexx.toString();//force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function sendMessage() {
  var mailer = Mailer.deployed();

  var receiver = document.getElementById("receiver").value;
  var message = document.getElementById("message").value;

  setStatus("Initiating transaction... (please wait)");

  mailer.send(receiver, message, {from: account}).then(function() {
    setStatus("Transaction complete!");
  }).catch(function(e) {
    console.error(e);
    setStatus("Error sending message; see log.");
  });
};

window.onload = function() {
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

  var mailer = Mailer.deployed();
  var currentBlock = web3.eth.getBlockNumber(function(err, currentBlock) {
    if (err) {
      console.error(err);
      return;
    }
    var startBlock = currentBlock-500;
    if (startBlock < 0) startBlock = 0;
    console.log('from', startBlock, currentBlock);
    mailer.Message({}, {
      fromBlock: startBlock,
    }, function(err, msg) {
      if (err) {
        cosole.error(err);
        return;
      }

      var out = {
        block: {
          hash: msg.blockHash,
          number: msg.blockNumber
        },
        sender: msg.args.sender,
        recient: msg.args.recipient,
        message: msg.args.message,
        messageAscii: hex2a(msg.args.message)
      };

      console.log(out);
    });
  });
}

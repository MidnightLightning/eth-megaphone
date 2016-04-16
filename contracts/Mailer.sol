contract Mailer {
  address owner;
  event Message(address sender, address recipient, bytes message, uint date);

  function Mailer() {
    owner = msg.sender;
  }

  function transfer(address newOwner) {
    if (msg.sender != owner) throw;
    owner = newOwner;
  }

  function withdraw(address destination, uint amount) {
    if (msg.sender != owner) throw;
    destination.send(amount);
  }

  function send(address recipient, bytes message) {
    if (message.length > 1024) {
      // Using the blockchain to send a large message? Better pay for it!
      // 1 Kb of data sent is free. After that, it's one szabo per byte; roughly one finney per KB.
      uint cost = (message.length - 1024) * 1 szabo;
      if (msg.value < cost) {
        throw; // Didn't send enough to transmit
      }
    }
    Message(msg.sender, recipient, message, block.timestamp);
  }

}

var ValueViewer = React.createClass({
  getInitialState: function() {
    return {
      mode: 'hex'
    };
  },
  toggleState: function() {
    this.setState(function(state) {
      if (state.mode == 'hex') {
        state.mode = 'ascii';
      } else {
        state.mode = 'hex';
      }
      return state;
    });
  },
  truncateLong: function(str) {
    if (str.length <= 15) {
      return str;
    }
    return str.substr(0,5) + '[...]' + str.substr(-5);
  },
  render: function() {
    var value = this.props.value;
    var displayValue;
    if (this.state.mode == 'hex') {
      // Hex representation
      if (value.substr(0, 2) !== '0x') {
        value = '0x' + value;
      }
      displayValue = '0x'+this.truncateLong(value.substr(2));
      return (
        <span className="hex" title={value} onClick={this.toggleState}>{displayValue}</span>
      );
    } else {
      // Ascii representation
      return (
        <span title={value} onClick={this.toggleState}>{hex2a(value)}</span>
      );
    }
  }
});

var MessageViewer = React.createClass({
  getInitialState: function() {
    return {
      mode: 'ascii'
    };
  },
  toggleState: function(e) {
    this.setState(function(state) {
      if (state.mode == 'hex') {
        state.mode = 'ascii';
      } else {
        state.mode = 'hex';
      }
      return state;
    });
  },
  render: function() {
    if (this.state.mode == 'hex') {
      return (
        <div className="message hex" onClick={this.toggleState}>{this.props.value}</div>
      );
    }
    return (
      <div title={this.props.message} className="message" onClick={this.toggleState}>{hex2a(this.props.value)}</div>
    );
  }
});

var MessageLog = React.createClass({
  getInitialState: function() {
    return {
      err: false,
      messages: []
    };
  },
  componentWillMount: function() {
    var self = this;
    web3.eth.getBlockNumber(function(err, currentBlock) {
      if (err) {
        this.setState({
          err: err
        });
        return;
      }
      var startBlock = currentBlock-500;
      if (startBlock < 0) startBlock = 0;
      console.log('from', startBlock, currentBlock);
      self.props.mailer.Message({}, {
        fromBlock: startBlock,
      }, self.handleMessage);
    });
  },
  handleMessage: function(err, msg) {
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
      recipient: msg.args.recipient,
      message: msg.args.message
    };
    this.setState(function(state) {
      state.messages.push(out);
      return state;
    });
    console.log(out);
  },
  render: function() {
    return (
      <div>
        {
          this.state.messages.map(function(message) {
            return (
              <div className="log-entry">
                <span className="field-label from">From: </span><ValueViewer value={message.sender} />
                <span className="field-label to" style={{ marginLeft: '1em' }}>To: </span><ValueViewer value={message.recipient} /><br />
                <MessageViewer value={message.message} />
              </div>
            );
          })
        }
      </div>
    );
  }
});

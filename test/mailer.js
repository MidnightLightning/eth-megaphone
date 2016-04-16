contract('Mailer', function(accounts) {
  it("should be owned by the first account", function(done) {
    var mailer = Mailer.deployed();

    meta.owner.call().then(function(owner) {
      assert.equal(owner, accounts[0], "Not owned by first account");
    });
  });
});

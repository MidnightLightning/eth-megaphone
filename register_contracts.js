Mailer.new().then(function(instance) {
  // `instance` is a new instance of the abstraction.
  // If this callback is called, the deployment was successful.
  console.log(instance.address);
  process.exit();
}).catch(function(e) {
  // There was an error! Handle it.
  console.log('ERROR: ' + e);
  process.exit(1);
});

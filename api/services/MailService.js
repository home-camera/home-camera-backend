module.exports = {
  sendMail: async function(dest, subject) {
    sails.hooks.email.send(
      "", {},
      {
        to: dest,
        subject: subject
      },
      function(err) {console.log(err || "It worked!");}
    )
  }
};

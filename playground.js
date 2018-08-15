const C = require("./common");
// const retrieve = require("./google.js");

var client = C.redis.createClient();

client.hset("me", "test", 2, C.redis.print);
client.hget("me", "test", (err, reply) => {
  console.log(err);
  console.log(reply);
});
client.hget("me", "you", (err, reply) => {
  console.log(err);
  console.log(reply);
});

let notInDB = locality => {
  client.hget("vasantKunj", locality, (err, reply) => {
    if (reply == null) {
      console.log(reply);

      return true;
    } else {
      console.log(reply, "lol");

      return false;
    }
  });
};

console.log(notInDB("france"), "hi");

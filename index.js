const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  Permissions,
} = require(`discord.js`);

const prefix = ">";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log("Ready!");
  client.user.setActivity("Subscribe to our Team", { type: "PLAYING" });
});

client.on("messageCreate", (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    // message Array
    const messageArray = message.content.split(" ");
    const argument = messageArray.slice(1);
    const cmd = messageArray[0];

    // Commands

    // Test Commands
    if (command === "ping") {
      message.channel.send("Pong!");
    }
    if (command === "hello") {
      message.channel.send("Hello David!");
    }
    if (command === "sharks") {
      message.channel.send(
        "Sharks are beautiful creatures that are misunderstood"
      );
    }
    if (command === "myth") {
      message.channel.send("Sharks are dangerous");
    }
  }
});

client.login(
  "MTAyNTUxNTI5NzkwNzY4MzM5OA.GqTGN_.gDslDscuxvkhYD5EGoYoGxWz5CmpYvDysuXyWU"
);

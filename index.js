const cohereChat = import("./cohereChat.js");
const twilio = import("./twilio.js");
const env = require(`dotenv`).config();
const cohere = require("cohere-ai");

cohere.init(process.env.API_KEY);

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

    if (command === "help") {
      message.channel.send("Sharky is here to help!");

      const phone = args.join(" ");

      twilio.getCode(phone).then((response) => {
        message.channel.send(response);
        message.channel.send("Enter OTP to verify!");

        twilio.verfifyCode(args.join(" "), phone).then((response) => {
          message.channel.send(response);
        });
      });
    }

    if (command === "chat") {
      cohereChat(args.join(" ")).then((response) => {
        message.channel.send(response);
      });
    }
  }
});

client.login(process.env.TOKEN);

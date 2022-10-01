const env = require(`dotenv`).config();
const cohereChat = import('./cohereChat.js');
const cohere = require('cohere-ai')
const TwilioClient = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
cohere.init(process.env.API_KEY);

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  Permissions,
} = require(`discord.js`);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});


const getCode = async (phone) => {
  TwilioClient
    .verify
    .services(process.env.VERIFY_SERVICE_SID)
    .verifications
    .create({
      to: `+91-${phone}`,
      channel: "sms"
    })
    .then(data => {
      return data;
    })
};

const verifyCode = async (req, code) => {
  TwilioClient
    .verify
    .services(process.env.VERIFY_SERVICE_SID)
    .verificationChecks
    .create({
      to: `+91-${req}`,
      code: code,
    })
    .then(data => {
      return data;
    });
};

const prefix = ">";

client.on("ready", () => {
  console.log("Ready!");
  client.user.setActivity("Subscribe to our Team", { type: "PLAYING" });
});

client.on("messageCreate", (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    // Message Array
    const messageArray = message.content.split(" ");
    const argument = messageArray.slice(1);
    const cmd = messageArray[0];

    // Test Commands
    if (command === "ping") {
      message.channel.send("Pong!");
    }

    if (command === "help") {
      if (!args.length) {
        return message.channel.send(`You didn't provide me your phone number, ${message.author}!`);
      }
      message.channel.send("Sharky is here to help!", message.author);

      const phone = args.join(' ');
      console.log(phone)

      getCode(phone).then((response) => {
        message.channel.send(response);
        message.channel.send('Enter OTP sent to your phone');

        console.log(args)

        verifyCode(args.join(' '), phone).then((response) => {
          message.channel.send(response);
        });
      });
    }

    if (command === "chat") {
      cohereChat(args.join(" ")).then((response) => {
        message.channel.send(response);
      });
    }

    if (command === "hello") {
      const embed = new EmbedBuilder()
        .setTitle("Welcome to Sharky")
        .setDescription("Your cute little friend is here to help you")
        .setColor(0x00ff00)
        .setThumbnail("https://cdn.discordapp.com/embed/avatars/0.png")
        .setTimestamp()

      message.channel.send({ embeds: [embed] });
    }
  }
});

client.login(process.env.TOKEN);

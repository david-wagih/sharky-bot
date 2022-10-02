const env = require(`dotenv`).config();
const cohere = require('cohere-ai')
const TwilioClient = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
cohere.init(process.env.API_KEY);
const https = require('https')

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
const cohereChat = async (text) => {

  const response = await cohere.generate({
    model: 'large',
    prompt: `This email writing program can generate full emails from simple commands. Here are some examples:\nUser: What is a shark?\nSharky: Sharks are a group of elasmobranch fish characterized by a cartilaginous skeleton, five to seven gill slits on the sides of the head, and pectoral fins that are not fused to the head\n--\nUser: Are sharks harmful?\nSharky: Most sharks are not dangerous to humans — people are not part of their natural diet. Despite their scary reputation, sharks rarely ever attack humans and would much rather feed on fish and marine mammals. Only about a dozen of the more than 300 species of sharks have been involved in attacks on humans.\n--\nUser: ${text}\nSharky:`,
    max_tokens: 100,
    temperature: 0.7,
    k: 0,
    p: 0.75,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop_sequences: [],
    return_likelihoods: 'NONE'
  })
  return response.body.generations[0].text.split("--")[0];
}


const api_url = "https://type.fit/api/quotes";


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

      var phone = args.join(' ');
      console.log(phone)

      getCode(phone).then((response) => {
        message.channel.send(response);
      });
    }


    if (command === "verify") {
      if (!args.length) {
        return message.channel.send(`You didn't write your OTP, ${message.author}!`);
      }
      verifyCode(args.join(" ")).then((response) => {
        message.channel.send(response);
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
    if (command === "quote") {
      // https.get(api_url)
      //   .then(res => res.json())
      //   .then(data => {
      //     message.channel.send(data[0].q + " -" + data[0].a);
      //   });

      https.get(api_url, res => {
        let data = '';
        res.on('data', chunk => {
          data += chunk;
        });
        res.on('end', () => {
          console.log(data)
          // data = JSON.stringify(data);
          message.channel.send(data[0].text + " -" + data[0].author);
        })
      }).on('error', err => {
        console.log(err.message);
      })
    }
  }
});

client.login(process.env.TOKEN);

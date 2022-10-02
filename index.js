const env = require(`dotenv`).config();
const cohere = require("cohere-ai");
const TwilioClient = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);
cohere.init(process.env.API_KEY);
const axios = require("axios");
const hangman = require("discord-hangman");
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
  TwilioClient.verify
    .services(process.env.VERIFY_SERVICE_SID)
    .verifications.create({
      to: `+91-${phone}`,
      channel: "sms",
    })
    .then((data) => {
      return data;
    });
};

const verifyCode = async (req, code) => {
  TwilioClient.verify
    .services(process.env.VERIFY_SERVICE_SID)
    .verificationChecks.create({
      to: `+91-${req}`,
      code: code,
    })
    .then((data) => {
      return data;
    });
};
const cohereChat = async (text) => {
  const response = await cohere.generate({
    model: "large",
    prompt: `This email writing program can generate full emails from simple commands. Here are some examples:\nUser: What is a shark?\nSharky: Sharks are a group of elasmobranch fish characterized by a cartilaginous skeleton, five to seven gill slits on the sides of the head, and pectoral fins that are not fused to the head\n--\nUser: Are sharks harmful?\nSharky: Most sharks are not dangerous to humans — people are not part of their natural diet. Despite their scary reputation, sharks rarely ever attack humans and would much rather feed on fish and marine mammals. Only about a dozen of the more than 300 species of sharks have been involved in attacks on humans.\n--\nUser: ${text}\nSharky:`,
    max_tokens: 100,
    temperature: 0.7,
    k: 0,
    p: 0.75,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop_sequences: [],
    return_likelihoods: "NONE",
  });
  return response.body.generations[0].text.split("--")[0];
};

const api_url = "https://type.fit/api/quotes";

const prefix = ">";

client.on("ready", () => {
  console.log("Ready!");
  client.user.setActivity("Subscribe to our Team", { type: "PLAYING" });
});

client.on("messageCreate", async (message) => {
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
        return message.channel.send(
          `You didn't provide me your phone number, ${message.author}!`
        );
      }
      message.channel.send("Sharky is here to help!", message.author);

      var phone = args.join(" ");
      console.log(phone);

      getCode(phone).then((response) => {
        message.channel.send(response);
      });
    }

    if (command === "verify") {
      if (!args.length) {
        return message.channel.send(
          `You didn't write your OTP, ${message.author}!`
        );
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
        .setTimestamp();

      message.channel.send({ embeds: [embed] });
    }
    if (command === "quote") {
      const arrayOfQuotes = await axios(api_url);
      const randomQuote =
        arrayOfQuotes.data[
          Math.floor(Math.random() * arrayOfQuotes.data.length)
        ];
      const embed = new EmbedBuilder()
        .setTitle("Quote of the Day")
        .setDescription(randomQuote.text)
        .setColor(0x00ff00);

      message.channel.send({ embeds: [embed] });
    }

    if (command === "hangman") {
      await hangman
        .create(interaction, "random", { displayWordOnGameOver: false })
        .then((data) => {
          if (!data.game) return; // If the game is cancelled or no one joins it

          if (data.game.status === "won") {
            if (data.selector)
              interaction.reply({
                content: `Congratulations, you found the word! ${data.selector.username}... You should provide a more complicated word next time!`,
              });
            // data.selector is the user who chose the word (only in custom game mode)
            else
              interaction.reply({
                content: "Congratulations you found the word!",
              });
          } else if (data.game.status === "lost") {
            if (data.selector)
              interaction.reply({
                content: `${data.selector.username} Beat you all! The word was ${data.game.word}.`,
              });
            else
              interaction.reply({
                content: `You lost! The word was ${data.game.word}.`,
              });
          } else {
            interaction.reply({
              content: "15 minutes have passed! The game is over.",
            }); // If no one answers for 15 minutes
          }
        });
    }
  }
});

client.login(process.env.TOKEN);

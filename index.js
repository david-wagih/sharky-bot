const env = require(`dotenv`).config();
const cohere = require('cohere-ai')
cohere.init(process.env.API_KEY)
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  Permissions,
} = require(`discord.js`);

const cohereChat = async (text) => {
  console.log(text)
  const response = await cohere.generate({
    model: 'xlarge',
    prompt: text,
    max_tokens: 50,
    temperature: 0.9,
    k: 0,
    p: 0.75,
    frequency_penalty: 0,
    presence_penalty: 0,
    stop_sequences: [],
    return_likelihoods: 'NONE'
  })
  console.log(response)
  return response.body.generations[0].text;
}

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
    if (command === "sharks") {
      message.channel.send(
        "Sharks are beautiful creatures that are misunderstood"
      );
    }
    if (command === "myth") {
      message.channel.send("Sharks are dangerous");
    }
    if (command === "chat") {
      
      cohereChat(args.join(' ')).then((response) => {
        message.channel.send(response);
      })
    }
  }
});

client.login(process.env.TOKEN);

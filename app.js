const { App } = require("@slack/bolt");
require("dotenv").config();
const fs = require("fs");

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode:true, // enable the following to use socket mode
  appToken: process.env.APP_TOKEN
});

app.message(/hey/, async ({ command, say }) => {
  try {
    say("Yaaay! that command works!");
  } catch (error) {
      console.log("err")
    console.error(error);
  }
});

app.command("/list-topics", async ({ command, ack, say }) => {
  try {
    await ack();
    console.log(command)
    fs.readFile("subscriptions.json", function (err, data) {
      let subscriptions = JSON.parse(data);
      let subscription =  subscriptions.find(it => it.channel === command.channel_name);
      let message = "Topics available for subscription:";
      subscription.topics.forEach(topic => {
        message += "\n"
        message += "- " + topic
      });
      say(message)
    });
  } catch (error) {
      console.log("err")
    console.error(error);
  }
});

(async () => {
  const port = 3000
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();
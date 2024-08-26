const webSocket = require("ws");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config()

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

async function getFromModel(prompt) {
  try {

  const result = await model.generateContent(prompt);
  const response =  result.response;
  const text = response.text();
  return text;
  }
  catch(e) {
    console.log("Failed to generate!:  ",e);
    return {}
  }
}

const app = express();
app.use(cors());

app.use(express.json());

const wsport = 8000;

let messages = {};
let messageQueue = [];

let currentUsers = [];
let UserEmojiLog = {};

const wss = new webSocket.Server({ port: wsport });
wss.on("listening", () => {
  console.log(`WebSocket server is listening on port ${wsport}`);
});

const clients = new Set();

const updateList = () => {
  clients.forEach((client) => {
    client.send(JSON.stringify({ type: "new_user_list", users: currentUsers }));
  });
};

wss.on("connection", (ws) => {
  console.log("Client connected");

  clients.add(ws);

  ws.on("message", (message) => {
    message = JSON.parse(message);
    console.log(message);
    if (message.type == "login") {
      if (!currentUsers.includes(message.name)) {
        currentUsers.push(message.name);
        ws.user = message.name;
        updateList();
      }
    } else if (message.type == "logout") {
      currentUsers = currentUsers.filter((user) => user != message.name);
      updateList();
    } else if (message.type == "message") {
      const key1 = `${message.from} - ${message.to}`;
      const key2 = `${message.to} - ${message.from}`;

      // Check if key1 exists
      if (!messages.hasOwnProperty(key1)) {
        messages[key1] = {};
      }

      const count = Object.keys(messages[key1]).length + 1;

      messages[key1][`${message.from} ${count}`] = message.data;

      if (messages.hasOwnProperty(key2)) {
        Object.assign(messages[key2], messages[key1]);
        delete messages[key1];
      }

      clients.forEach((client) => {
        if (client.user == message.to || client.user == message.from) {
          if (client.readyState === webSocket.OPEN) {
            client.send( JSON.stringify({
                type: "new_message",
                from: message.from,
                to:message.to,
                data: message.data,
              }));
          }
        }
      });
    }
  });

  ws.on("close", () => {
    console.log("Client disconencted")
    currentUsers = currentUsers.filter((user) => user != ws.user);
    clients.delete(ws);
    updateList();
  });
});

app.get("/", (req, res) => {
  res.json("test");
});

app.post("/generateEmoji", async (req, res) => {
  console.log(req.body.messages);
  if (req.body.messages == undefined || req.body.messages == {}) {
    return res.json({}), 200;
  }
  // let prompt = `
  // // The first user is the person im talking to, the messages after from another username towards the end of
  // // the list are my response to his message. Here is the list of the messages : ${req.body.messages},  
  // // analyze my messages and suggest an emoji that best reflects each my mood and feelings from loving to neutral to anger, i have listed the emojis to use below.
  // // output example as JSON object : {<username1>:<emoji>, <username2>:<emoji>, ...} add a key and an emoji  for each user based on the number of users present in all of the conversations.
  // // use the usernames as keys not anything else.
  // // use the usernames given in the conversation as keys.
  // // dont generate random usernames.
  // // restrict the emojis to this set: 🥰,😁,😐,😔,😡
  // // dont include backticks or any other text other than a json object!!!!
  // // generate a simple json object only as the output : {}
  // `;
  let prompt = `Based on the sentiment analysis (positive, negative, neutral)
   of the message ${req.body.messages}, suggest the most relevant emoji from the following set: {🥰,😁,😐,😔,😡}    
  dont give any explaination of the emoji i just want the json object of the emojis.
  dont include backticks in the output just only a json object string

  Output: The suggested emoji for each user as a valid json object only : {"<username1>:"🥰",<username2>:..... "}`
    let answer = await getFromModel(prompt);
    answer = JSON.parse(answer);
    return res.json(answer), 200;
});

app.post("/generateAdvice", async (req, res) => {

  let prompt = `
  I have analyzed two sets of data:

  1. **My Messages:** ${req.body.mymessages} (all the conversations the user has had with other users) 
  2. **My name**: ${req.body.myname} 
  
  My goal is to improve the way ${req.body.myname}  communicate, especially when it comes to maintaining a positive and friendly tone. 
  
  Analyze only my responses in the messages I sent. 
  
  **Focus:** 
    - Avoid giving advice on grammar or punctuation. 
    - Focus on the meaning and tone of my messages. 
    - If ${req.body.myname} tone comes across as negative or unfriendly, advice me to be better. 
  
  **Style:** 
    - Keep the advice concise and actionable (around 7 words). 
    - Frame the advice in a positive and encouraging manner. 
  
    **Example:** 
    "Instead of saying 'you never listen,' try 'Can we talk about this more?'"
  
  **Output:** 
    a string that gives ${req.body.myname} an overall advice on my tone with all users
    Use a maximum of 7 words in the advice.
    give me my advice as if you are talking to ${req.body.myname} !
  
  `;
    let answer = await getFromModel(prompt);
    return res.json(answer), 200;
});

app.post("/generateOverallMood",async (req,res)=> {
   if (req.body.myEmojiRatings == undefined || req.body.myEmojiRatings == {}) {
    return res.json({}), 200;
  }

  let prompt = `
  This is my emoji's and their score based on the tone of my messages i have sent to other users.
  ${req.body.myEmojiRatings}
  Create an overall mood emoji based on the score of each emoji.
  and return a string like this example : "🥰"
  `;
  let answer = await getFromModel(prompt);
  return res.json({overall: answer}), 200;
})

app.post("/whatToSend", async (req, res) => {
  if (req.body.messages == undefined || req.body.messages == {}) {
    return res.json({}), 200;
  }

  let prompt = `
  This is the conversation ${req.body.myname} having with the another user: ${req.body.messages}
  tell ${req.body.myname} what the best appropirate response should be but make sure it sounds like him,
  based on the responses ${req.body.myname} has given before.
  `;

    let answer = await getFromModel(prompt);
    return res.json(answer), 200;
});



app.listen(2001, () => {
  console.log("Server is running on port 2001");
});

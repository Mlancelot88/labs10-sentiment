//
require("dotenv").config();
const express = require("express");
const router = express.Router();
const db = require("../database/helpers/slashDb");
const bodyParser = require("body-parser");
let urlencodedParser = bodyParser.urlencoded({ extended: false });

const {
  postSuccess,
  serverErrorPost,
  getSuccess,
  serverErrorGet,
  serverErrorGetID,
  serverErrorDelete404,
  serverErrorDelete500,
  serverErrorUpdate404,
  serverErrorUpdate500
} = require("./routeHelpers/helpers.js");

//routes for slash commands through Slack API//
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  db.get()
    .then(getSuccess(res))
    .catch(serverErrorGet(res));
});

function sendMessageToSlackResponseURL(responseURL, JSONmessage) {
  var postOptions = {
    uri: responseURL,
    method: "POST",
    headers: {
      "Content-type": "application/json"
    },
    json: JSONmessage
  };
  request(postOptions, (error, response, body) => {
    if (error) {
      // handle errors as you see fit
      res.json({ error: "Error." });
    }
  });
}

router.post("/send-me-buttons", urlencodedParser, (req, res) => {
  res.status(200).end(); // best practice to respond with empty 200 status code
  var reqBody = req.body;
  var responseURL = reqBody.response_url;
  console.log(responseURL);
  if (reqBody.token != process.env.VERIFCATION_TOKEN) {
    res.status(403).end("Access forbidden");
  } else {
    var message = {
      text: "This is your first interactive message",
      attachments: [
        {
          text: "Building buttons is easy right?",
          fallback: "Shame... buttons aren't supported in this land",
          callback_id: "button_tutorial",
          color: "#3AA3E3",
          attachment_type: "default",
          actions: [
            {
              name: "yes",
              text: "yes",
              type: "button",
              value: "yes"
            },
            {
              name: "no",
              text: "no",
              type: "button",
              value: "no"
            },
            {
              name: "maybe",
              text: "maybe",
              type: "button",
              value: "maybe",
              style: "danger"
            }
          ]
        }
      ]
    };
    sendMessageToSlackResponseURL(responseURL, message);
  }
});

router.post("/", (req, res) => {
  // let response = req;
  // console.log({response: response});
  // let postInfo = { slash: response };
  // db.insert(postInfo)
  //   .then(postSuccess(res))
  //   .catch(err => {
  //     res.status(422).json(err);
  //   });
  let userName = req.body.user_name;
  console.log(req.body);
  let botPayload = {
    response_type: "in_channel",
    text: `Hello ${userName}, welcome to the Moodbot Slack channel!!`
  };

  if (userName !== "slackbot") {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  }
});

router.post("/2", (req, res) => {
  // let response = req;
  // console.log({response: response});
  // let postInfo = { slash: response };
  // db.insert(postInfo)
  //   .then(postSuccess(res))
  //   .catch(err => {
  //     res.status(422).json(err);
  //   });
  let userName = req.body.user_name;
  console.log(req.body);
  let botPayload = {
    response_type: "in_channel",
    text: `${userName}, the mood is Great!!`
  };

  if (userName !== "slackbot") {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  }
});

// error: err,
module.exports = router;

// heroku logs --tail -a botsentiment

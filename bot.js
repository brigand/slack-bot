"use strict";

var irc = require("irc");
var superagent = require("superagent");

var config = {
    slack: {
        token: process.env.SLACK_TOKEN,
        channel: "#" + process.env.SLACK_CHANNEL
    }
};

console.log("config", config);

var cat_url = "http://thecatapi.com/api/images/get?format=src";
sendRandomImageUrl();
setInterval(sendRandomImageUrl, 1000 * 60 * 30);

function getCatImage(cb) {
    superagent.head(cat_url).end(function (res) {
        console.log("GET", res.statusCode, cat_url);
        if (res.statusCode !== 302) {
            return cb(res);
        }
        console.log(res.headers);
        cb(null, res.headers.location);
    });
}

function sendRandomImageUrl() {
    getCatImage(function (err, url) {
        sendToSlack("KittenLord437", url, "#random", function (err) {
            if (err) {
                console.error(err);
            }
        });
    });
}

function sendToSlack(username, text, channel, cb) {
    superagent.post("https://slack.com/api/chat.postMessage").type("form").send({
        token: config.slack.token,
        channel: channel || config.slack.channel,
        text: text,
        username: username
    }).end(function (res) {
        console.log("POST", res.statusCode, "https://slack.com/api/chat.postMessage");
        if (res.statusCode >= 300) {
            cb(res);
        }
        cb(null);
    });
}


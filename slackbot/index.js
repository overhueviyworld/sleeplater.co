/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');

// Load environment variables from .env file
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.set('json spaces', 2);

function constructSlackMessage(name, email, phone, message) {
  return {
    attachments: [{
      pretext: 'New message from contact form:',
      author_name: name,
      author_link: `mailto:${email}`,
      text: message,
      fields: [
        { title: 'Email', value: email, short: true },
        phone ? { title: 'Phone number', value: phone, short: true } : undefined,
      ],
      fallback: `Message from ${name} (${email}, ${phone}): ${message}.`,
    }],
  };
}

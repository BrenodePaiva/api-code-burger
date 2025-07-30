"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _mailtrap = require('mailtrap');
require('dotenv/config');

const sendEmail = async (options) => {
  const client = new (0, _mailtrap.MailtrapClient)({ token: process.env.MAILTRAP_TOKEN })

  await client
    .send({
      from: {
        email: 'hello@brenopaiva.net.br',
        name: 'CodeBurge Login',
      },
      to: [{ email: options.to }],
      subject: options.subject,
      html: options.htmlmail,
      category: options.category,
    })
    .then(console.log, console.error)
}

exports. default = sendEmail

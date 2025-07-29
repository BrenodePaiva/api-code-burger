// import nodemailer from 'nodemailer'
// import 'dotenv/config'

// const nodemailer = require('nodemailer')

// const transporter = nodemailer.createTransport({
//   host: 'smtp.hostinger.com',
//   port: 587 || 465,
//   secure: false,
//   auth: {
//     user: 'suporte@brenopaiva.net.br',
//     pass: '27134040Br@',
//   },
//   connectionTimeout: 10000,

//   debug: true,
// })

// // Testa a conexão sem enviar e-mail
// console.log('🔎 Iniciando verificação SMTP...')
// transporter.verify((error, success) => {
//   if (error) {
//     console.error('🚨 Falha na conexão SMTP')
//     console.error('🧾 Detalhes do erro:', error.message || error)
//   } else {
//     console.log('✅ Conexão SMTP estabelecida com sucesso!')
//     console.log('📬 Pronto para envio de e-mails!')
//   }
// })

// const sendEmail = async (options) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.hostinger.com',
//       port: 465,
//       secure: true,
//       auth: {
//         user: 'suporte@brenopaiva.net.br',
//         pass: '27134040Br@',
//       },

//       connectionTimeout: 10000, // opcional: define tempo limite de conexão
//     })

//     const mailOptions = {
//       from: 'suporte@brenopaiva.net.br',
//       to: options.to,
//       subject: options.subject,
//       html: options.htmlmail,
//     }

//     const info = await transporter.sendMail(mailOptions)

//     console.log('Email enviado com sucesso: ', info.response)
//   } catch (err) {
//     console.error('Erro ao enviar: ', err)
//   }

import { MailtrapClient } from 'mailtrap'
import 'dotenv/config'

const sendEmail = async (options) => {
  const client = new MailtrapClient({ token: process.env.MAILTRAP_TOKEN })

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

export default sendEmail

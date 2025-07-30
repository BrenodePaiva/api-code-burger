"use strict";Object.defineProperty(exports, "__esModule", {value: true});require('dotenv/config');
var _googleapis = require('googleapis');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

 const oauth2client = new _googleapis.google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  //   'postmessage'
  'http://localhost:3001/auth/google/callback'
); exports.oauth2client = oauth2client

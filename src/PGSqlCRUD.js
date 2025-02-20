const express = require('express');
const Sequelize = require('sequelize');
const app = express();

app.use(express.json());

const dbUrl = 'postgres://webadmin:1234@node71792-env-2601767.proen.app.ruk-com.cloud:11796/Books'

const sequelize = new Sequelize(dbUrl);
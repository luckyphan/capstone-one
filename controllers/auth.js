const Sequelize = require('sequelize')
require('dotenv').config()
const {CONNECTION_STRING, SECRET} = process.env
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const session = require("express-session");

const sequelize = new Sequelize(CONNECTION_STRING,{
    dialect: 'postgres',
    dialectOptions:{
        ssl:{
            rejectUnauthorized:false
        }
    }
 })

 const createToken = (username, id) => {
    return jwt.sign(
      {
        username,
        id,
      },
      SECRET,
      {
        expiresIn: "2 days",
      }
    );
  };

 module.exports = {
    seed: (req, res) => {
        sequelize.query(`
            DROP TABLE IF EXISTS users;
            DROP TABLE IF EXISTS auth;
            DROP TABLE IF EXISTS entries;

            CREATE TABLE users(
                user_id SERIAL PRIMARY KEY,
                name VARCHAR NOT NULL
            );

            CREATE TABLE auth (
                auth_id SERIAL PRIMARY KEY,
                FOREIGN KEY user_id INT REFERENCES users(user_id) NOT NULL,
                username VARCHAR NOT NULL,
                password VARCHAR (1024)
            );

            CREATE TABLE entries (
                entry_id SERIAL PRIMARY KEY,
                title VARCHAR NOT NULL,
                body text,
                user_id INT REFERENCES users(user_id)
            );
        `)
        .then(() => {
            console.log('DB seeded!')
            res.sendStatus(200)
        })
        .catch((err) => {
            console.log('you had a Sequelize error in your seed function:')
            console.log(err)
            res.status(500).send(err)
        })
    },
    
    userLogin: (req, res) => {
        const { username, password } = req.body;
        sequelize
          .query(`select * from auth where username = '${username}'`)
          .then((dbRes) => {
            if (!dbRes[0][0]) {
              return res.status(400).send(`'${username}' try signing up`);
            }
    
            const authenticated = bcrypt.compareSync(
              password,
              dbRes[0][0].password
            );
            console.log(dbRes[0][0].password.length)
            if (!authenticated) {
              return res.status(403).send(`Incorrect information, please try again`);
            }
            delete dbRes[0][0].password;
            const token = createToken(username, dbRes[0][0].id);
            let userID = dbRes[0][0].id 
            const userToSend = { ...dbRes[0][0], token};
            console.log("this is token",token)
            
            res.status(200).send(userToSend);
            
          })
          .catch((err) => console.log(err));
      },
      userSignup: (req, res) => {
        const { username, password } = req.body;
        sequelize
          .query(`select * from auth where username = '${username}'`)
          .then((dbRes) => {
           
            if (dbRes[0][0]) {
              return res.status(400).send(`'${username}' is already in use, try login`);
            } else {
              let salt = bcrypt.genSaltSync(10);
              const passhash = bcrypt.hashSync(password, salt);
              sequelize
                .query(
                  `
                        insert into users(name) values('${username}');
                        insert into auth(username,password,user_id) values('${username}','${passhash}',(SELECT user_id FROM users WHERE name = '${username}'));
                        select * from auth where username = '${username}';
                    `
                )
                .then((dbResponse) => {
                  delete dbResponse[0][0].passhash;
                  const token = createToken(username, dbResponse[0][0].user_id);
                  const userToSend = { ...dbResponse[0][0], token };
                  res.status(200).send(userToSend);
                })
                .catch((err) => console.log(err));
            }
          })  
          .catch((err) => console.log(err));
      }
};
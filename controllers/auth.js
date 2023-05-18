const Sequelize = require('sequelize')
require('dotenv').config()
const {CONNECTION_STRING, SECRET} = process.env
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sequelize = new Sequelize(CONNECTION_STRING,{
    dialect: 'postgres',
    dialectOptions:{
        ssl:{
            rejectUnauthorized:false
        }
    }
 })

 const createToken = (email, id) => {
    return jwt.sign(
      {
        email,
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
                user_id INT REFERENCES users(user_id),
                username VARCHAR NOT NULL,
                passwordHash text
            );

            CREATE TABLE entries (
                entry_id SERIAL PRIMARY KEY,
                title VARCHAR NOT NULL,
                body text,
                is_shared BOOLEAN,
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
    createEntry:(req, res) => {
    },
    getEntry:(req, res) => {
    },
    deleteEntry:(req, res) => {
    },
    updateEntry:(req, res) => {
    },
    userLogin: (req, res) => {
        const { username, password } = req.body;
        sequelize
          .query(`select * from auth where username = '${username}'`)
          .then((dbRes) => {
            if (!dbRes[0][0]) {
              return res.status(400).send("Account not found, try signing up");
            }
            // const {passhash} = dbRes[0][0]
    
            const authenticated = bcrypt.compareSync(
              password,
              dbRes[0][0].password
            );
            console.log(dbRes[0][0].password.length)
            if (!authenticated) {
              return res.status(403).send("incorrect password");
            }
            delete dbRes[0][0].password;
            const token = createToken(username, dbRes[0][0].id);
            console.log("token", token);
            const userToSend = { ...dbRes[0][0], token };
            res.status(200).send(userToSend);
          })
          .catch((err) => console.log(err));
      },
      userSignup: (req, res) => {
        const { username, password } = req.body;
        console.log(username, password);
        sequelize
          .query(`select * from auth where username = '${username}'`)
          .then((dbRes) => {
            console.log(dbRes[0]);
            if (dbRes[0][0]) {
              return res.status(400).send("Email is already in use, try login");
            } else {
              let salt = bcrypt.genSaltSync(10);
              const passhash = bcrypt.hashSync(password, salt);
              sequelize
                .query(
                  `
                        insert into auth(username,password) values('${username}','${passhash}');
                        insert into users(name) values('${username}');
                        select * from auth where username = '${username}';
                    `
                )
                .then((dbResponse) => {
                  delete dbResponse[0][0].passhash;
                  const token = createToken(username, dbResponse[0][0].id);
                  console.log("token", token);
                  const userToSend = { ...dbResponse[0][0], token };
                  console.log(userToSend);
                  res.status(200).send(userToSend);
                })
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => console.log(err));
      }
};
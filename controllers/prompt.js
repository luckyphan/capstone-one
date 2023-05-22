const Sequelize = require('sequelize')
require('dotenv').config()
const {CONNECTION_STRING} = process.env
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

module.exports = {
    createEntry:(req, res) => {
        const {title,body,user_id} = req.body
        sequelize.query(`
        INSERT INTO entries(title,body,user_id)
        VALUES('${title}','${body}',${user_id})
        RETURNING * ;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => {
            console.log('theres an error in createEntry',err.message)
            res.status(500).send(err)
            })
    },
    getEntries:(req, res) => {
        const {userID} = req.params
        // console.log(userID)
        sequelize.query(`
        SELECT entries.title AS title,
        entries.body AS body,
        entries.entry_id
        FROM entries 
        JOIN users
        ON users.user_id = entries.user_id
        WHERE users.user_id = ${userID}
        `)
        .then(dbRes => {
            res.status(200).send(dbRes[0])
        })
        .catch(err => {
            console.log('theres an error in getEntries',err.message)
            res.status(500).send(err)
            })
    },
    deleteEntry:(req, res) => {
        const {entryID} = req.params
        sequelize.query(`
        DELETE
        FROM entries
        WHERE entry_id = ${entryID};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => {
            console.log('theres an error in deleteEntry',err.message)
            res.status(500).send(err)
            })
    },
    updateEntry:(req, res) => {
        let {bod} = req.body
        let {title, body} = bod
        const {entryID} = req.params
        console.log(title)
        console.log(body)
        sequelize.query(`
        UPDATE entries
        SET title = '${title}', body = '${body}'
        WHERE entry_id = ${entryID}
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => {
                console.log('theres an error in updateEntry',err.message)
                res.status(500).send(err)
             })
    },
    logout:(req, res) => {
        req.session.destroy(() => {
          res.redirect("/");
        });
    },
    getEntry:(req, res) => {
        const {entryID} = req.params
        sequelize.query(`
        SELECT entries.title AS title,
        entries.body AS body,
        entries.entry_id
        FROM entries 
        JOIN users
        ON users.user_id = entries.user_id
        WHERE entries.entry_id = ${entryID}
        `)
        .then(dbRes => {
            res.status(200).send(dbRes[0])
        })
        .catch(err => {
            console.log('theres an error in getEntries',err.message)
            res.status(500).send(err)
            })
    }
}
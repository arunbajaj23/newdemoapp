var express = require("express");
var router = express.Router();
const schemas = require("../joiModelValidation/schemas");
const middleware = require("../joiModelValidation/middleware");
const db = require("../models");
const helper = require("../helper/helper");
const config = require("../config/common.config");
const jwt = require("jsonwebtoken");
const { UniqueConstraintError } = require("sequelize");
/* middleware is used to validate the req data with joi schema */


/* post request for singup through email . */
router.post(
  "/createEmailUser",
  middleware.requireSchemaValidation(schemas.emailPOST),
  async function (req, res, next) {
    try {
      const userData = await db.User.findOne({
        where: {
          email: req.body.email,
        },
        raw: true,
      });
      console.log(userData);
      if (userData == null) {
        req.body.password = await helper.generatePasswordHash(
          req.body.password,
          10
        );
        console.log(req.body.password);
        const userData = {
          email: req.body.email,
          password: req.body.password,
          username: req.body.username
        };
        db.User.create(userData)
          .then((newUser) =>{

            let token = jwt.sign(newUser.get({plain:true}), config.SECRET, {
              expiresIn: config.TOKEN_EXPIRES_IN,
            });
            res.send({
              response: 1,
              sys_message:
                "User Created Successfully",
              data: {
                token,
                username: userData["username"],
                email: userData["email"]
              },
            })
          })
          .catch((error) => {
            res.send({ response: 0, sys_message: error.message });
          });
      } else {
        res.send({
          response: 0,
          sys_message:'Email Id already registered'
        });
      }
    } catch (e) {
      res.send({ response: 0, sys_message: e.message });
    }
  }
),



/* post request for login through email address and password  . */
  router.post(
    "/loginEmailUser",
    middleware.requireSchemaValidation(schemas.emailLoginPOST),
    async function (req, res, next) {
      try {
        const userData = await db.User.findOne({
          where: {
            email: req.body.email,
          },
          raw: true,
        });
        console.log(userData);
        if (userData != null) {
            var match = await helper.checkPasswordHash(
              req.body.password,
              userData["password"]
            );
            if (match) {
                const token = jwt.sign(userData, config.SECRET, {
                  expiresIn: config.TOKEN_EXPIRES_IN,
                });
                res.send({
                  response: 1,
                  sys_message: "sucess",
                  data: {
                    token,
                    username: userData["username"],
                    email: userData["email"]
                  },
                });
            } else {
              res.send({ response: 0, sys_message: "Incorrect password" });
            }
        } else {
          res.send({ response: 0, sys_message: "Invalid email and password" });
        }
      } catch (e) {
        res.send({ response: 0, sys_message: e.message });
      }
    }
  ),

  (module.exports = router);

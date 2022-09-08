var express = require("express");
var router = express.Router();
const schemas = require("../joiModelValidation/schemas");
const middleware = require("../joiModelValidation/middleware");
const db = require("../models");
const helper = require("../helper/helper");
const config = require("../config/common.config");
const jwt = require("jsonwebtoken");
/* middleware is used to validate the req data with joi schema */

/* post request for username change for authenticated user . */
router.post(
  "/interest",
  middleware.requireSchemaValidation(schemas.updateInterestPOST),
  async function (req, res, next) {
    try {
      var eventData = await db.event.findOne({
        where: {
          UserId: req.decoded.id,
        },
      });
      console.log(eventData);
      if (eventData != null) {
        eventData["is_interested"] = req.body.is_interested;
        await eventData.save();
        res.send({
          response: 1,
          sys_message: "Event Interest Changed Successfully",
          data: {  },
        });
      } else {
        await db.event.create({
          UserId: req.decoded.id,
          is_interested:req.body.is_interested
        }).then((eventUser) =>
            res.send({
              response: 1,
              sys_message:
                "Event Interest Created Successfully",
              data: eventUser
            })
          )
          .catch((error) => {
            res.send({ response: 0, sys_message: error.message });
          });
      }
    } catch (e) {
      res.send({ response: 0, sys_message: e.message });
    }
  }
),


/* post request for password change for authenticated user . */
  router.get(
    "/",
    async function (req, res, next) {
      try {
        var eventData = await db.event.findOne({
          where: {
            UserId: req.decoded.id,
          },
        });

        let eventUserData=await db.event.findAll({
          include: [
            {
              model: db.User, required: true
            }
          ]
        });

        res.send({ response: 1, sys_message: "success",data:{eventData,eventUserData} });
          
      } catch (e) {
        console.log(e);
        res.send({ response: 0, sys_message: e.message });
      }
    }
  ),
  (module.exports = router);

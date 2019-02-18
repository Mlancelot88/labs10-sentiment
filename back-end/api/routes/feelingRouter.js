const express = require("express");
const router = express.Router();
const db = require("../database/helpers/feelingsDb");
const teamMemberDb = require("../database/helpers/teamMembersDb");

const {
  postSuccess,
  serverErrorPost,
  getSuccess,
  serverErrorGet,
  serverErrorGetID,
  serverErrorDelete404,
  serverErrorDelete500,
  serverErrorUpdate404,
  serverErrorUpdate500
} = require("./routeHelpers/helpers.js");

const type = "feeling";
const type2 = "team member";

router.post("/", (req, res) => {
  const postInfo = req.body;

  teamMemberDb
    .get()
    .where("id", postInfo.team_member_id)
    .then(data => {
      if (data.length === 0) {
        res.status(404).json({
          message: `${type2} with ID ${postInfo.team_member_id} does not exist.`
        });
      }
    });

  db.insert(postInfo)
    .then(postSuccess(res))
    .catch(serverErrorPost(res));
});

router.get("/", (req, res) => {
  db.get()
    .then(getSuccess(res))
    .catch(serverErrorGet(res));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.getID(id)
    .then(getSuccess(res))
    .catch(serverErrorGetID(res, type, id));
});

router.delete(`/:id`, (req, res) => {
  const { id } = req.params;
  db.getID(id)
    .then(data => {
      if (data) {
        db.remove(id).then(() => {
          db.get().then(getSuccess(res));
        });
      } else {
        serverErrorDelete404(res, type, id);
      }
    })
    .catch(() => {
      serverErrorDelete500(res, type);
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db.getID(id).then(data => {
    if (data) {
      db.update(id, changes)
        .then(() => {
          db.get().then(getSuccess(res));
        })
        .catch(() => {
          serverErrorUpdate500(res, type);
        });
    } else {
      serverErrorUpdate404(res, type, id);
    }
  });
});

module.exports = router;

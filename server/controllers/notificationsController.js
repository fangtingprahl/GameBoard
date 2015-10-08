var Notes     = require ('../models/notificationsModel.js'),
    GamePosts = require('../models/gamePostsModel.js'),
    helpers   = require ('../utils/helpers.js');

module.exports = {

  getNotifications: function (req, res) {
    Notes.getAll(req.user.id)
      .then(function (result) {
        res.send(result);
      })
      .catch(function (err) {
        res.status(500).send(err.message);
      });
  },

  updateNotifications: function (req, res) {
    var updated = req.body;
    helpers.promiseFor(function (i) {
      return i < updated.length;
    }, function (i) {
      return Notes.update(updated[i])
        .then(function () {
          return ++i;
        });
    }, 0).then(function () {
      res.send(200);
    })
  },

  acceptedReq: function (req, res) {
    var requestId = req.body.id;
    var userId = req.body.user_id;

    if ( req.body.status === 'accepted' ) {
      Notes.create(userId, 'request accepted', requestId)
        .then(function () {
          res.send(200);
        })
    } else {
      res.send(200);
    }
  },

  newReq: function (req, res, next) {
    var gamepostId = parseInt(req.url.split('/')[2]);
    GamePosts.fetchById(gamepostId)
      .then(function (gamepost) {
        var userId = gamepost.host_id;
        return Notes.create(userId, 'pending request', gamepostId);
      })
      .then(function () {
        next();
      })

  }

};
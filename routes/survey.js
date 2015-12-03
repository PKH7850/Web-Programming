var express = require('express'),
    User = require('../models/User'),
    Survey = require('../models/Survey');

module.exports = function(io) {
  var router = express.Router();

  function needAuth(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.status(401).json({message: 'Not authorized'});
    }
  }

  router.get('/', needAuth, function(req, res, next) {
    Survey.find({user: req.user.id}, function(err, surveys) {
      if (err) {
        return res.status(500).json({message: 'internal error', desc: err});
      }
      res.json(surveys);
    });
  });

  router.post('/', needAuth, function(req, res, next) {
    console.log(req.body);
    if (!req.body.content) {
      return res.status(400).json({message: 'need content'});
    }
    var survey = new Survey({
      content: req.body.content,
      category: req.body.category || "N/A",
      priority: req.body.priority || 3,
      deadline: req.body.deadline,
      user: req.user.id
    });
    survey.save(function(err, doc) {
      if (err) {
        return res.status(500).json({message: 'internal error', desc: err});
      }
      io.to(req.user.id.toString()).emit('updated');
      res.status(201).json(doc);
    });
  });

  router.put('/:id', needAuth, function(req, res, next) {
    Survey.findById(req.params.id, function(err, survey) {
      if (err) {
        return res.status(500).json({message: 'internal error', desc: err});
      }
      if (!survey) {
        return res.status(404).json({message: 'survey not found'});
      }
      if (req.body.content) {
        survey.content = req.body.content;
      }
      if (req.body.category) {
        survey.category = req.body.category;
      }
      if (req.body.priority) {
        survey.priority = req.body.priority;
      }
      if (req.body.deadline) {
        survey.deadline = req.body.deadline;
      }
      if (req.body.done) {
        survey.done = req.body.done;
      }
      survey.save(function(err) {
        if (err) {
          return res.status(500).json({message: 'internal error', desc: err});
        }
        io.to(req.user.id.toString()).emit('updated');
        res.json(survey);
      });
    });
  });

  router.get('/:id', needAuth, function(req, res, next) {
    Survey.findById(req.params.id, function(err, survey) {
      if (err) {
        return res.status(500).json({message: 'internal error', desc: err});
      }
      if (!survey) {
        return res.status(404).json({message: 'survey not found'});
      }
      res.json(survey);
    });
  });

  router.delete('/:id', needAuth, function(req, res, next) {
    Survey.findOneAndRemove({_id: req.params.id}, function(err, survey) {
      if (err) {
        return res.status(500).json({message: 'internal error', desc: err});
      }
      if (!survey) {
        return res.status(404).json({message: 'survey not found'});
      }
      io.to(req.user.id.toString()).emit('updated');
      res.json({id: survey._id});
    });
  });

  return router;
};

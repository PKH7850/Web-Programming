var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var schema = new Schema({
  title: {type: String, required: true, trim: true},
  email: {type: String, required: true, trim: true},
  password: {type: String},
  content: {type: String, required: true, trim: true},
  numComment: {type: Number, default: 0},
  read: {type: Number, default: 0},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: {virtuals: true },
  toObject: {virtuals: true}
});

var Post = mongoose.model('Post', schema);

module.exports = Post;

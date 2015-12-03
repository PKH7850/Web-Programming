var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema;

var schema = new Schema({
  content: {type: String, required: true, trim: true},
  category: {type: String, trim: true},
  priority: {type: Number, trim: true},
  deadline: Date,
  done: {type: Boolean, default: false},
  user: {type: Schema.Types.ObjectId, index: true, required: true},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: {
    virtuals: true,
    transform: function(survey) {
      return {
        id: survey._id.toString(),
        category: survey.category,
        content: survey.content,
        priority: survey.priority,
        deadline: (survey.deadline) ? moment(survey.deadline).format('YYYY-MM-DD') : "N/A",
        done: survey.done
      };
    }
  },
  toObject: {virtuals: true}
});

var Survey = mongoose.model('Survey', schema);

module.exports = Survey;

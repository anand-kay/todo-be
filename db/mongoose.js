const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://anandkay:anandkay@whattodocluster-zjiyr.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true});

module.exports = { mongoose };
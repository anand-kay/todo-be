const UserModel = require('../models/user.model');
const TodoModel = require('../models/todo.model');

const ITEMS_PER_PAGE = 7;

exports.signupUser = (req, res, next) => {

    let user = new UserModel({
        email: req.body.email,
        password: req.body.password
    });

    user.save().then((user) => {
        return user.generateAuthToken();
    }).then((token) => {

        res.header('x-auth', token).send({token});

    }).catch((err) => {
        res.status(400).send(err);
    });

};

exports.loginUser = (req, res, next) => {

    UserModel.findByCredentials(req.body.email, req.body.password).then((user) => {

        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send({token});
        });

    }).catch((err) => {
        res.status(400).send();
    });

};

exports.getUser = (req, res, next) => {

    res.send(req.user);

};

exports.logoutUser = (req, res, next) => {

    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });

};

exports.newTodo = (req, res, next) => {

    let todo = new TodoModel({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((todo) => {
        res.status(200).send('"success!!"');
    }).catch((err) => {
        res.status(400).send(err);
    });

};

exports.fetchTodos = (req, res, next) => {

    const page = +req.query.page || 1;
    let totalCount;

    TodoModel.find({
        _creator: req.user._id
    })
    .countDocuments()
    .then((count) => {

        totalCount = count;

        return TodoModel.find({
            _creator: req.user._id
        })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((todos) => {

        res.status(200).json({
            todos: todos,
            totalCount: totalCount
        });
    })
    .catch((err) => {
        res.status(400).send(err);
    });

};

exports.deleteTodo = (req, res, next) => {

    // console.log(req.header('x-id'));

    TodoModel.findById(req.header('x-id')).then((todo) => {

        if ( todo._creator.toString() === req.user._id.toString() ) {

            return TodoModel.findByIdAndDelete(req.header('x-id'));

        }
        else {

            return Promise.reject('You\'re not authorized to make this operation.');

        }

    }).then((todo) => {

        res.status(200).send(todo);

    }).catch((err) => {
        res.status(400).send(err);
    });

    // TodoModel.findById(req.body.id).then((todo) => {

    //     if ( todo._creator.toString() === req.user._id.toString() ) {

    //         return TodoModel.findByIdAndDelete(req.body.id);

    //     }
    //     else {

    //         return Promise.reject('You\'re not authorized to make this operation.');

    //     }

    // }).then((todo) => {

    //     res.status(200).send(todo);

    // }).catch((err) => {
    //     res.status(400).send(err);
    // });

};

exports.updateDone = (req, res, next) => {

  TodoModel.findByIdAndUpdate(req.body.id, {$set: {done: req.body.done}})
    .then((todo) => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(400).send(err);
    });

};

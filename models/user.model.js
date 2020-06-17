const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

let UserSchema = new Schema({
    email: {
        type: String, 
        required: true, 
        unique: true
    },
    password: {
        type: String, 
        required: true
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// Hash password and then save to database
UserSchema.pre('save', function(next) {

    let user = this;

    if(user.isModified('password')) {

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });

    }
    else {
        next();
    }

});

// Generate new JWT for login and signup
UserSchema.methods.generateAuthToken = function() {

    let user = this;
    let access = 'auth';
    let token = jwt.sign(
        {
            _id: user._id.toHexString(), 
            access
        },
        '123abc'
    ).toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });

}

UserSchema.statics.findByCredentials = function(email, password) {

    let User = this;

    return User.findOne({email}).then((user) => {

        if( ! user ) {
            return Promise.reject();
        }

        return new Promise((resolve, reject) => {

            bcrypt.compare(password, user.password, (err, res) => {

                if (res) {
                    resolve(user);
                }
                else {
                    reject(err);
                }

            });

        });

    });

}

UserSchema.statics.findByToken = function(token) {

    var User = this;

    var decoded;

    try {
        decoded = jwt.verify(token, '123abc');
    }
    catch (err) {
        return Promise.reject();
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth' 
    });

}

// Delete existing JWT for logout
UserSchema.methods.removeToken = function(token) {

    var user = this;

    return user.update({
        $pull: {
            tokens: { token }
        }
    });

};

module.exports = mongoose.model('User', UserSchema);
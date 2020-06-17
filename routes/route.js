const express = require('express');
const router = express.Router();

const controller = require('../controllers/controller');
const authenticate = require('../authentication/authenticate');

// Signup
router.post('/signup', controller.signupUser);

// Login
router.post('/login', controller.loginUser);

// Get current user details
router.get('/user', authenticate.authenticate, controller.getUser);

// Logout
router.delete('/logout', authenticate.authenticate, controller.logoutUser);

// New Todo entry
router.post('/newtodo', authenticate.authenticate, controller.newTodo);

// Fetch Todos of current user
router.get('/fetch', authenticate.authenticate, controller.fetchTodos);

// Delete a Todo
router.delete('/delete', authenticate.authenticate, controller.deleteTodo);

// Patch 'done' value in a // TODO
router.patch('/updatedone', authenticate.authenticate, controller.updateDone);

module.exports = router;

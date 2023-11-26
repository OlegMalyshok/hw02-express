const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

async function register(req, res, next) {}

async function login(req, res, next) {}

async function logout(req, res, next) {}

async function current(req, res, next) {}

module.exports = { register, login, logout, current };

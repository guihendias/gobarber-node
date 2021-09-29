"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcryptjs = require("bcryptjs");

class BCryptHashProvider {
  generateHash(payload) {
    return (0, _bcryptjs.hash)(payload, 8);
  }

  compareHash(payload, hashed) {
    return (0, _bcryptjs.compare)(payload, hashed);
  }

}

exports.default = BCryptHashProvider;
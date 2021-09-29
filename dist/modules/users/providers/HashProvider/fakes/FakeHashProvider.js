"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class FakeHashProvider {
  generateHash(payload) {
    return new Promise((resolve, reject) => resolve(payload));
  }

  compareHash(payload, hashed) {
    return new Promise((resolve, reject) => resolve(payload === hashed));
  }

}

exports.default = FakeHashProvider;
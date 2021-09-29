"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AddAvatarFieldToUsers1611832603597 = void 0;

var _typeorm = require("typeorm");

class AddAvatarFieldToUsers1611832603597 {
  async up(queryRunner) {
    await queryRunner.addColumn('users', new _typeorm.TableColumn({
      name: 'avatar',
      type: 'varchar',
      isNullable: true
    }));
  }

  async down(queryRunner) {
    await queryRunner.dropColumn('users', 'avatar');
  }

}

exports.AddAvatarFieldToUsers1611832603597 = AddAvatarFieldToUsers1611832603597;
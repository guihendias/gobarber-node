"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AddUserIdToAppointments1629972026272 = void 0;

var _typeorm = require("typeorm");

class AddUserIdToAppointments1629972026272 {
  async up(queryRunner) {
    await queryRunner.addColumn('appointments', new _typeorm.TableColumn({
      name: 'user_id',
      type: 'uuid',
      isNullable: false
    }));
    await queryRunner.createForeignKey('appointments', new _typeorm.TableForeignKey({
      name: 'AppointmentUser',
      columnNames: ['user_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'users',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    }));
  }

  async down(queryRunner) {
    await queryRunner.dropForeignKey('appointments', 'AppointmentProvider');
    await queryRunner.dropColumn('appointments', 'user_id');
  }

}

exports.AddUserIdToAppointments1629972026272 = AddUserIdToAppointments1629972026272;
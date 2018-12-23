'use strict'
var User = require('../Models/user');
const mongoosePaginate = require('mongoose-pagination');
const UserManagement = {};

UserManagement.getUsers = async function (page = 1, itemsPerPage = 3,cb) {  
    await User.find(null,'_id name surname username email urlImage fecha_nacimiento sobre_mi pais',).sort('_id').paginate(page, itemsPerPage, (error, users) => {
        if (error) return error;

        if (users && users.length > 0) {
            cb(users);
        } else {
            cb(false);
        }
    });
}

module.exports = UserManagement;

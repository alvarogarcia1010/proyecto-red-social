'use strict'
var User = require('../Models/user');
const mongoosePaginate = require('mongoose-pagination');
const UserManagement = {};

UserManagement.getUsers = async function (pagination, itemsPerPageParams,cb) {
    var page = 1;
    var itemsPerPage = 3;

    if (pagination) {
      page = pagination;
    }
    if (itemsPerPageParams) {
        itemsPerPageParams = itemsPerPageParams;
    }
  
    await User.find().sort('_id').paginate(page, itemsPerPage, (error, users) => {
        if (error) return error;
    
        if (users && users.length > 0) {
            console.log(users);
            cb(users);
        } else {
            cb(false);
        }
    });
}

module.exports = UserManagement;


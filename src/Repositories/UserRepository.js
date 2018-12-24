'use strict'

const User = require('../Models/user');

const UserRepository = {};

UserRepository.getAll = async function () {
  try
  {
    var users = await User.find(null, '_id name surname username email role urlImage fecha_nacimiento sobre_mi pais created_at',);
    return {users};
  }
  catch (error)
  {
    return {error};
  }
};

UserRepository.byId = async function (id) {
  try
  {
    var user = await User.findById(id);

    user.password = undefined;
    user.provider = undefined;
    user.provider_id = undefined;
    user.__v = undefined;

    return {user};
  }
  catch (error)
  {
    return {error};
  }
};

UserRepository.create = async function (data) {
  try
  {
    var user = data.save();
    return {user}
  }
  catch (error)
  {
    return {error};
  }
};

UserRepository.update = async function (id = null, data) {
  try
  {
    var user = await User.findByIdAndUpdate(id , data, {new:true});
    return {user};
  }
  catch (error)
  {
    return {error};
  }
};

UserRepository.delete = async function (id) {
  try
  {
    var user = await User.findByIdAndDelete(id);
    return {user};
  }
  catch (error)
  {
    return {error};
  }
};

module.exports = UserRepository;

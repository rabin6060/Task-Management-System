import { User } from './model';
import { createUserRepo, deleteUserByEmail, getAllUsers, getUserAndUpdateRefreshToken, getUserByCodeOk, getUserByEmail, updateUser, updateUserById, updateUserWithToken } from './repository';

const UserService = {
  createUser(userData: User) {
    return createUserRepo(userData);
  },

  getUser(email:string) {
    return getUserByEmail(email)
  },
  getUserAndUpdateRefreshToken(id:string){
    return getUserAndUpdateRefreshToken(id)
  },
  getUserById(id:string){
    return getUserByCodeOk(id)
  },
  //updating user while registering
  updateUserInfo(email:string){
    return updateUser(email)
  },
  updateUserWithToken(email:string,accessToken:string){
    return updateUserWithToken(email,accessToken)
  },
  //updating user info
  updateUser(id:string,username:string){
    return updateUserById(id,username)
  },
  getUsers() {
    return getAllUsers()
  },
  deleteUser(email:string){
    return deleteUserByEmail(email)
  }
};

export default UserService;

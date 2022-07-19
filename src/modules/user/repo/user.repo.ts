import UserModel from '../model/user.model';

export class UserRepo {

    /**
     * @function - Generic function to find documents using query
     * @author - @me
     * @param query
     * @returns {Promise}
     */
    public async findUser(query: any): Promise<any> {
        console.log(query,'q');
        const userArray: Array<any> = await UserModel.find(query);
        return userArray.length > 0 ? userArray[0] : {};
    }

    /**
     * Repo for Signing up the user
     * @Author @me
     * @Param {Object} userObj - user object
     * @return {Object} error/user object
     */
    public signUp(userObj: any): any {
        userObj.nonce = Math.floor(Math.random() * 10000);
        return new UserModel(userObj)
            .save();
    }
}
export const userRepo: UserRepo = new UserRepo();

import { User } from "./../models/users/User";

const getByID = (id: string) => User.findById(id);

export { getByID };

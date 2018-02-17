import { User } from "./../models/users/User";

const getUserByID = (id: string) => User.findById(id);

const getUserByGoogleID = (googleID: string) => User.findOne({ googleID });

const userExists = async (googleID: string): Promise<boolean> => {
  const u = await User.find({ googleID }).limit(1);
  return u.length > 0;
};

export { getUserByID, userExists, getUserByGoogleID };

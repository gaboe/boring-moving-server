import User from "./../models/User";

const addRule = (
  userID: string,
  sender: string,
  subject: string,
  content: string
) => {
  User.findById(userID, (err, res) => {
    // res.addRule("string");
  });
};

export { addRule };

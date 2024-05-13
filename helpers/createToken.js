import jsonwebtoken from "jsonwebtoken";
import { config } from "dotenv";

config();
const secret = process.env.SECRET_KEY;
const maxAge = 3 * 24 * 60 * 60;

const createToken = (id, fullname) => {
  return jsonwebtoken.sign({ id, fullname }, secret, { expiresIn: maxAge });
};

export default createToken;

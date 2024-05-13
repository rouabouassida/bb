import bcrypt from "bcrypt";

const hashData = async (data) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedData = await bcrypt.hash(data, salt);

    return hashedData;
  } catch (error) {
    throw new Error(`Error hashing data: ${error.message}`);
  }
};

const InhashData = async (data, prev) => {
  try {
    const InhashedData = await bcrypt.compare(data, prev);

    return InhashedData;
  } catch (error) {
    throw new Error(`Error comparing data: ${error.message}`);
  }
};
const compareHash = async (data, hash) => {
  // Renommer la fonction pour refléter son objectif
  try {
    const isMatch = await bcrypt.compare(data, hash);

    return isMatch;
  } catch (error) {
    throw new Error(
      `Erreur lors de la comparaison des données : ${error.message}`
    );
  }
};

export { hashData, InhashData, compareHash };

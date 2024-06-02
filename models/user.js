import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: true,
  },
});

// Ajouter une méthode personnalisée pour marquer un utilisateur comme non vérifié par email
userSchema.statics.unverifyByEmail = async function (email) {
  try {
    const updatedUser = await this.findOneAndUpdate(
      { email },
      { verified: false },
      { new: true } // Retourne le document après la mise à jour
    );
    return updatedUser;
  } catch (error) {
    throw new Error(`Erreur lors de la mise à jour de l'utilisateur : ${error.message}`);
  }
};

const User = mongoose.model("User", userSchema);

export default User;

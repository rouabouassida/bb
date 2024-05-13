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
});

// Ajouter une méthode personnalisée pour supprimer un utilisateur par email
userSchema.statics.deleteByEmail = async function (email) {
  try {
    const deletedUser = await this.findOneAndDelete({ email });
    return deletedUser;
  } catch (error) {
    throw new Error("Erreur lors de la suppression de l'utilisateur :", error);
  }
};

const User = mongoose.model("User", userSchema);

export default User;

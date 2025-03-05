import mongoose from "mongoose";
 
const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "El Nombre es obligatorio"]

    },

    surname: {
        type: String,
        required: [true, "El Apellido es obligatorio"]
    },

    username: {
        type: String,
        required: [true, "El Nombre de usuario es obligatorio"]

    },

    email: {
        type: String,
        required: [true, "El Correo es obligatorio"],
        unique: true
    },

    password: {
        type: String,
        required: [true, "La Contraseña es obligatoria"]
    },

    phone: {
        type: String,
        minlength: 8,
        maxlength: 8,
        required: [true, "El Número es obligatorio"]
    },

    isActive: {
        type: Boolean,
        default: true
    },

    isGoogleAccount: {
        type: Boolean,
        default: false
    }

});
 
UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
};
 
export default mongoose.model("User", UserSchema);
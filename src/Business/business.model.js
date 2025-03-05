import mongoose from "mongoose";
 
const BusinessSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "El nombre de la organización es requerido"]
    },
    influenceLevel: {
        type: String,
        required: [true, "Debe especificarse el nivel de influencia"]
    },
    experienceYears: {
        type: Number,
        required: [true, "La cantidad de años de experiencia es obligatoria"],
        min: [0, "No puede ser un número negativo"]
    },
    industry: {
        type: String,
        required: [true, "El sector empresarial es un campo obligatorio"]
    },
    overview: {
        type: String,
        maxlength: 500
    },
    email: {
        type: String,
        required: [true, "El correo de contacto es necesario"],
        unique: true
    },
    phone: {
        type: String,
        required: [true, "Debe proporcionarse un número de contacto"],
        minlength: 8,
        maxlength: 8
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
 
BusinessSchema.methods.toJSON = function() {
    const {__v, _id, ...data} = this.toObject();
    data.businessId = _id;
    return data;
}
 
export default mongoose.model("Business", BusinessSchema);


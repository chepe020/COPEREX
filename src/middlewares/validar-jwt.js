import jwt from "jsonwebtoken";
import Usuario from "../users/user.model.js";

export async function validarJWT(req, res, next) {
    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({ msg: "No hay token en la petición" });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);

        if (!usuario || !usuario.isActive) {
            return res.status(401).json({
                msg: !usuario
                    ? "Usuario no existente en la base de datos"
                    : "Token no válido - Usuario inactivo",
            });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ msg: "Token no válido" });
    }
}


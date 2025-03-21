import { hash, verify } from "argon2";
import Usuario from "../users/user.model.js";
import { generarJWT } from "../helpers/generate-jwt.js";
 
export const login = async (req, res) => {
    const { email, password, username } = req.body;
 
    try {
        const user = await Usuario.findOne({
            $or: [{ email }, { username }]
        });
 
        if (!user) {
            return res.status(400).json({
                msg: "Credenciales incorrectas, correo o usuario no encontrado"
            });
        }
 
        if (!user.isActive) {
            return res.status(400).json({
                msg: "El usuario está inactivo"
            });
        }
 
        const validPassword = await verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "La contraseña es incorrecta"
            });
        }
 
        const token = await generarJWT(user.id);
 
        res.status(200).json({
            msg: "Inicio de sesión exitoso!",
            userDetails: {
                username: user.username,
                token
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error del servidor",
            error: error.message
        });
    }
};

import { Router } from "express";
import { check } from "express-validator";
import { registerBusiness, getBusinesses, modifyBusiness, generateBusinessReport } from "./business.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
 
const router = Router();
 
router.post(
    "/",
    [
        validarJWT,
        check("title", "El nombre de la organización es obligatorio").not().isEmpty(),
        check("influenceLevel", "El nivel de influencia es obligatorio").not().isEmpty(),
        check("experienceYears", "Los años de experiencia deben ser un número").isNumeric(),
        check("industry", "El sector empresarial es obligatorio").not().isEmpty(),
        check("email", "El correo electrónico es obligatorio").isEmail(),
        check("phone", "El teléfono debe tener 8 caracteres").isLength({ min: 8, max: 8 }),
        validarCampos
    ],
    registerBusiness
);
 
router.get(
    "/",
    [
        validarJWT,
    ],
    getBusinesses
);
 
router.put(
    "/:id",
    [
        validarJWT,
        check("id", "No es un ID válido").isMongoId(),
        check("title", "El nombre de la organización es obligatorio").not().isEmpty(),
        check("influenceLevel", "El nivel de influencia es obligatorio").not().isEmpty(),
        check("experienceYears", "Los años de experiencia deben ser un número").isNumeric(),
        check("industry", "El sector empresarial es obligatorio").not().isEmpty(),
        check("email", "El correo electrónico es obligatorio").isEmail(),
        check("phone", "El teléfono debe tener 8 caracteres").isLength({ min: 8, max: 8 }),
        validarCampos
    ],
    modifyBusiness
);
 
router.get(
    "/report",
    [
        validarJWT,
    ],
    generateBusinessReport
);
 
export default router;
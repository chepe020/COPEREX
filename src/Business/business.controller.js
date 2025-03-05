import Business from "../business.model.js";
import ExcelJS from "exceljs";
 
export const registerBusiness = async (req, res) => {
    try {
        const { title, influenceLevel, experienceYears, industry, overview, email, phone } = req.body;
 
        const existingBusiness = await Business.findOne({ email });
        if (existingBusiness) {
            return res.status(400).json({
                success: false,
                message: "Ya existe un negocio registrado con este correo."
            });
        }
 
        const business = new Business({
            title,
            influenceLevel,
            experienceYears,
            industry,
            overview,
            email,
            phone
        });
 
        await business.save();
 
        res.status(201).json({
            success: true,
            message: "Negocio registrado exitosamente",
            business
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al registrar el negocio",
            error: error.message
        });
    }
};
 
export const getBusinesses = async (req, res) => {
    try {
        const { filter, sort } = req.query;
        const filterQuery = {};
        if (filter) {
            const filterCriteria = JSON.parse(filter);
            if (filterCriteria.industry) filterQuery.industry = filterCriteria.industry;
            if (filterCriteria.experienceYears) filterQuery.experienceYears = { $gte: filterCriteria.experienceYears };
            if (filterCriteria.influenceLevel) filterQuery.influenceLevel = filterCriteria.influenceLevel;
        }
        const sortQuery = sort ? JSON.parse(sort) : { title: 1 };
        const businesses = await Business.find(filterQuery).sort(sortQuery);
 
        res.status(200).json({ success: true, businesses });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los negocios",
            error: error.message
        });
    }
};
 
export const modifyBusiness = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, influenceLevel, experienceYears, industry, overview, email, phone } = req.body;
        const business = await Business.findById(id);
        if (!business) {
            return res.status(404).json({ success: false, message: "Negocio no encontrado" });
        }
        const updatedBusiness = await Business.findByIdAndUpdate(id, {
            title,
            influenceLevel,
            experienceYears,
            industry,
            overview,
            email,
            phone
        }, { new: true });
 
        res.status(200).json({ success: true, message: "Negocio actualizado", updatedBusiness });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el negocio",
            error: error.message
        });
    }
};
 
export const generateBusinessReport = async (req, res) => {
    try {
        const businesses = await Business.find({});
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte de Negocios');
 
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 36 },
            { header: 'Nombre', key: 'title', width: 30 },
            { header: 'Nivel de Influencia', key: 'influenceLevel', width: 20 },
            { header: 'Años de Experiencia', key: 'experienceYears', width: 20 },
            { header: 'Industria', key: 'industry', width: 20 },
            { header: 'Descripción', key: 'overview', width: 50 },
            { header: 'Correo', key: 'email', width: 30 },
            { header: 'Teléfono', key: 'phone', width: 20 },
            { header: 'Fecha de Registro', key: 'createdAt', width: 30 },
            { header: 'Activo', key: 'isActive', width: 15 }
        ];
 
        businesses.forEach(business => {
            worksheet.addRow({
                id: business.id,
                title: business.title,
                influenceLevel: business.influenceLevel,
                experienceYears: business.experienceYears,
                industry: business.industry,
                overview: business.overview || 'N/A',
                email: business.email,
                phone: business.phone,
                createdAt: business.createdAt.toISOString().slice(0, 10),
                isActive: business.isActive ? 'Sí' : 'No'
            });
        });
 
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Reporte_Negocios.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al generar el reporte",
            error: error.message
        });
    }
};

/**
 * 
 * @param req - es la parte base para el filtro
 * @param file - el file es el archivo base que se envia desde el controller, si no se envia nada se devuelve el callback false con error
 * @param callback - la funcion callback nos sirve como argumento de nuestra funcion de filtro para devolver true o false 
 * @returns retorna la respuesta callback true de que paso el filtro del tipo de archivo
 */

export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    if(!file) return callback(new Error('File is empty'),false);

    const fileExtension = file.mimetype.split('/')[1];
    const validExtension = ['jpg','jpge','png','gif'];

    if(validExtension.includes(fileExtension)) return callback(null, true);

    callback(null, false);

}
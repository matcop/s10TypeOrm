

export const fileFilter = (req: Express.Request, file: Express.Multer.File, callback: Function) => {

    // console.log({ file })

    if (!file) return callback(new Error('File is empty'), false)

    const fielExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg','jpeg','png','gif'];
    
    if (validExtensions.includes(fielExtension)) {
        return callback(null, true)
    }
        callback(null, false)
       

    

    // console.log(fielExtension)

}
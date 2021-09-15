const imageValidator = (image) => {
    if (image.mimetype === "image/png" || image.mimetype === "image/jpg" || image.mimetype === "image/jpeg") {
        return true;
    } else {
        return false;
    }
}

const validateValidImage = (images) => {
    var isValidImage = true

    if (images.length === undefined) {// number of uploaded image is 1
        isValidImage = imageValidator(images)
    } else {
        if (images.length > 5) {
            isValidImage = false
            return isValidImage
        }

        for (let i = 0; i < images.length; i++) {
            isValidImage = imageValidator(images[i])
            if (!isValidImage)
                break
        }
    }
    return isValidImage
}

module.exports = {
    validateValidImage
}
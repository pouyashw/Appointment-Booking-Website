const express = require('express')
const { auth } = require('../middlewares/auth')
const roleGuard = require('../middlewares/roleGuard')
const { multerStorage } = require('../utils/multer')
const { 
    createPortfolio,
    getPortfolioByBarber, 
    getPortfolio, 
    updatePortfolio, 
    removePortfolio,
    addImages,
    removeImage,
    replaceImage
} = require('./../controllers/portfolio.js')

const upload = multerStorage("public/images/portfolio")

const router = express.Router()

router.route('/')
    .post(auth, roleGuard("BARBER"), upload.array("images", 10), createPortfolio)
    
router.route('/barber/:barberID')
    .get(getPortfolioByBarber)
    
router.route('/:portfolioID')
    .get(getPortfolio)
    .patch(auth, roleGuard("BARBER"), upload.array("image", 10), updatePortfolio)
    .delete(auth, roleGuard("BARBER"), removePortfolio)

router.route("/:id/add-images")
    .patch(
        auth,
        roleGuard("BARBER"),
        upload.array("images", 10),
        addImages
    );

router.route("/:id/remove-image")
    .patch(
        auth,
        roleGuard("BARBER"),
        removeImage
    );

router.route("/:id/replace-image")
    .patch(
        auth,
        roleGuard("BARBER"),
        upload.single("image"),
        replaceImage
    );

module.exports = router
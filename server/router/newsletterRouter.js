const express = require('express');
const router = express.Router();
const newsletterController = require('../controller/newsletterController');

router.post('/', newsletterController.createNewsletter);
router.get('/', newsletterController.getAllNewsletters);
router.get('/:id', newsletterController.getNewsletterById);
router.put('/:id', newsletterController.updateNewsletter);
router.delete('/:id', newsletterController.deleteNewsletter);
router.get('/admin/:adminId', newsletterController.getNewslettersByAdminId);

module.exports = router;

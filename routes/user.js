const express=require('express');
const router=express.Router();

const checkAuth=require('../middleware/check-auth');
const usersController=require('../controllers/users');


router.post('/register',usersController.user_register);


router.post('/login',usersController.user_login);


router.delete('/:userId',checkAuth,usersController.user_delete);



module.exports=router;
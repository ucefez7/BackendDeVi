//user Routes
router.get('/', userAuthMiddleware, getUsers);
router.get('/:id', userAuthMiddleware, getUserById);
router.post('/', userAuthMiddleware, createOrLoginUser);
router.put('/:id', userAuthMiddleware, updateUser);
router.delete('/:id', userAuthMiddleware, deleteUser);

GET https://backenddevi.onrender.com/api/users/                To get all users
GET https://backenddevi.onrender.com/api/users/:id             To get a user by his ID
POST https://backenddevi.onrender.com/api/users/:id            To Create a user or login to a user account
PUT https://backenddevi.onrender.com/api/users/:id             To update an user
DELETE https://backenddevi.onrender.com/api/users/:id          To delete an user



//network Routes
router.post('/follow/:id', authMiddleware, sendFollowRequest);
router.post('/accept-follow/:id', authMiddleware, acceptFollowRequest);
router.post('/decline-follow/:id', authMiddleware, declineFollowRequest);
router.post('/unfollow/:id', authMiddleware, unfollowUser);

POST https://backenddevi.onrender.com/api/users/follow/:id               To follow an user (from a logged user account)
POST https://backenddevi.onrender.com/api/users/accept-follow/:id        To accept a follow request (from a logged user account)
POST https://backenddevi.onrender.com/api/users/decline-follow/:id       To decline a follow request (from a logged user account)
POST https://backenddevi.onrender.com/api/users//unfollow/:id            To unfollow an user (from a logged user account)




// Route to create a new post
router.post('/', userController.createPost);
router.get('/all', userController.getAllPosts);
router.get('/user/:userId', userController.getPostsByUserId);
router.get('/post/:postId', userController.getPostById);

POST https://backenddevi.onrender.com/api/posts/                 To create a post (from a logged user account)
GET https://backenddevi.onrender.com/api/posts/user/:userId      To get posts by an user (from a logged user account)
GET https://backenddevi.onrender.com/api/posts/all               To get all posts (from a logged user account)
GET https://backenddevi.onrender.com/api/posts/post/:postId      To get a post by its Id (from a logged user account)

//Basic User section API's

POST `https://backenddevi.onrender.com/api/users/:id`            To Create a user or login to a user account
GET `https://backenddevi.onrender.com/api/users/`                To get all users
GET `https://backenddevi.onrender.com/api/users/:id`             To get a user by his ID
PUT `https://backenddevi.onrender.com/api/users/:id`             To update an user
DELETE `https://backenddevi.onrender.com/api/users/:id`          To delete an user



//Follow, Accept follow, Decline follow

POST `https://backenddevi.onrender.com/api/users/follow/:id`               To follow an user (from a logged user account)
POST `https://backenddevi.onrender.com/api/users/accept-follow/:id`        To accept a follow request (from a logged user account)
POST `https://backenddevi.onrender.com/api/users/decline-follow/:id`       To decline a follow request (from a logged user account)
POST `https://backenddevi.onrender.com/api/users//unfollow/:id`            To unfollow an user (from a logged user account)




//POST section

POST `https://backenddevi.onrender.com/api/posts/`                 To create a post (from a logged user account)
GET `https://backenddevi.onrender.com/api/posts/user/:userId`      To get posts by an user (from a logged user account)
GET `https://backenddevi.onrender.com/api/posts/all`               To get all posts

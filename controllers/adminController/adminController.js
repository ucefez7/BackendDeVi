const Admin = require('../../models/adminModel');
const { signToken } = require('../../utils/jwtUtils');

// Login function
exports.login = async function(req, res) {
  const { username, password } = req.body;
  console.log(req.body);

  try {
    const admin = await Admin.findOne({ username });

    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: 'Invalid user' });
    }
    

    const token = signToken(admin._id);
    console.log("varanille data:" +admin._id);
    
    res.json({ token,
      adminId: admin._id,
      username: admin.username
     });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

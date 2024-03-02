const User = require("../model/user.js")
const SendToken = require("../utils/jwt_token.js")
const { sendEmail } = require("../utils/sendEmail")
const crypto = require('crypto');
const { findOne } = require("../model/product.js");


const Register = async (req, res) => {
  try {
    const { name, password, email } = req.body

    if (!name || !password || !email) {
      res.status(401).json({ message: "fill the form" })
    }
    console.log(req.body)
    const user = await new User({
      name, password, email,
      avatar: {
        public_id: "dddwdw",
        url: "profile"
      }
    }).save()
    console.log(user)

    SendToken(user, res, 201)


  } catch (error) {
    console.log(error.stack)
  }


}
const Login = async (req, res) => {
  console.log("ee")
  console.log("h", req.user)
  console.log(req.get("Host"))
  try {
    const { password, email } = req.body
    console.log("1")

    if (!password || !email) {
      res.status(400).json({ message: "fill the form" })
    }
    const user = await User.findOne({ email })
    console.log(user)
    const comparepassword = await user.ComparePassword(password)
    console.log(comparepassword)
    if (!comparepassword) {
      res.status(401).json({ message: "not match" })

    }
    SendToken(user, res, 200)

  } catch (error) {
    console.log("err", error.stack)

  }

}

const LogOut = (req, res) => {
  try {

    // Clear the "token" cookie by setting it to null with appropriate options
    res.cookie("token", null, {
      httpOnly: true,
      expires: new Date(Date.now()),
    });


    //or


    //res.clearCookie("token")
    res.status(200).json({
      message: "logout",
    }); // Send a JSON response indicating successful logout
  } catch (error) {
    console.log(error.stack); // Log any errors that occur during the process
  }
};

const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(401).json({ message: "user not found" })
  }
  const resetToken = user.resetPassword();
  console.log(resetToken, "hola")

  await user.save({ validateBeforeSave: false })
  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/password/reset/${resetToken}`


  const message = `your password reset token is :-\n\n${resetPasswordUrl}\n\n if you have not requested this email then, Please ingore it`

  console.log(resetPasswordUrl,"tok")
  try {

    await sendEmail({
      email: user.email,
      subject: `ecommerce password recovery`,
      message,
      resetPasswordUrl
    })
    res.status(200).json({
      message: `email sent to ${user.email} successfully`
    })
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    console.log(error.stack)
  }
}
const resetPassword = async (req, res) => {
  try {
  const u =    await User.findOne({resetPasswordToken:req.params.token})
  console.log(u,"hey")
     if(u){
       return res.json(u)
     }
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    console.log(req.params.token);

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    console.debug(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    SendToken(user, res, 201);
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({ message: "Server error" });
  }
};
const getUserdetail = async (req, res) => {
  const user = await User.findById(req.user.id).select("+password");
  console.log("start", user)
  res.status(200).json(user)
}


const updateUser = async (req, res) => {
  //also use passowrd from req.userk
  try {
    console.log(req.user.id)
    const user = await User.findOne({ _id: req.user.id }).select("+password");
    console.log("start", user);
    const matchpassword = await user.ComparePassword(req.body.oldpassword);
    console.log(matchpassword);
    if (!matchpassword) {
      res.status(401).json({ message: "user not found" })
    }
    if (req.body.newpassword !== req.body.confirmpassword) {
      res.status(401).json({ message: "pass doesnt match" })
    }
    user.password = req.body.newpassword
    await user.save();
    SendToken(user, res, 200)

  } catch (error) {
    console.log(error.stack)
  }
}



// single user (admin)
const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    res.status(200).json({ user, "message": "single user" })
  } catch (error) {
    console.log(error.stack)
  }

}


// all user (admin)
const getAllUser = async (req, res) => {
  try {
    const user = await User.find();
    if (!user) {
      res.status(404).json({ "message": "not found" })
    }
    res.status(200).json(user)
  } catch (error) {
    console.log(error.stack)

  }

}
//update user role
const updateUserRole = async (req, res) => {
  try {
    console.log(req.user)
    const updateitem = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateitem, {
      new: true,
      runValidators: true,
      useFindAndModify: false
    })
    res.status(200).json(user)
  } catch (error) {
    console.log(error.stack)
  }
}
// delete user admin
const deleteProfile = async (req, res) => {
  try {

    const user = await User.findById(req.params.id)
    console.log("del", user)
    if (!user) {
      res.status(404).json({ message: `${user.username} is deleted` })

    }

    const data = await user.deleteOne()
    res.status(200).json(data)
  } catch (error) {

    res.status(500).json(error)
  }
}
module.exports = {
  LogOut, Login, Register, forgotPassword, resetPassword, getUserdetail, updateUser,
  getSingleUser, getAllUser, updateUserRole, deleteProfile
}


const SendToken =(user,res,statuscode)=>{
    const token =  user.getjwtToken()
    const option = {
        httpOnly:true,
        expires: new Date(
            Date.now() + 1000 *24 * 60 *60 *1000
        )
    }
    res.status(statuscode).cookie("token",token,option).json({
        token,user
    })
}
module.exports = SendToken
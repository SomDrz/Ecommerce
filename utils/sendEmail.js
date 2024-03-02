const nodemailer = require("nodemailer")


const sendEmail = async (options) => {

  const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
      user: 'someshdorjee@gmail.com',
      pass: 'jbdkadtfbtodzdfa'
  }
  })
  const mailOption = {
    from: 'someshdorjee@gmail.com',
    to: options.email,
    subject: options.subejct,
    text: options.message,
    html: `  <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Email</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: sykblue">

        <div style="background: white; max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; text-align: center;">Password Reset</h2>
            <p style="color: #666; text-align: center;">Click the link below to reset your password:</p>
            <div style="text-align: center;">
                <a href="${options.resetPasswordUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
            </div>
            <p style="color: #666; text-align: center; margin-top: 20px;">If you didn't request a password reset, you can ignore this email.</p>
        </div>

    </body>
    </html>`
  }

  transporter.sendMail(mailOption, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });




}


module.exports = { sendEmail }
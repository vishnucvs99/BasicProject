
const nodemailer = require("nodemailer");
const { transporter } = require("../nodemailer");

const recipientNames = ["Harsha", "Nitish"];

// Function to get recipient name based on the index
function getRecipientName(index) {
  return recipientNames[index] || "Recipient";
}

const mailOptions = {
  from: "noreply.covalenseglobal@gmail.com",
  to: "vishnucvs99@gmail.com",
  cc: 'ashachowdary2001@gmail.com',
  subject: "Sending Email using Node.js",
  text: "change password and reset password",
  html: `<h1 style="background-color: blue; color: white;">Insurance Information Bureau of India (IIB-IDAMPRAGYA)</h1>
    <p>Dear testuser,</p>
    <p>Thanks for creating an account on IIB OLB- iPRAN Application.<p/>
    <p> your User Name is ${getRecipientName(0)} </p> 
    <p> your User password is :test@123 </p> 
    <p> Please Login using the below link to Reset password:</p>
    <div style="text-align: center;">
      <a href="YOUR_RESET_PASSWORD_LINK_HERE" style="text-decoration: none;">
        <button style="background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px;">Reset Password</button>
      </a>
    </div>
    <p> you can now access your IIb OLB-PRAN application using above credentials.</p>
    <p> Thanks &Regards,</p>
    <p> Team IIB-OLB </p>
  `,
};

async function emailTransport(req, res) {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    //   res.send({message : "email sent"})
    }
  });
}

module.exports={emailTransport}

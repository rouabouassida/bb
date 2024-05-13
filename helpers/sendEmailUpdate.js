import nodemailer from "nodemailer";

const sendUpdateInfo = async (email, name, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "wafasassi49@gmail.com",
        pass: "xywgeetxyqcqpogd",
      },
    });

    const mailOptions = {
      from: "your_email@example.com",
      to: email,
      subject: "Your Updated Account Information",
      html: `<p>Hello ${name},</p>
             <p>Your account information has been successfully updated.</p>
             <p>Your updated login credentials are:</p>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Password:</strong> ${password}</p>
             <p>Please keep this information secure.</p>
             <p>Regards,</p>
             <p>Your Company</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export { sendUpdateInfo };

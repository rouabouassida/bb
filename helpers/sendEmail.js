import nodemailer from "nodemailer";

const sendNewAccountInfo = async (email, name, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "wafasassi49@gmail.com",
        pass: "xywgeetxyqcqpogd",
      },
    });
    const mailOptions = {
      from: "votre_email@gmail.com", 
      to: email,
      subject: "Your Account Information",
      html: `<p>Hello ${name},</p>
                 <p>Your account has been successfully created.</p>
                 <p>Your login credentials are:</p>
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
const sendNewConge = async ( nomPrenom,  email,  dateDebut,  dateFin) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "wafasassi49@gmail.com",
        pass: "xywgeetxyqcqpogd",
      },
    });
    const mailOptions = {
      from: "votre_email@gmail.com",
      to: email,
      subject: "Your Account Information",
      html: `<p>Hello ${nomPrenom},</p>
      <p>Votre demande de congé pour la période de ${dateDebut} a ${dateFin}  a été approuvée. Profitez bien de votre temps de repos !</p>

      <p>Cordialement,</p>
      
      <p>${nomPrenom}</p>
                 <p>Your Company</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
const sendPasswordReset = (email, password) => {
  
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "wafasassi49@gmail.com",
    pass: "xywgeetxyqcqpogd",
  },
});

  const mailOptions = {
    from: "contact.rh@gmail.com",
    to: email,
    subject: "Password Reset",
    html: `
      <p>Vous avez demandé à réinitialiser votre mot de passe, Voici votre nouveau mot de passe</p>
      <span>Email:${email}</span>
      <span>Password:${password}</span>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error.message);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};
const sendUpdateInfo = async (email, name, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "votre_email@gmail.com",
        pass: "votre_mot_de_passe_gmail",
      },
    });

    const mailOptions = {
      from: "votre_email@gmail.com",
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

export { sendNewAccountInfo, sendUpdateInfo,sendNewConge ,sendPasswordReset};

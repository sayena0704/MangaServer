import { createTransport } from "nodemailer";

export const sendEmail = async (to, subject, text) => {
    
    const transporter = createTransport({

        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    await transporter.sendMail({
        to,
        subject,
        text,
        from: "sayena0704@gmail.com",
    });
};

// import { createTransport } from "nodemailer";

// // Configuration for nodemailer
// const transporter = createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: true, // Use SSL/TLS, true for 465, false for other ports
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//     },
// });

// export const sendEmail = async (to, subject, text) => {
//     try {
//         const info = await transporter.sendMail({
//             from: "your-email@gmail.com",
//             to,
//             subject,
//             text,
//         });
//         console.log("Email sent:", info);
//         return info;
//     } catch (error) {
//         console.error("Error sending email:", error);
//         throw new Error("Failed to send email");
//     }
// };

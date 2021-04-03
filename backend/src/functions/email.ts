import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.dpoczta.pl",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendEmails = (mailList: string[], html: string) => {
    if (!mailList.length) return;

    transporter.sendMail({
        from: 'bot@codeplan.pl',
        to: mailList,
        subject: 'Produkt dostępny!',
        html
    });
}

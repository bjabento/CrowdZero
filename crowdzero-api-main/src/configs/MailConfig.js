module.exports = {
    'Email': process.env.MAIL_EMAIL || "crowdzeroipv@gmail.com",
    'Password': process.env.MAIL_PASSWORD || "pint2021",
    'UrlForConfirmation': process.env.URL_CONFIRMATION || "http://localhost:3001/api/auth/confirm/",
    'UrlForConfirmation2': process.env.URL_CONFIRMATION2 || "http://localhost:3001/api/user/email/confirm/",
    'UrlForConfirmation3': process.env.URL_CONFIRMATION3 || "http://localhost:3002/reset/password/",
};
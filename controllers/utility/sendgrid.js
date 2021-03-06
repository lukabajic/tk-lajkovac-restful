const sendgrid = require("@sendgrid/mail");

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const verifyEmailHtml = (token) =>
  `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;line-height:1.15;color:#262322;background-color:#fff;box-sizing:border-box}*,*::after,*::before{box-sizing:inherit;padding:0;margin:0}.mail{padding:50px 15px;margin:0 auto}.logo{font-weight:900;line-height:1.15;letter-spacing:-2px;font-size:32px;text-align:center;margin:0 0 30px}.color{color:#22b186}.header{font-weight:500;text-align:center;margin:0 0 15px}.paragraph{font-weight:400;text-align:center;opacity:0.75;margin:0 0 30px}.link,.link::visited,.link::link,.link::active,.link::focused{display:block;width:100%;max-width:320px;margin:0 auto;padding:15px 30px;border:0;border-radius:10px;background-color:#22b186;font-weight:500;text-align:center;text-decoration:none;color:#fff !important}@media only screen and (min-width: 768px){.mail{max-width:90%;padding:80px 30px}}</style></head><body> <main class="mail"><h1 class="logo">TK <span class="color">Lajkovac</span>.</h1><h3 class="header"> Uspešno ste se registrovali na web aplikaciju teniskog kluba Lajkovac.</h3><p class="paragraph"> Molimo vas da potvrdite vašu email adresu klikom na link ispod.</p> <a class="link" href="https://evening-escarpment-22046.herokuapp.com/api/v1/user/verify-email/${token}" >Potvrdite email</a > </main></body></html>`;

const passwordHtml = (password) =>
  `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Open Sans","Helvetica Neue",sans-serif;line-height:1.15;color:#262322;background-color:#fff;box-sizing:border-box}*,*::after,*::before{box-sizing:inherit;padding:0;margin:0}.mail{padding:50px 15px;margin:0 auto;display:flex;flex-direction:column;align-items:center}.logo{font-weight:900;line-height:1.15;letter-spacing:-2px;font-size:32px;text-align:center;margin:0 0 30px}.color{color:#22b186}.header{font-weight:500;text-align:center;margin:0 0 15px}.paragraph{font-weight:400;opacity:0.75;margin:0 0 5px 0;vertical-align:baseline;text-align:center;line-height:24px}.password{margin:0 0 30px}.new-password{font-weight:700;margin-left:5px}.link,.link::visited,.link::link,.link::active,.link::focused{display:block;width:100%;max-width:320px;margin:0 auto;padding:15px 30px;border:0;border-radius:10px;background-color:#22b186;font-weight:500;text-align:center;text-decoration:none;color:#fff !important}@media only screen and (min-width: 768px){.mail{max-width:90%;padding:80px 30px}}</style></head><body> <main class="mail"><h1 class="logo">TK <span class="color">Lajkovac</span>.</h1><h3 class="header">Uspešno ste promenili šifru.</h3><p class="password"> <span class="paragraph">Vaša nova lozinka je:</span> <span class="new-password">${password}</span></p><p class="paragraph"> Ovu lozinku možete sada iskoristiti da se ulogujete. Posle toga je možete promeniti u opcijama.</p> </main></body></html>`;

exports.passwordMail = (email, password) =>
  sendgrid.send({
    to: email,
    from: "me@lukabajic.dev",
    subject: "Nova lozinka",
    html: passwordHtml(password),
  });

exports.sendVerificationMail = (token, email) =>
  sendgrid.send({
    to: email,
    from: "me@lukabajic.dev",
    subject: "Potvrda email adrese",
    html: verifyEmailHtml(token),
  });

import { EmailBuilder } from "../utils/emailClient";
import { SendEmailForgotPassword } from "../utils/sendEmailForgotPassword";
import { NEW_USER_SIGNUP } from "../constants/emailTemplate";
import { User } from "../app/user/user.entity";
import { userData } from "../app/interface";

const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");
const fs = require("fs");

const file = "/public/mails/signUp.html";
const stringTemplate = fs.readFileSync("./" + file, "utf8");

export const sendForgotPassword = (userData: User) => {
  const toEmail = [];
  toEmail.push(userData.email);
  const username = userData.fullName;
  const verifyToken = userData.token;
  const eb = new SendEmailForgotPassword(
    NEW_USER_SIGNUP,
    toEmail,
    username,
    verifyToken
  );
  return eb.send();
};

export const signupEmailVerify = async (userData: userData) => {
  const transporter = nodemailer.createTransport(
    sendGridTransport({
      auth: {
        api_key: String(process.env.SENDGRID_KEYS),
      },
    })
  );

  const username = `${userData.fullName}`;
  return await new Promise((resolve, reject) => {
    transporter
      .sendMail({
        to: userData.email,
        from: process.env.FROM_EMAIL,
        subject: "Please verify your email address!",
        html: `
        <table align="center" bgcolor="#EFEEEA" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%">
          <tbody><tr>
              <td align="center" valign="top" style="padding-bottom:60px">
                  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%">
                      
                      <tbody><tr>
                          <td align="center" valign="top" bgcolor="#FFE01B" style="background-color:#2849fc">
                              
                              <table align="center" border="0" cellpadding="0" cellspacing="0" style="max-width:640px" width="100%">
                                  <tbody><tr>
                                      <td align="center" valign="top" style="padding:40px">
                                          <a href="#" style="text-decoration:none" target="_blank">
                                              <h1  style="border:0;color:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,Verdana,sans-serif;font-size:42px;font-weight:400;height:auto;letter-spacing:1px;padding:0;margin:0;outline:none;text-align:center;text-decoration:none" >passdown.</h1>
                                              </a>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style="background-color:#ffffff;padding-top:40px">&nbsp;</td>
                                  </tr>
                              </tbody></table>
                              
                          </td>
                      </tr>
                      
                      
                      <tr>
                          <td align="center" valign="top">
                              <table align="center" bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0" style="background-color:#ffffff;max-width:640px" width="100%">
                                  <tbody><tr>
                                      <td align="center" valign="top" bgcolor="#FFFFFF" style="padding-right:40px;padding-bottom:40px;padding-left:40px">
                                          <h1 style="color:#241c15;font-family:Georgia,Times,'Times New Roman',serif;font-size:30px;font-style:normal;font-weight:400;line-height:42px;letter-spacing:normal;margin:0;padding:0;text-align:center">We're glad you're here,<br>${username}</h1>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td align="center" valign="middle" style="padding-right:40px;padding-bottom:60px;padding-left:40px">
                                          <table border="0" cellspacing="0" cellpadding="0">
                                              <tbody><tr>
                                                  <td align="center" bgcolor="#2849fc"><a href=${process.env.SERVER_URL}/verify-email/${userData.token} style="border-radius:0;border:1px solid #2849fc;color:#ffffff;display:inline-block;font-size:16px;font-family:'Helvetica Neue',Helvetica,Arial,Verdana,sans-serif;font-weight:400;letter-spacing:.3px;padding:20px;text-decoration:none" target="_blank" >Activate Account</a>
                                                  </td>
                                              </tr>
                                          </tbody></table>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td align="center" valign="top" style="padding-right:40px;padding-bottom:40px;padding-left:40px">
                                          <p style="color:#6a655f;font-family:'Helvetica Neue',Helvetica,Arial,Verdana,sans-serif;font-size:16px;font-style:normal;font-weight:400;line-height:42px;letter-spacing:normal;margin:0;padding:0;text-align:center">(Just confirming you're you.)</p>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td align="center" valign="top" style="border-top:2px solid #efeeea;color:#6a655f;font-family:'Helvetica Neue',Helvetica,Arial,Verdana,sans-serif;font-size:12px;font-weight:400;line-height:24px;padding-top:40px;padding-bottom:40px;text-align:center">
                                          <p style="color:#6a655f;font-family:'Helvetica Neue',Helvetica,Arial,Verdana,sans-serif;font-size:12px;font-weight:400;line-height:24px;padding:0 20px;margin:0;text-align:center">© 2014-2023 <span>passdown.</span> All Rights Reserved.</p>
                                      </td>
                                  </tr>
                              </tbody></table>
                              
                          </td>
                      </tr>
                      
                  </tbody></table>
              </td>
            </tr>
          </tbody>
        </table>
        `,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const sendEmail = async (data) => {
  const transporter = nodemailer.createTransport(
    sendGridTransport({
      auth: {
        api_key: String(process.env.SENDGRID_KEYS),
      },
    })
  );
  return await new Promise((resolve, reject) => {
    transporter
      .sendMail({
        to: data.sendEmail,
        from: process.env.FROM_EMAIL,
        subject: data.subject,
        html: data.html,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// import * as consolidate from 'consolidate';
// import * as path from 'path';
import { NarrationEmailTemplateType } from '../constants/emailTemplate';
import { AWS_KEYS } from '../config/AwsConfig'

const AWS = require('aws-sdk');

const SES_CONFIG = {
  accessKeyId: AWS_KEYS.accessKeyId,
  secretAccessKey: AWS_KEYS.secretAccessKey,
  region: AWS_KEYS.region,
};

const AWS_SES = new AWS.SES(SES_CONFIG);

export class SendEmailForgotPassword {

  // private static parseBody(view: string, data: any): Promise<any> {

  //   return new Promise<string>((resolve: any, reject: any) => {
  //     const fileName = path.join(__dirname, '/../', view);
  //     consolidate.swig(fileName, data, (err: any, html: string) =>
  //       err ? reject(err) : resolve(html)
  //     );
  //   });
  // }

  private template: NarrationEmailTemplateType;
  private to: string[];
  private from: string;
  private subject: string;
  private username: string;
  private token: string;

  constructor(template: NarrationEmailTemplateType, to: string[], username: string, token: string) {
    this.template = template;
    this.to = to;
    this.from = template.from;
    this.subject = template.subject;
    this.username = username;
    this.token = token;
  }

  public setFrom(from: string): any {
    this.from = from;
  }

  public setSubject(subject: string): any {
    this.subject = subject;
  }

  public send(): any {
    const { to, from, subject, template, username, token } = this;
    const params = {
      Source: from,
      Destination: {
        ToAddresses: to,
      },
      ReplyToAddresses: [from],
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<p>NarrationBot password reset</p><p>We heard that you lost your NarrationBot password. Sorry about that! But don’t worry! You can use the following button to reset your password:</p><br /><p style="text-align: center;"><a href=${process.env.SERVER_URL}/change-pass/${token} target="_blank" style="background:#75AC2A;width:65%;font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; letter-spacing: 0.05rem; padding: 15px 25px; border-radius: 2px; border-radius: 5px; display: block;text-transform: uppercase;text-align: center;margin: auto;">Reset your password</a></p>`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `${subject}`,
        }
      },
    };
    return AWS_SES.sendEmail(params).promise();
  }

}
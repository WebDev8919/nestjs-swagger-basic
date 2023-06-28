import {AWS_KEYS} from '../config/AwsConfig'

interface NarrationEmailTemplate {
  name: string;
  from: string;
  subject: string;
  view: string;
}

// verification emails
type NEW_USER_SIGNUP = NarrationEmailTemplate;

export const NEW_USER_SIGNUP: NEW_USER_SIGNUP = {
  name: 'NarrationBot',
  from: AWS_KEYS.aws_ses_email,
  subject: 'Please Verify your Email!',
  view: 'emails/email-verify.html',
};

export type NarrationEmailTemplateType =
  | NEW_USER_SIGNUP

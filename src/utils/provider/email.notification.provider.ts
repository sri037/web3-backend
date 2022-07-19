import * as path from 'path';
import * as nodeMailer from 'nodemailer';

const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const {errorLog} = require('@utils/logger');

class EmailNotificationProvider {
    mailConfig: any;
    smtpTransport: any;

    constructor() {
        if (process.env.MAIL_PASS) {
            try {
                this.setUpSMTPServer()
                    .then(r => {
                        this.smtpTransport = r;
                        console.log('smtp server setup');
                    })
                    .catch((error) => {
                        errorLog.error('setUpSMTPServer', error);
                        throw error;
                    });
            } catch (e) {
                throw e;
            }
        } else {
            this.mailConfig = {
                mailer: {
                    from: process.env.MAIL_FROM,
                    options: {
                        service: process.env.MAIL_SERVICE,
                        auth: {
                            user: process.env.MAIL_FROM,
                            pass: process.env.MAIL_PASS
                        }
                    }
                }
            };
            this.smtpTransport = nodeMailer.createTransport(this.mailConfig.mailer.options);
        }
    }

    public async setUpSMTPServer() {
        const oauth2Client = new OAuth2(
            process.env.MAIL_CLIENT_ID,
            process.env.MAIL_CLIENT_SECRET,
            'https://developers.google.com/oauthplayground'
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.MAIL_REFRESH_TOKEN
        });

        const accessToken = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    reject();
                }
                resolve(token);
            });
        });

        return nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.MAIL_FROM,
                accessToken,
                clientId: process.env.MAIL_CLIENT_ID,
                clientSecret: process.env.MAIL_CLIENT_SECRET,
                refreshToken: process.env.MAIL_REFRESH_TOKEN
            }
        });
    }

    /**
     * @function Send the email notification
     * @author @Laxmi
     * @param res - HTTP response object
     * @param templatePath - Path of the email template
     * @param templateObject - Contains details like username, company name, activation link etc that the template requires
     * @param sendTo - email address of the recipient
     * @param subject - subject of the email to be sent
     * @returns resolve object with true if success else reject object with error code
     */
    public sendEmail(res: any, templatePath: string, templateObject: any, sendTo: string, subject: string): Promise<any> {

        return new Promise(async (resolve: any, reject: any): Promise<any> => {
            try {
                let templateContent: any = await this._renderEmailTemplate(res, templatePath, templateObject);
                let response: any = await this._sendEmail(sendTo, subject, templateContent);

                resolve(response);
            } catch (e) {
                return reject(e);
            }
        });
    }

    /**
     * @function Creating the email template with all required data
     * @author Laxmi
     * @param res - HTTP response object
     * @param templatePath - Path of the email template
     * @param templateObject - Contains details like username, company name, activation link etc that the template requires
     * @return resolve object with email html template else reject object with error code
     */
    private _renderEmailTemplate(res: any, templatePath: string, templateObject: any): Promise<any> {
        return new Promise((resolve: any, reject: any): any => {
            res.render(path.resolve(templatePath), {
                templateObject: templateObject
            }, (err: any, emailHTML: any) => {
                if (err) {
                    console.error('error', 'Create template err ' + err);

                    return reject({
                        code: 'FAILED_SENDING_EMAIL'
                    });
                } else {
                    return resolve(emailHTML);
                }
            });
        });
    }

    /**
     * @function Send email to user
     * @author Laxmi
     * @param sendTo - email address of recipient
     * @param subject - subject of the email to be sent
     * @param emailContent - email content
     * @return resolve object with true if success else reject object with error code
     */
    public _sendEmail(sendTo: string, subject: string, emailContent: any): Promise<any> {
        return new Promise((resolve: any, reject: any): any => {
            // mail variable
            let mailOptions: any = {
                to: sendTo,
                from: process.env.MAIL_FROM,
                subject: subject,
                html: emailContent
            };

            // Sending mail
            this.smtpTransport.sendMail(mailOptions, (err: any) => {
                if (err) {
                    console.error('error', 'Failed to send mail ' + err);

                    return reject({
                        code: 'FAILED_SENDING_EMAIL'
                    });
                } else {
                    return resolve(true);
                }
            });
        });
    }
}

export const emailNotificationProvider: EmailNotificationProvider = new EmailNotificationProvider();

import { getEnv } from "@src/utils/constants";
import { BadRequest, Errors } from "@src/utils/errors";
import nodemailer from "nodemailer";

export class EmailAdaptor {
  private ConstantEnvs = getEnv();

  public async sendEmail({
    userEmail,
    title,
    text,
  }: {
    userEmail: string;
    title: string;
    text: string;
  }): Promise<void> {
    const email = this.ConstantEnvs.email.user;
    const emailPassword = this.ConstantEnvs.email.password;
    const host = this.ConstantEnvs.email.host;
    const port = this.ConstantEnvs.email.port;
    const secure = this.ConstantEnvs.email.secure;

    if (!email || !emailPassword) throw new BadRequest(Errors.EMAIL_SENDING_ERROR);

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user: email,
        pass: emailPassword,
      },
    });

    const emailInfos = {
      from: email,
      to: userEmail,
      subject: title,
      text: text,
    };

    transporter.sendMail(emailInfos, (error, info) => {
      if (error) {
        console.log("ERRO AO ENVIAR EMAIL:", error);
      } else {
        console.log("EMAIL ENVIADO COM SUCESSO:", info.response);
      }
    });
  }
}

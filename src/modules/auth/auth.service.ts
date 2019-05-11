import User from "../user/user.model";
import { sign } from "jsonwebtoken";
import { AES } from "crypto-js";
const { APP_SECRET_KEY } = process.env;

class AuthService {
  public secretKey: string = APP_SECRET_KEY || "";

  // private forgotEmailConfig: any = {
  //   from: "no-reply <no-reply@mail.com>",
  //   subject: "Recuperacão de senha",
  //   template: "auth/forgot_password"
  // };

  // public sendForgotPasswordEmail = async (
  //   to: string,
  //   token: any
  // ): Promise<any> => {
  //   await mailer.sendMail({
  //     ...this.forgotEmailConfig,
  //     to,
  //     context: { token }
  //   });
  // };

  public generateToken = async (
    email: string
  ): Promise<{ token: string; expires_in: number | string }> => {
    const now = new Date();
    const expires_in = now.setHours(now.getHours() + 1);
    const token = sign({ email, exp: expires_in }, this.secretKey);

    return { token, expires_in };
  };

  public createResetToken = async (email: string): Promise<string> => {
    const now = new Date();
    const reset_password_token = AES.encrypt(
      email,
      this.secretKey
    ).toString();
    const reset_password_expires = now.setHours(now.getHours() + 24);

    await User.update(
      {
        reset_password_token,
        reset_password_expires
      },
      { where: { email } }
    );

    return reset_password_token;
  };
}

export default new AuthService();

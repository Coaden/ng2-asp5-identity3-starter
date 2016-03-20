export class ResetPasswordViewModel {
    public userId: string;
    public code: string;
    public password: string;
    public confirmPassword: string;

    constructor(userId: string, code: string, pasword: string, confirmPassword: string) {
        this.userId = userId;
        this.code = code;
        this.password = pasword;
        this.confirmPassword = confirmPassword;
    }
}

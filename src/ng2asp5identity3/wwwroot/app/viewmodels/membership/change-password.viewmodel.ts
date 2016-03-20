export class ChangePasswordViewModel {
    public oldPassword: string;
    public newPassword: string;
    public confirmPassword: string;

    constructor(oldPassword: string, newPasword: string, confirmPassword: string) {
        this.oldPassword = oldPassword;
        this.newPassword = newPasword;
        this.confirmPassword = confirmPassword;
    }
}

export class RegisterViewModel {
    public email: string;
    public password: string;
    public confirmPassword: string;
    
    constructor(email: string, pasword: string, confirmPassword: string) {
        this.email = email;
        this.password = pasword;
        this.confirmPassword = confirmPassword;
    }
}

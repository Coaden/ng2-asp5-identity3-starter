export class LoginViewModel {
    public email: string;
    public password: string;
    public rememberMe: boolean;

    constructor(email: string, pasword: string, rememberMe: boolean, loggedIn: boolean) {
        this.email = email || '';
        this.password = pasword || '';
        this.rememberMe = rememberMe || false;
    }
}

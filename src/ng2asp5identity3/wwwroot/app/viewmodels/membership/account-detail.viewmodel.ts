export class AccountDetailViewModel {
    public firstName: string;
    public lastName: string;
    public company: string;
    public phone: string;

    constructor(firstName: string, lastName: string, company: string, phone: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.company = company;
        this.phone = phone;
    }
}

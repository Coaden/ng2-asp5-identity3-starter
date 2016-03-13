import {AppSettings} from './app-settings';
import {Message} from '../models/message.model';

// Do not change for localization
export var MessageType = {
    info: 'info',
    success: 'success',
    warning: 'warning',
    error: 'error'
}

// Change this section to localize your application
export var StrResources = {

    // Membership Form Validation
    membershipValidation: {
        emailRequired: 'Email is required.',
        emailInvalid: 'Please enter a valid email.',
        passwordRequired:'Password is required.',
        confirmPasswordRequired: 'Comfirm Password is required.',
        passwordLength: 'Password must be at least ' + AppSettings.minPasswordLength + ' characters.',
        passwordMismatch: 'Your passwords do not match.'
    },

    // Memebership Forms string constants
    membershipForms: {
        // Form Titles
        resetPasswordTitle: 'Reset Password',
        registerTitle: 'Register',
        loginTitle: 'Login',
        forgotPasswordTitle: 'Forgot Password',
        notificationTitle: 'Membership Notification',
        changePasswordTitle: 'Change Password',
        userDetailsTitle: 'User Details',

        // Form Fields
        email: 'Email',
        emailPlaceholder: 'Enter your email address',
        password: 'Password',
        passwordPlaceholder: 'Enter your password',
        newPassword: 'Password',
        newPasswordPlaceholder: 'Enter your new password',
        confirmPassword: 'Confirm Password',
        confirmPasswordPlaceholder: 'Confirm your password',
        oldPassword: 'Old Password',
        oldPasswordPlaceholder: 'Enter your current password',
        firstName: 'First',
        firstNamePlaceholder: 'First Name',
        lastName: 'Last',
        lastNamePlaceholder: 'Last Name',
        company: 'Company',
        companyPlaceholder: 'Company',
        phone: 'Phone',
        phonePlaceholder: 'Phone',

        // Action Links
        registerLink: 'Register',
        loginLink: 'Login',
        forgotPasswordLink: 'Forgot Password',

        // Action Buttons
        resetPasswordButton: 'Reset Password',
        loginButton: 'Log In',
        submitButton: 'Submit',
        registerButton: 'Register',
        saveButton: 'Save',
        backButton: 'Go Back',

        //Form Text
        dontHaveAccount: 'Don\'t have an account?',
        alreadyHaveAccount: 'Already have an account?',
        forgotPassword: 'Forgot Password?',
        rememberMe: 'Remember Me',
        returnTo: 'Return To',

        // Menbership Menu Texts
        accountSettings: 'Account Settings',
        logout: 'Logout',

    },

    // Membership Popup Menu
    loginPopup: {
        iconText: 'Login',
        manageAccountToolTip: 'Click here to manage account.',
        loginToolTip: 'Click here to login or register.'
    },

    // Home Page - Not Secured
    homePage: {
        h1: 'This is the Home Page',
        h2: 'Customize this any way you want.',
        getStarted: 'Get Started'
    },

    // Sidebar Menu
    sidebar: {
        iconText: '',
        iconToolTip: 'Click here to open the menu.',
        home: 'Home',
        companies: 'Companies',
        accountSettings: 'Account Settings',
        loginRegister: 'Login / Register',
        logout: 'Logout'
    },

    // Generic Validation Messages
    generic: {
        fieldRequired: 'This field is required',
        fieldInvalid: 'This field is invalid',
        serverError: 'Server communication error.'
    },

    // Message Default Title
    messageTitle: 'Notice',

    message: {
        // Membership Notification Messages:
        UnexpectedError: new Message({type: MessageType.success, icon: '', title: 'Unexpected Error', content: 'Oooops, an unexpected error has occurred, how embarrassing.'}),
        ForgotPasswordEmailSent: new Message({type: MessageType.info, icon: '', title: 'Forgot Password Email Sent', content: 'An email has been sent to the address you specified, please follow the link to reset your password.'}),
        ConfirmEmailSent: new Message({type: MessageType.info, icon: '', title: 'Confirmation Email Sent', content: 'An email has been sent to the address you specified, please click the link in the email to confirm your account.'}),
        YouAreConfirmed: new Message({type: MessageType.success, icon: '', title: 'Thank You For Confirming Your Email', content: 'Thank you for confirming your email, you are now active.'}),
        PasswordChanged: new Message({type: MessageType.success, icon: '', title: 'Password Changed', content: 'You have reset your password.  Please keep your new password safe.  You may now loggin using your new password.'}),
        NotConfirmed: new Message({type: MessageType.warning, icon: '', title: 'Account Not Confirmed', content: 'The account you are using has not been confirmed.  Please check your inbox for a confirmation email from us.  If you have trouble finding it check your spam folder.'}),
        NotLoggedIn: new Message({type: MessageType.warning, icon: '', title: 'User Not Logged In', content: 'You have not logged in.  You may access the appication after you have successfully logged in.'}),
        ErrorChangingPassword:  new Message({type: MessageType.error, icon: '', title: 'Password Not Changed', content: 'The new password chosen cannot be uses.  Try again with a different password.  Must be 8 characters long, and contain, a lower, upper, special character, and a number.'}),
        UserPollCommunicationError: new Message({type: MessageType.error, icon: '', title: 'Communication Error', content: 'Failed to poll current user information.'}),
        NotPermitted:  new Message({type: MessageType.warning, icon: '', title: 'Permissions Error', content: 'We\'re sorry, but you do not have permission to go there.'}),

        // System Wide Messages:
        GenericComplete: new Message({type: MessageType.success, icon: '', title: 'Completed', content: 'The operation Completed successfully.'}),
        GenericError: new Message({type: MessageType.error, icon: '', title: 'Error', content: 'The operation did not Complete successfully.  There was an error.'}),
        GenericCommunicationError: new Message({type: MessageType.error, icon: '', title: 'Communication Error', content: 'An error occured communicating with the server.'})

    }
}

interface ContactFormData {
    name: string;
    email: string;
    message: string;
    recaptcha: string;
}

interface ContactFormResponse {
    success: boolean;
}
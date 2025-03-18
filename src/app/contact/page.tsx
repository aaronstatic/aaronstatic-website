import React from 'react';
import ContactForm from './ContactForm';

export const metadata = {
    title: 'Aaron Static - Contact'
}

export default function Contact() {
    return (
        <main className="container py-5">
            <h1 className="mb-4">Contact</h1>
            
            <div className="row">
                <div className="col-md-8 col-lg-6">
                    <ContactForm />
                </div>
            </div>
        </main>
    )
}
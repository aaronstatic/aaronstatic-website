'use client';

import { useState, useRef } from 'react';
import ReCAPTCHA from "react-google-recaptcha";

export default function ContactForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Reset status
        setStatus('loading');
        setErrorMessage('');
        
        // Get reCAPTCHA token
        const token = recaptchaRef.current?.getValue();
        if (!token) {
            setStatus('error');
            setErrorMessage('Please complete the reCAPTCHA verification');
            return;
        }
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    message,
                    token,
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            
            // Reset form
            setName('');
            setEmail('');
            setMessage('');
            recaptchaRef.current?.reset();
            setStatus('success');
        } catch (error) {
            setStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="form-control"
                />
            </div>
            
            <div className="mb-3">
                <label htmlFor="email" className="form-label">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="form-control"
                />
            </div>
            
            <div className="mb-3">
                <label htmlFor="message" className="form-label">
                    Message
                </label>
                <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="form-control"
                />
            </div>
            
            <div className="mb-3">
                <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                />
            </div>
            
            {status === 'error' && (
                <div className="alert alert-danger" role="alert">
                    {errorMessage}
                </div>
            )}
            
            {status === 'success' && (
                <div className="alert alert-success" role="alert">
                    Your message has been sent successfully!
                </div>
            )}
            
            <button
                type="submit"
                disabled={status === 'loading'}
                className="btn btn-primary"
            >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
        </form>
    );
} 
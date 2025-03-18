declare module 'react-google-recaptcha' {
  import * as React from 'react';
  
  export interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (token: string | null) => void;
    grecaptcha?: any;
    theme?: 'dark' | 'light';
    size?: 'compact' | 'normal' | 'invisible';
    tabindex?: number;
    onExpired?: () => void;
    onErrored?: () => void;
    ref?: React.RefObject<ReCAPTCHA>;
  }
  
  export default class ReCAPTCHA extends React.Component<ReCAPTCHAProps> {
    reset(): void;
    execute(): Promise<string>;
    getValue(): string | null;
  }
} 
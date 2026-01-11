import React from 'react';
import { useForm, ValidationError } from '@formspree/react';
import './ContactForm.css';

export default function ContactForm() {
  const [state, handleSubmit] = useForm("xpzkwlbj");

  if (state.succeeded) {
    return (
      <div className="contact-form-container">
        <div className="success-message">
          <div className="success-message-icon">✓</div>
          <h3 className="success-message-title">Message Sent!</h3>
          <p className="success-message-text">
            Thanks for reaching out! We'll get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-form-container">
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="form-input"
            placeholder="your@email.com"
            required
          />
          <ValidationError
            prefix="Email"
            field="email"
            errors={state.errors}
            className="validation-error"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message" className="form-label">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            className="form-textarea"
            placeholder="How can we help you?"
            required
          />
          <ValidationError
            prefix="Message"
            field="message"
            errors={state.errors}
            className="validation-error"
          />
        </div>

        <button
          type="submit"
          disabled={state.submitting}
          className="button button--primary submit-button"
        >
          {state.submitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}
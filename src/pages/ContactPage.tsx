import React from 'react';
import ContactForm from '../components/ContactForm/ContactForm';
import './ContactPage.css';

function ContactPage() {
  const contactData = [
    {
      icon: '📞',
      label: 'Телефон',
      value: '+373 (79) 123-456'
    },
    {
      icon: '✉️',
      label: 'Почта',
      value: 'udrive@help.com'
    },
    {
      icon: '📱',
      label: 'Instagram',
      value: '@udrive'
    },
    {
      icon: '💬',
      label: 'Telegram',
      value: '@udrive'
    }
  ];

  return (
    <div className='contact-page'>
      <section className='contact-hero'>
        <h1>Свяжитесь с нами</h1>
        <p>Мы всегда готовы помочь вам и ответить на все вопросы</p>
      </section>

      <div className='contact-content'>
        <div className='contact-info-section'>
          <h2>Наши контакты</h2>
          <div className='contact-grid'>
            {contactData.map((contact, index) => (
              <div 
                key={index} 
                className='contact-card'
              >
                <div className='contact-icon'>{contact.icon}</div>
                <div className='contact-text'>
                  <h3>{contact.label}</h3>
                  <p>{contact.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}

export default ContactPage;

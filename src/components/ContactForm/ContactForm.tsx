import React, { useState } from 'react'
import './ContactForm.css'

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь можно отправить данные на сервер
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className='contact-form-container'>
      <div className='contact-form'>
        <h2 className='form-title'>Обратная связь</h2>
        <p className='form-subtitle'>Мы ответим вам в течении 12 часов</p>
        
        {submitted && <div className='form-success'>✓ Сообщение отправлено успешно!</div>}
        
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <input
              type='text'
              name='name'
              placeholder='Ваше имя'
              value={formData.name}
              onChange={handleChange}
              required
              className='form-input'
            />
          </div>

          <div className='form-group'>
            <input
              type='email'
              name='email'
              placeholder='Ваша почта'
              value={formData.email}
              onChange={handleChange}
              required
              className='form-input'
            />
          </div>

          <div className='form-group'>
            <textarea
              name='message'
              placeholder='Ваш вопрос'
              rows={5}
              value={formData.message}
              onChange={handleChange}
              required
              className='form-textarea'
            ></textarea>
          </div>

          <button type='submit' className='form-button'>Отправить</button>
        </form>
      </div>
    </div>
  )
}

export default ContactForm;
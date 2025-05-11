'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border border-[#8E8383] rounded-md font-outfit text-[#555454] focus:outline-none focus:border-[#4A3AFF] focus:ring-1 focus:ring-[#4A3AFF]"
          required
        />
      </div>
      
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border border-[#8E8383] rounded-md font-outfit text-[#555454] focus:outline-none focus:border-[#4A3AFF] focus:ring-1 focus:ring-[#4A3AFF]"
          required
        />
      </div>
      
      <div>
        <textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          className="w-full p-3 border border-[#8E8383] rounded-md font-outfit text-[#555454] focus:outline-none focus:border-[#4A3AFF] focus:ring-1 focus:ring-[#4A3AFF] resize-none"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-[#4A3AFF] text-white font-outfit font-medium text-lg py-3 px-6 rounded-md hover:bg-[#3929CC] transition-colors"
      >
        Send Message
      </button>
    </form>
  );
}
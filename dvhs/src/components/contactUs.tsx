import React, { useState } from "react";
import "../css/contact.css";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<keyof ContactFormData, string>>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = (): boolean => {
    const newErrors = { name: "", email: "", phone: "", message: "" };
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }
  };
  return (
    <div className="contact-form-box">
      <div className="contact-form-header">
        <h2>CONTACT US</h2>
      </div>
      <hr />
      <div className="form-content">
        <form
          onSubmit={handleSubmit}
          className="contact-form"
          noValidate
        >
          <div className="contact-form-field">
            <input
              required
              type="text"
              name="name"
              className="contact-form-name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <div className="contact-form-field">
            <input
              required
              name="email"
              type="text"
              className="contact-form-email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="contact-form-field">
            <input
              required
              name="phone"
              type="text"
              className="contact-form-phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>
          <div className="contact-form-field">
            <textarea
              required
              name="message"
              className="contact-form-message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Question or Message"
            />
            {errors.message && <span className="error">{errors.message}</span>}
          </div>
          <span className="contact-form-concent">
            *By clicking "Submit" you are expressly concenting to receive
            communications from Desert Valley Home Search and its affiliates via
            email, phone, or text. You may opt out at any time. Your information
            will not be shared with or sold to any third parties. For more
            information, please see our{" "}
            <a
              href=""
              className="terms"
            >
              Terms of Use
            </a>{" "}
            and{" "}
            <a
              href=""
              className="privacy"
            >
              Privacy Policy
            </a>
            .
          </span>
          <button className="contact-form-submit-btn">SUBMIT</button>
        </form>
      </div>
    </div>
  );
};

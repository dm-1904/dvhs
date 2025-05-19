import React, { useState } from "react";
import "../css/contact.css";

interface HomeValueFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  message: string;
}

interface HomeValueFormProps {
  onSubmit: (data: HomeValueFormData) => void;
}

export const HomeValueForm: React.FC<HomeValueFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<HomeValueFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<keyof HomeValueFormData, string>>(
    {
      name: "",
      email: "",
      phone: "",
      address: "",
      message: "",
    }
  );

  /* ------------ handlers ------------ */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {
      name: "",
      email: "",
      phone: "",
      address: "",
      message: "",
    };

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      setFormData({ name: "", email: "", phone: "", address: "", message: "" });
    }
  };

  /* ------------ render ------------ */
  return (
    <div className="contact-form-box">
      <div className="contact-form-header">
        <h2>REQUEST A FREE HOME VALUE ESTIMATE</h2>
      </div>
      <hr />

      <div className="form-content">
        <form
          onSubmit={handleSubmit}
          className="contact-form"
          noValidate
        >
          {/* Name */}
          <div className="contact-form-field">
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
            />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="contact-form-field">
            <input
              required
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          {/* Phone */}
          <div className="contact-form-field">
            <input
              required
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>

          {/* Address */}
          <div className="contact-form-field">
            <input
              required
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Property Address"
            />
            {errors.address && <span className="error">{errors.address}</span>}
          </div>

          {/* Message */}
          <div className="contact-form-field">
            <textarea
              required
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your home or any special features"
            />
            {errors.message && <span className="error">{errors.message}</span>}
          </div>

          {/* Arizona-only disclaimer */}
          <p
            style={{ fontSize: "0.85rem", color: "#444", margin: "0 0 0.5rem" }}
          >
            <strong>Disclaimer:</strong> I am licensed only in Arizona and can
            provide market analysis data <em>solely</em> for properties located
            in Arizona.
          </p>

          {/* Consent / privacy notice (unchanged) */}
          <span className="contact-form-concent">
            *By clicking "Submit" you are expressly consenting to receive
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

          <button className="contact-form-submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
};

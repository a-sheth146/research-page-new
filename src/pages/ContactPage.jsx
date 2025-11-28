import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    companyEmail: '',
    firstName: '',
    lastName: '',
    interests: [],
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Check if user came from SWE-bench or CRAVE page
    const source = searchParams.get('source');
    if (source === 'swebench') {
      setFormData(prev => {
        // Only add if not already included
        if (!prev.interests.includes('swe-bench++ data')) {
          return {
            ...prev,
            interests: [...prev.interests, 'swe-bench++ data']
          };
        }
        return prev;
      });
    } else if (source === 'crave') {
      setFormData(prev => {
        // Only add if not already included
        if (!prev.interests.includes('code bench data')) {
          return {
            ...prev,
            interests: [...prev.interests, 'code bench data']
          };
        }
        return prev;
      });
    }
  }, [searchParams]);

  useEffect(() => {
    // Scroll to top when form is submitted
    if (isSubmitted) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isSubmitted]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Security: Apply length limits
    const maxLengths = {
      companyEmail: 254,
      firstName: 50,
      lastName: 50,
      message: 2000
    };
    
    let sanitizedValue = value;
    
    // Security: Sanitize based on field type
    if (name === 'firstName' || name === 'lastName') {
      sanitizedValue = sanitizeName(value);
    } else if (name === 'message') {
      sanitizedValue = sanitizeInput(value);
    } else if (name === 'companyEmail') {
      sanitizedValue = sanitizeInput(value);
    }
    
    // Security: Check for suspicious patterns
    if (containsSuspiciousPattern(sanitizedValue)) {
      setErrors(prev => ({
        ...prev,
        [name]: 'Invalid characters detected. Please use only allowed characters.'
      }));
      return;
    }
    
    // Apply length limit
    if (maxLengths[name] && sanitizedValue.length > maxLengths[name]) {
      sanitizedValue = sanitizedValue.substring(0, maxLengths[name]);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
    // Clear error for interests when user selects a checkbox
    if (errors.interests) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.interests;
        return newErrors;
      });
    }
  };

  // Security: Sanitize input to prevent XSS and injection attacks
  const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    
    // Remove potentially dangerous characters and patterns
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers (onclick, onerror, etc.)
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/expression\(/gi, '') // Remove CSS expressions
      .trim();
  };

  // Security: Validate name input (alphanumeric, spaces, hyphens, apostrophes only)
  const sanitizeName = (name) => {
    if (typeof name !== 'string') return '';
    // Allow letters, spaces, hyphens, apostrophes, and common name characters
    return name.replace(/[^a-zA-Z\s\-'\.]/g, '').trim();
  };

  // Security: Validate email format more strictly
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254; // RFC 5321 max email length
  };

  // Security: Check for suspicious patterns
  const containsSuspiciousPattern = (input) => {
    const suspiciousPatterns = [
      /<script/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /eval\(/gi,
      /expression\(/gi,
      /vbscript:/gi,
      /data:text\/html/gi,
      /&#/gi, // HTML entities
      /%3C/gi, // URL encoded <
      /%3E/gi, // URL encoded >
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(input));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    
    // Security: Final sanitization before submission
    const sanitizedData = {
      companyEmail: sanitizeInput(formData.companyEmail),
      firstName: sanitizeName(formData.firstName),
      lastName: sanitizeName(formData.lastName),
      message: sanitizeInput(formData.message),
      interests: formData.interests // Checkboxes are safe
    };
    
    // Validate all required fields
    const newErrors = {};
    
    if (!sanitizedData.companyEmail.trim()) {
      newErrors.companyEmail = 'Company email is required.';
    } else if (!validateEmail(sanitizedData.companyEmail.trim())) {
      newErrors.companyEmail = 'Please enter a valid email address.';
    } else if (containsSuspiciousPattern(sanitizedData.companyEmail)) {
      newErrors.companyEmail = 'Email contains invalid characters.';
    }
    
    if (!sanitizedData.firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    } else if (sanitizedData.firstName.length < 1 || sanitizedData.firstName.length > 50) {
      newErrors.firstName = 'First name must be between 1 and 50 characters.';
    }
    
    if (!sanitizedData.lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    } else if (sanitizedData.lastName.length < 1 || sanitizedData.lastName.length > 50) {
      newErrors.lastName = 'Last name must be between 1 and 50 characters.';
    }
    
    if (sanitizedData.message.length > 2000) {
      newErrors.message = 'Message must be 2000 characters or less.';
    }
    
    if (formData.interests.length === 0) {
      newErrors.interests = 'Please select at least one interest option.';
    }
    
    // If there are errors, set them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Security: Use sanitized data for email
    const interestsText = sanitizedData.interests.join(', ');
    const emailSubject = encodeURIComponent(`Contact Form Submission from ${sanitizedData.firstName} ${sanitizedData.lastName}`);
    const emailBody = encodeURIComponent(
      `Name: ${sanitizedData.firstName} ${sanitizedData.lastName}\n` +
      `Email: ${sanitizedData.companyEmail}\n` +
      `Interests: ${interestsText}\n` +
      `Message: ${sanitizedData.message || 'No message provided'}`
    );
    
    // Create mailto link
    const mailtoLink = `mailto:ashni.sheth@turing.com?subject=${emailSubject}&body=${emailBody}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show confirmation message
    setIsSubmitted(true);
  };

  const handleReachOutAgain = () => {
    // Reset form and state
    setFormData({
      companyEmail: '',
      firstName: '',
      lastName: '',
      interests: [],
      message: ''
    });
    setErrors({});
    setIsSubmitted(false);
  };

  const interestOptions = [
    'swe-bench++ data',
    'code bench data',
    'RL gyms',
    'other'
  ];

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <div className="px-2 md:px-12 pt-12 pb-16">
        <div className="max-w-2xl mx-auto">
          <motion.h1
            className="text-4xl md:text-5xl text-black mb-4 text-center"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Get in Touch
          </motion.h1>
          <p className="text-black text-center mb-12 max-w-2xl mx-auto">
            Reach out to us for access to our datasets and agentic trajectories, or to just chat about our research. We'd love to collaborate!
          </p>

          {/* Contact Card */}
          <div className="border border-gray-200 rounded-lg p-8">
            {!isSubmitted ? (
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                noValidate
                initial={{ opacity: 1 }}
                animate={{ opacity: isSubmitted ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              >
              {/* Company Email */}
              <div>
                <label htmlFor="companyEmail" className="block text-sm font-medium text-black mb-2">
                  Company Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="companyEmail"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleInputChange}
                  maxLength={254}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-black ${
                    errors.companyEmail ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="your.email@company.com"
                />
                {errors.companyEmail && (
                  <p className="mt-1 text-sm text-red-500">{errors.companyEmail}</p>
                )}
              </div>

              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-black mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    maxLength={50}
                    pattern="[a-zA-Z\s\-'\.]+"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-black ${
                      errors.firstName ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Jane"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-black mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    maxLength={50}
                    pattern="[a-zA-Z\s\-'\.]+"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-black ${
                      errors.lastName ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* What can we chat about? */}
              <div>
                <label className="block text-sm font-medium text-black mb-3">
                  What can we chat about? <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {interestOptions.map((option) => (
                    <label key={option} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.interests.includes(option)}
                        onChange={() => handleCheckboxChange(option)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:outline-none focus:ring-0"
                      />
                      <span className="ml-3 text-black capitalize">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.interests && (
                  <p className="mt-1 text-sm text-red-500">{errors.interests}</p>
                )}
              </div>

              {/* Tell us more! */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                  Tell us more!
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  maxLength={2000}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-black resize-none"
                  placeholder="Share any additional details or questions..."
                />
              </div>

              {/* Contact Us Button */}
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="rounded-full bg-white border border-blue-600 text-sm text-blue-600 px-6 py-2 uppercase hover:bg-blue-50 active:bg-blue-100 transition-colors duration-200"
                >
                  Contact Us
                </button>
              </div>

              {/* Response Time Text */}
              <p className="text-center text-sm text-gray-600">
                We monitor responses frequently and will get back to you soon.
              </p>
            </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-6"
              >
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-semibold text-black">
                    Thank you for reaching out!
                  </h2>
                  <p className="text-black">
                    We've received your message and will get back to you soon.
                  </p>
                </div>
                <div className="flex justify-center pt-4">
                  <button
                    onClick={handleReachOutAgain}
                    className="rounded-full bg-white border border-blue-600 text-sm text-blue-600 px-6 py-2 uppercase hover:bg-blue-50 active:bg-blue-100 transition-colors duration-200"
                  >
                    Reach out again!
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


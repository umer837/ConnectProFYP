import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import contactImage from '@/assets/contact-image.jpg';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('contacts')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            message: formData.message
          }
        ]);

      if (error) {
        console.error('Error submitting contact form:', error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Message Sent!",
          description: "Thank you for contacting us. We'll get back to you soon.",
        });
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4" id="contactTitle">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or need assistance? We're here to help. Reach out to us and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1" id="contactImageSection">
            <img
              src={contactImage}
              alt="Contact us - Professional team ready to help"
              className="w-full h-96 lg:h-full object-cover rounded-lg shadow-md"
              id="contactImage"
            />
          </div>

          {/* Contact Form */}
          <div className="order-1 lg:order-2" id="contactFormSection">
            <div className="bg-card p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-card-foreground mb-6">
                Get in Touch
              </h2>
              
              <form className="space-y-6" id="contactForm" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="nameInput" className="block text-sm font-medium text-card-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="nameInput"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-input-border rounded-lg text-input-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cta-primary focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="emailInput" className="block text-sm font-medium text-card-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="emailInput"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-input-border rounded-lg text-input-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cta-primary focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>


                <div>
                  <label htmlFor="messageInput" className="block text-sm font-medium text-card-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    id="messageInput"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-input border border-input-border rounded-lg text-input-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cta-primary focus:border-transparent resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  id="submitBtn"
                  disabled={loading}
                  className="w-full bg-cta-primary text-cta-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-cta-primary-hover focus:outline-none focus:ring-2 focus:ring-cta-primary focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8" id="contactInfo">
          <div className="text-center" id="addressInfo">
            <h3 className="text-lg font-semibold text-foreground mb-2">Address</h3>
            <p className="text-muted-foreground">
              123 Business Ave<br />
              Suite 100<br />
              City, State 12345
            </p>
          </div>
          
          <div className="text-center" id="phoneInfo">
            <h3 className="text-lg font-semibold text-foreground mb-2">Phone</h3>
            <p className="text-muted-foreground">
              (555) 123-4567<br />
              Monday - Friday: 9AM - 6PM<br />
              Weekend: 10AM - 4PM
            </p>
          </div>
          
          <div className="text-center" id="emailInfo">
            <h3 className="text-lg font-semibold text-foreground mb-2">Email</h3>
            <p className="text-muted-foreground">
              info@connectpro.com<br />
              support@connectpro.com<br />
              We respond within 24 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
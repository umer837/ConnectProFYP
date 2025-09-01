import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import bcrypt from 'bcryptjs';
import userRegImage from '@/assets/registeration.jpg';


const UserRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    city: '',
    fullAddress: '',
    cnicNumber: '',
    password: ''
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profileUrl = '';

      // Upload profile picture if selected
      if (profilePicture) {
        const fileExt = profilePicture.name.split('.').pop();
        const fileName = `${formData.email.replace('@', '_').replace('.', '_')}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('user-profiles')
          .upload(fileName, profilePicture, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('user-profiles')
          .getPublicUrl(fileName);
        
        profileUrl = data.publicUrl;
      }

      // Hash the password before storing
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(formData.password, saltRounds);

      const { error } = await supabase
        .from('users')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone_number: formData.phoneNumber,
            date_of_birth: formData.dateOfBirth,
            gender: formData.gender,
            city: formData.city,
            full_address: formData.fullAddress,
            cnic: formData.cnicNumber,
            password: hashedPassword,
            profile_url: profileUrl
          }
        ]);

      if (error) {
        console.error('Error creating user:', error);
        toast({
          title: "Registration Error",
          description: error.message.includes('duplicate') ? "Email already exists" : "Failed to create account. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Your account has been created successfully. You can now login.",
        });
        navigate('/login');
      }
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Registration Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Left Side - Image */}
        <div className="hidden lg:flex lg:w-1/2">
          <img
            src={userRegImage}
            alt="User Registration"
            className="w-200 h-full object-cover"
            id="userRegImage"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2" id="userRegTitle">
                Create Your Account
              </h2>
              <p className="text-muted-foreground">
                Join ConnectPro and access quality home services
              </p>
            </div>

            <form className="space-y-6" id="userRegistrationForm" onSubmit={handleSubmit}>
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-foreground mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-foreground mb-1">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="profilePicture" className="block text-sm font-medium text-foreground mb-1">
                    Profile Picture (Optional)
                  </label>
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  />
                  {profilePreview && (
                    <div className="mt-2">
                      <img
                        src={profilePreview}
                        alt="Profile Preview"
                        className="w-16 h-16 rounded-full object-cover border border-border"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Location & Security Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Location & Security
                </h3>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-foreground mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="fullAddress" className="block text-sm font-medium text-foreground mb-1">
                    Full Address
                  </label>
                  <textarea
                    id="fullAddress"
                    name="fullAddress"
                    rows={3}
                    value={formData.fullAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                    required
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="cnicNumber" className="block text-sm font-medium text-foreground mb-1">
                    CNIC Number
                  </label>
                  <input
                    type="text"
                    id="cnicNumber"
                    name="cnicNumber"
                    value={formData.cnicNumber}
                    onChange={handleInputChange}
                    placeholder="13 digits (e.g., 1234567890123)"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                id="userRegisterBtn"
                disabled={loading}
                className="w-full bg-cta-primary text-cta-primary-foreground py-3 px-4 rounded-md hover:bg-cta-primary-hover transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-cta-primary hover:text-cta-primary-hover font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import bcrypt from 'bcryptjs';

const WorkerRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: '',
    city: '',
    fullAddress: '',
    designation: '',
    experience: '',
    workingHours: '',
    skills: '',
    cnicNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [cnicError, setCnicError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateCnic = (value: string) => {
    const cnicPattern = /^\d{13}$/;
    if (!cnicPattern.test(value)) {
      setCnicError('CNIC must be exactly 13 digits');
      return false;
    }
    setCnicError('');
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'cnicNumber') {
      if (value.length <= 13) {
        validateCnic(value);
      }
    }
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (!validateCnic(formData.cnicNumber)) {
      setLoading(false);
      return;
    }

    try {
      let profileUrl = '';

      // Upload profile picture if selected
      if (profilePicture) {
        const fileExt = profilePicture.name.split('.').pop();
        const fileName = `${formData.email.replace('@', '_').replace('.', '_')}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('worker-profiles')
          .upload(fileName, profilePicture, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('worker-profiles')
          .getPublicUrl(fileName);
        
        profileUrl = data.publicUrl;
      }

      // Hash the password before storing
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(formData.password, saltRounds);

      const { error } = await supabase
        .from('workers')
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
            designation: formData.designation,
            experience: parseInt(formData.experience) || 0,
            preferred_working_hours: formData.workingHours,
            skills: formData.skills,
            cnic: formData.cnicNumber,
            password: hashedPassword,
            profile_url: profileUrl
          }
        ]);

      if (error) {
        console.error('Error creating worker:', error);
        toast({
          title: "Registration Error",
          description: error.message.includes('duplicate') ? "Email already exists" : "Failed to create account. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Account Created!",
          description: "Your worker account has been created successfully. You can now login.",
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
            src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=3543&auto=format&fit=crop"
            alt="Worker Registration"
            className="w-full h-full object-cover"
            id="workerRegImage"
          />
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2" id="workerRegTitle">
                Join as a Service Provider
              </h2>
              <p className="text-muted-foreground">
                Start offering your services on ConnectPro
              </p>
            </div>

            <form className="space-y-6" id="workerRegistrationForm" onSubmit={handleSubmit}>
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="workerFirstName" className="block text-sm font-medium text-foreground mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="workerFirstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="workerLastName" className="block text-sm font-medium text-foreground mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="workerLastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="workerEmail" className="block text-sm font-medium text-foreground mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="workerEmail"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="workerPhone" className="block text-sm font-medium text-foreground mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="workerPhone"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="workerDob" className="block text-sm font-medium text-foreground mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      id="workerDob"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="workerGender" className="block text-sm font-medium text-foreground mb-1">
                    Gender
                  </label>
                  <select
                    id="workerGender"
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

                <div>
                  <label htmlFor="workerProfilePicture" className="block text-sm font-medium text-foreground mb-1">
                    Profile Picture (Optional)
                  </label>
                  <input
                    type="file"
                    id="workerProfilePicture"
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

              {/* Address & Designation Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Address & Designation
                </h3>

                <div>
                  <label htmlFor="workerCity" className="block text-sm font-medium text-foreground mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="workerCity"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="workerAddress" className="block text-sm font-medium text-foreground mb-1">
                    Full Address
                  </label>
                  <textarea
                    id="workerAddress"
                    name="fullAddress"
                    rows={3}
                    value={formData.fullAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="designation" className="block text-sm font-medium text-foreground mb-1">
                      Designation
                    </label>
                    <select
                      id="designation"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      required
                    >
                      <option value="">Select Your Service Category</option>
                      <option value="photographer">Photographer</option>
                      <option value="videographer">Videographer</option>
                      <option value="plumber">Plumber</option>
                      <option value="electrician">Electrician</option>
                      <option value="carpenter">Carpenter</option>
                      <option value="cleaner">Cleaner</option>
                      <option value="painter">Painter</option>
                      <option value="decorator">Decorator</option>
                      <option value="car-wash">Car Wash</option>
                      <option value="water-tank-cleaner">Water Tank Cleaner</option>
                      <option value="geyser-installer">Geyser Installer</option>
                      <option value="cctv-installer">CCTV Installer</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="experience" className="block text-sm font-medium text-foreground mb-1">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      id="experience"
                      name="experience"
                      min="0"
                      max="50"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="workingHours" className="block text-sm font-medium text-foreground mb-1">
                    Preferred Working Hours
                  </label>
                  <input
                    type="text"
                    id="workingHours"
                    name="workingHours"
                    value={formData.workingHours}
                    onChange={handleInputChange}
                    placeholder="e.g., 9 AM - 5 PM"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Skills & Security Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                  Skills & Security
                </h3>

                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-foreground mb-1">
                    Skills (comma-separated)
                  </label>
                  <textarea
                    id="skills"
                    name="skills"
                    rows={3}
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="e.g., Plumbing, Electrical Work, Pipe Installation"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                    required
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="workerCnic" className="block text-sm font-medium text-foreground mb-1">
                    CNIC Number
                  </label>
                  <input
                    type="text"
                    id="workerCnic"
                    name="cnicNumber"
                    value={formData.cnicNumber}
                    onChange={handleInputChange}
                    placeholder="13 digits (e.g., 1234567890123)"
                    maxLength={13}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                  {cnicError && (
                    <p className="text-red-500 text-sm mt-1" id="cnicError">
                      {cnicError}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="workerPassword" className="block text-sm font-medium text-foreground mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      id="workerPassword"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                id="workerRegisterBtn"
                disabled={loading}
                className="w-full bg-cta-primary text-cta-primary-foreground py-3 px-4 rounded-md hover:bg-cta-primary-hover transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Register'}
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

export default WorkerRegistration;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import WorkerSidebar from '@/components/WorkerSidebar';

interface WorkerProfile {
  worker_id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  city: string;
  full_address: string;
  gender: string;
  date_of_birth: string;
  cnic: string;
  designation: string;
  experience: number;
  skills: string;
  preferred_working_hours: string;
  password: string;
}

const WorkerProfile = () => {
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userSession = localStorage.getItem('user_session');
      if (!userSession) {
        navigate('/login');
        return;
      }

      const session = JSON.parse(userSession);
      const workerId = session.id;

      if (!workerId) return;

      const { data, error } = await supabase
        .from('workers')
        .select('*')
        .eq('worker_id', parseInt(workerId))
        .single();

      if (error) {
        console.error('Error fetching worker profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile.",
          variant: "destructive",
        });
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    // Validate password if trying to update it
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match.",
          variant: "destructive",
        });
        return;
      }
      if (newPassword.length < 6) {
        toast({
          title: "Error", 
          description: "Password must be at least 6 characters long.",
          variant: "destructive",
        });
        return;
      }
    }

    setSaving(true);
    try {
      const updateData: any = {
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone_number: profile.phone_number,
        city: profile.city,
        full_address: profile.full_address,
        gender: profile.gender,
        date_of_birth: profile.date_of_birth,
        designation: profile.designation,
        experience: profile.experience,
        skills: profile.skills,
        preferred_working_hours: profile.preferred_working_hours,
      };

      // Add password to update if provided
      if (newPassword) {
        updateData.password = newPassword;
      }

      const { error } = await supabase
        .from('workers')
        .update(updateData)
        .eq('worker_id', profile.worker_id);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
        // Clear password fields after successful update
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <WorkerSidebar>
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </WorkerSidebar>
    );
  }

  if (!profile) {
    return (
      <WorkerSidebar>
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground">Profile not found.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </WorkerSidebar>
    );
  }

  return (
    <WorkerSidebar>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Edit Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profile.first_name}
                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profile.last_name}
                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (Read Only)</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone_number}
                    onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profile.date_of_birth}
                    onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnic">CNIC (Read Only)</Label>
                  <Input
                    id="cnic"
                    value={profile.cnic}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={profile.designation}
                    onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (Years)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={profile.experience}
                    onChange={(e) => setProfile({ ...profile, experience: parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingHours">Preferred Working Hours</Label>
                  <Input
                    id="workingHours"
                    value={profile.preferred_working_hours}
                    onChange={(e) => setProfile({ ...profile, preferred_working_hours: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Textarea
                    id="skills"
                    value={profile.skills}
                    onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                    className="min-h-[60px]"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea
                    id="address"
                    value={profile.full_address}
                    onChange={(e) => setProfile({ ...profile, full_address: e.target.value })}
                    className="min-h-[60px]"
                  />
                </div>
                
                {/* Password Update Section */}
                <div className="md:col-span-2 border-t pt-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </WorkerSidebar>
  );
};

export default WorkerProfile;
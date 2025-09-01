import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  workerEmail: string;
  workerName: string;
  serviceType: string;
}

const BookingForm = ({ isOpen, onClose, workerEmail, workerName, serviceType }: BookingFormProps) => {
  const [formData, setFormData] = useState({
    preferredDate: '',
    preferredTime: '',
    city: '',
    fullAddress: '',
    phoneNumber: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userSession = localStorage.getItem('user_session');
      if (!userSession) {
        toast({
          title: "Error",
          description: "Please log in to book a service.",
          variant: "destructive",
        });
        return;
      }

      const session = JSON.parse(userSession);
      const userEmail = session.email;

      if (!userEmail) {
        toast({
          title: "Error",
          description: "Unable to identify user. Please log in again.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('service_requests')
        .insert({
          user_email: userEmail,
          worker_email: workerEmail,
          service_type: serviceType,
          description: formData.description,
          preferred_date: formData.preferredDate || null,
          preferred_time: formData.preferredTime || null,
          city: formData.city,
          full_address: formData.fullAddress,
          phone_number: formData.phoneNumber,
          request_status: 'Pending'
        });

      if (error) {
        console.error('Error creating booking:', error);
        toast({
          title: "Error",
          description: "Failed to create booking. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `Booking request sent to ${workerName}!`,
        });
        setFormData({
          preferredDate: '',
          preferredTime: '',
          city: '',
          fullAddress: '',
          phoneNumber: '',
          description: '',
        });
        onClose();
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Service with {workerName}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="serviceType">Service Type</Label>
            <Input
              id="serviceType"
              value={serviceType}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredDate">Preferred Date</Label>
            <Input
              id="preferredDate"
              type="date"
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferredTime">Preferred Time</Label>
            <Select
              value={formData.preferredTime}
              onValueChange={(value) => setFormData({ ...formData, preferredTime: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Morning (8AM - 12PM)">Morning (8AM - 12PM)</SelectItem>
                <SelectItem value="Afternoon (12PM - 4PM)">Afternoon (12PM - 4PM)</SelectItem>
                <SelectItem value="Evening (4PM - 8PM)">Evening (4PM - 8PM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullAddress">Full Address *</Label>
            <Textarea
              id="fullAddress"
              value={formData.fullAddress}
              onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
              required
              className="min-h-[60px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description/Issues</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the work needed or any specific requirements..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Booking...' : 'Book Service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
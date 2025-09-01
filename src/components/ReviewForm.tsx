import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormProps {
  serviceRequestId: number;
  workerEmail: string;
  onReviewSubmitted: () => void;
}

const ReviewForm = ({ serviceRequestId, workerEmail, onReviewSubmitted }: ReviewFormProps) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmitReview = async () => {
    if (!rating || !name || !email || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and provide a rating.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Insert the feedback
      const { error: feedbackError } = await supabase
        .from('feedbacks')
        .insert({
          service_request_id: serviceRequestId,
          worker_email: workerEmail,
          name,
          email,
          rating,
          message
        });

      if (feedbackError) {
        throw feedbackError;
      }

      // Update service request status to 'Completed' when review is submitted
      const { error: updateError } = await supabase
        .from('service_requests')
        .update({ 
          request_status: 'Completed',
          status: 'Completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', serviceRequestId);

      if (updateError) {
        console.error('Error updating service request status:', updateError);
        // Don't throw here since feedback was saved successfully
      }

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback! Service marked as completed.",
      });

      // Reset form
      setRating(0);
      setName('');
      setEmail('');
      setMessage('');
      setOpen(false);
      onReviewSubmitted();

    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border-blue-400/30">
          Leave Review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="rating">Rating</Label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer transition-colors ${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                />
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div>
            <Label htmlFor="email">Your Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <Label htmlFor="message">Review Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSubmitReview}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
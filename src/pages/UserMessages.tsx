import UserSidebar from '@/components/UserSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UserMessages = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <UserSidebar />
      
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
            <p className="text-muted-foreground">Communicate with service providers</p>
          </div>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Inbox</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No messages yet</p>
                <p className="text-muted-foreground">Messages from service providers will appear here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default UserMessages;
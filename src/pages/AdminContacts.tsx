import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  submitted_at: string;
}

const AdminContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching contacts:', error);
      } else {
        setContacts(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminSidebar>
      <div className="p-3 sm:p-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-lg sm:text-xl font-semibold text-foreground">Contact Messages</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1 hidden sm:block">
            View all contact form submissions
          </p>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cta-primary"></div>
            <span className="ml-2 text-muted-foreground text-sm">Loading...</span>
          </div>
        ) : (
          <div className="bg-card rounded-md border">
            <div className="p-3 border-b border-border">
              <h2 className="text-base font-medium text-foreground">
                All Messages ({contacts.length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[90px] text-xs">Name</TableHead>
                    <TableHead className="min-w-[120px] text-xs">Email</TableHead>
                    <TableHead className="min-w-[160px] text-xs">Message</TableHead>
                    <TableHead className="min-w-[90px] text-xs hidden sm:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground text-sm">
                        No messages found
                      </TableCell>
                    </TableRow>
                  ) : (
                    contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell className="font-medium text-xs">{contact.name}</TableCell>
                        <TableCell className="text-xs break-all">{contact.email}</TableCell>
                        <TableCell className="max-w-xs text-xs">
                          <div className="truncate" title={contact.message}>
                            {contact.message}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs hidden sm:table-cell">
                          {new Date(contact.submitted_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </AdminSidebar>
  );
};

export default AdminContacts;

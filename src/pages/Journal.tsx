
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { JournalEntry, createJournalEntry, getJournalEntries } from "@/services/api";
import { toast } from "@/components/ui/sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { BookOpen, Pencil, Search } from "lucide-react";

const Journal = () => {
  const { username, password } = useAuth();
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const queryClient = useQueryClient();
  
  const form = useForm<JournalEntry>({
    defaultValues: {
      title: "",
      content: ""
    }
  });

  // Query to fetch journal entries
  const { data: journalEntries = [], isLoading, error } = useQuery({
    queryKey: ["journalEntries"],
    queryFn: () => getJournalEntries(username, password)
  });

  // Mutation for creating new journal entries
  const createEntryMutation = useMutation({
    mutationFn: (newEntry: JournalEntry) => createJournalEntry(username, password, newEntry),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journalEntries"] });
      form.reset();
      toast.success("Journal entry created successfully");
    },
    onError: () => {
      toast.error("Failed to create journal entry");
    }
  });

  const onSubmit = (data: JournalEntry) => {
    createEntryMutation.mutate(data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Journal Entry Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Create Journal Entry</CardTitle>
            <CardDescription>Write down your thoughts for today</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Today's thoughts..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write your entry here..." 
                          className="min-h-[200px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-journal-primary hover:bg-journal-primary/90"
                  disabled={createEntryMutation.isPending}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  {createEntryMutation.isPending ? "Saving..." : "Save Entry"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Journal Entries List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Your Journal Entries</CardTitle>
                <CardDescription>Review your past entries</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search entries..." 
                  className="pl-8" 
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading your journal entries...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                Could not load journal entries. Please try again.
              </div>
            ) : journalEntries.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No journal entries yet</h3>
                <p className="text-muted-foreground mt-2">
                  Create your first entry to get started on your journaling journey
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {journalEntries.map((entry) => (
                  <Card key={entry.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedEntry(entry)}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{entry.title}</CardTitle>
                      {entry.createdAt && (
                        <CardDescription>
                          {format(new Date(entry.createdAt), "MMMM dd, yyyy 'at' h:mm a")}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pb-4">
                      <p className="text-muted-foreground line-clamp-2">
                        {entry.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Total entries: {journalEntries.length}
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Selected Entry Details Modal - can be implemented later */}
    </div>
  );
};

export default Journal;

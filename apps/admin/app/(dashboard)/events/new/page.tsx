import { Button } from "@the-early-kickoff/ui/components/button";
import { Input } from "@the-early-kickoff/ui/components/input";
import { Label } from "@the-early-kickoff/ui/components/label";
import { Textarea } from "@the-early-kickoff/ui/components/textarea";
import Link from "next/link";

export default function NewEventPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Event</h1>
      <form action={async (formData) => {
          "use server";
          // You will need to implement the createEvent action
          // to handle the form submission and database insertion
          // For now, let's just log the form data
          console.log(formData);
        }} className="space-y-4">
        <div>
          <Label htmlFor="name">Event Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" required />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" required />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" step="0.01" required />
        </div>
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input id="imageUrl" name="imageUrl" type="url" />
        </div>
        <div className="flex space-x-4">
          <Button type="submit">Create Event</Button>
          <Link href="/admin/events">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
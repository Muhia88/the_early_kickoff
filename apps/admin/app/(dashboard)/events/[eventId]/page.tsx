import { Button } from "@the-early-kickoff/ui/components/button";
import { Input } from "@the-early-kickoff/ui/components/input";
import { Label } from "@the-early-kickoff/ui/components/label";
import { Textarea } from "@the-early-kickoff/ui/components/textarea";
import Link from "next/link";

import { getEventById, updateEvent } from "@the-early-kickoff/lib/actions/event";
import { Button } from "@the-early-kickoff/ui/components/button";
import { Input } from "@the-early-kickoff/ui/components/input";
import { Label } from "@the-early-kickoff/ui/components/label";
import { Textarea } from "@the-early-kickoff/ui/components/textarea";
import Link from "next/link";

interface Props {
  params: {
    eventId: string;
  };
}

export default async function EventIdPage({ params }: Props) {
  const event = await getEventById(Number(params.eventId));

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
      <form action={async (formData) => {
          "use server";
          await updateEvent(Number(params.eventId), formData);
        }} className="space-y-4">
        <div>
          <Label htmlFor="name">Event Name</Label>
          <Input id="name" name="name" defaultValue={event.name} required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" defaultValue={event.description || ""} />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" defaultValue={event.date.toISOString().split('T')[0]} required />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={event.location} required />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" step="0.01" defaultValue={String(event.price)} required />
        </div>
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input id="imageUrl" name="imageUrl" type="url" defaultValue={event.imageUrl || ""} />
        </div>
        <div className="flex space-x-4">
          <Button type="submit">Update Event</Button>
          <Link href="/admin/events">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
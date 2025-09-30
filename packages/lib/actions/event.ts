"use server";

import { db } from "@the-early-kickoff/db";
import { events } from "@the-early-kickoff/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { eq } from "drizzle-orm";

const eventSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required").transform((str) => new Date(str)),
  location: z.string().min(1, "Location is required"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be a positive number").transform(Number),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export async function createEvent(formData: FormData) {
  const parsed = eventSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    date: formData.get("date"),
    location: formData.get("location"),
    price: formData.get("price"),
    imageUrl: formData.get("imageUrl"),
  });

  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error("Invalid event data");
  }

  await db.insert(events).values({
    name: parsed.data.name,
    description: parsed.data.description,
    date: parsed.data.date,
    location: parsed.data.location,
    price: parsed.data.price,
    imageUrl: parsed.data.imageUrl,
  });
  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function updateEvent(id: number, formData: FormData) {
  const parsed = eventSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    date: formData.get("date"),
    location: formData.get("location"),
    price: formData.get("price"),
    imageUrl: formData.get("imageUrl"),
  });

  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error("Invalid event data");
  }

  await db.update(events).set({
    name: parsed.data.name,
    description: parsed.data.description,
    date: parsed.data.date,
    location: parsed.data.location,
    price: parsed.data.price,
    imageUrl: parsed.data.imageUrl,
  }).where(eq(events.id, id));
  revalidatePath("/admin/events/[eventId]");
  redirect("/admin/events/[eventId]");
}

export async function deleteEvent(id: number) {
  await db.delete(events).where(eq(events.id, id));
  revalidatePath("/admin/events");
}

export async function getEvents() {
  return await db.query.events.findMany();
}

export async function getEventById(id: number) {
  return await db.query.events.findFirst({
    where: eq(events.id, id),
  });
}
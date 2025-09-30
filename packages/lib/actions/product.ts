"use server";

import { db } from "@the-early-kickoff/db";
import { products } from "@the-early-kickoff/db/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { eq } from "drizzle-orm"; // Import eq

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Price must be a positive number"),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Stock must be a non-negative number").transform(Number),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export async function createProduct(formData: FormData) {
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    imageUrl: formData.get("imageUrl"),
  });

  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error("Invalid product data");
  }

  await db.insert(products).values({
    name: parsed.data.name,
    description: parsed.data.description,
    price: parsed.data.price, // Keep as string for decimal type
    stock: parsed.data.stock,
    imageUrl: parsed.data.imageUrl,
  });
  revalidatePath("/products");
  redirect("/products");
}

export async function updateProduct(id: number, formData: FormData) {
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    imageUrl: formData.get("imageUrl"),
  });

  if (!parsed.success) {
    console.error(parsed.error);
    throw new Error("Invalid product data");
  }

  await db.update(products).set({
    name: parsed.data.name,
    description: parsed.data.description,
    price: parsed.data.price, // Keep as string for decimal type
    stock: parsed.data.stock,
    imageUrl: parsed.data.imageUrl,
  }).where(eq(products.id, id));
  revalidatePath("/products");
  redirect("/products");
}

export async function deleteProduct(id: number) {
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/products");
}

export async function getProducts() {
  return await db.query.products.findMany();
}

export async function getProductById(id: number) {
  return await db.query.products.findFirst({
    where: eq(products.id, id),
  });
}
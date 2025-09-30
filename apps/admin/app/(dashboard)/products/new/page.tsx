import { createProduct } from "@the-early-kickoff/lib/actions/product";
import { Button } from "@the-early-kickoff/ui/components/button";
import { Input } from "@the-early-kickoff/ui/components/input";
import { Label } from "@the-early-kickoff/ui/components/label";
import { Textarea } from "@the-early-kickoff/ui/components/textarea";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Product</h1>
      <form action={createProduct} className="space-y-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" name="price" type="number" step="0.01" required />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" name="stock" type="number" required />
        </div>
        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input id="imageUrl" name="imageUrl" type="url" />
        </div>
        <div className="flex space-x-4">
          <Button type="submit">Create Product</Button>
          <Link href="/products">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
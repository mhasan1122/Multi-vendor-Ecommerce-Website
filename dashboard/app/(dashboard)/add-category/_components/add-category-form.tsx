"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";
import { ImageIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the form schema with zod
const formSchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  categoryImage: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AddCategoryForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const token = localStorage.getItem("auth_token");
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: "",
      description: "",
    },
  });

  // Create mutation for API call
  const createCategory = useMutation({
    mutationFn: async (data: FormValues) => {
      const formData = new FormData();
      formData.append("categoryName", data.categoryName);

      if (data.description) {
        formData.append("description", data.description);
      }

      if (data.categoryImage) {
        formData.append("categoryImage", data.categoryImage);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create category");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Category created",
        description: `${form.getValues().categoryName} has been created successfully.`,
      });
      router.push("/product-categories");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      });
    },
  });

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Set the file in the form
      form.setValue("categoryImage", file);

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    setImagePreview(null);
    form.setValue("categoryImage", undefined);
  };

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    createCategory.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Thumbnail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="relative flex h-48 w-full items-center justify-center rounded-md border-2 border-dashed border-gray-300">
                  {imagePreview ? (
                    <>
                      <Image
                        src={imagePreview || "/placeholder.svg"}
                        alt="Category Thumbnail"
                        fill
                        className="object-contain p-2"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 rounded-full bg-white"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2 text-sm text-gray-500">
                        Drag and drop image here, or click add image
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="mt-2"
                        onClick={() =>
                          document.getElementById("image-upload")?.click()
                        }
                      >
                        Add image
                      </Button>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="categoryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Type category name here..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type category description here..."
                        rows={8}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/product-categories")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={createCategory.isPending}>
            {createCategory.isPending ? "Saving..." : "Save Category"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

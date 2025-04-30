"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";
import { ImageIcon, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define the form schema with zod
const formSchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
  description: z.string().optional(),
  categoryImage: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string | null;
}

export function EditCategoryModal({
  isOpen,
  onClose,
  categoryId,
}: EditCategoryModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const token = localStorage.getItem("auth_token");

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryName: "",
      description: "",
    },
  });

  // Fetch category data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: async () => {
      if (!categoryId) return null;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/${categoryId}`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch category");
      }
      return response.json();
    },
    enabled: !!categoryId && isOpen,
  });

  // Update form values when data is loaded
  useEffect(() => {
    if (data?.data) {
      const category = data.data;
      form.reset({
        categoryName: category.categoryName,
        description: category.description || "",
      });
      setImagePreview(category.categoryImage);
    }
  }, [data, form]);

  // Create mutation for API call
  const updateCategory = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!categoryId) throw new Error("Category ID is required");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/${categoryId}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update category");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Category updated",
        description: `${form.getValues().categoryName} has been updated successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["category", categoryId] });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
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
      setIsImageChanged(true);

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
    setIsImageChanged(true);
  };

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    const formData = new FormData();
    formData.append("categoryName", values.categoryName);

    if (values.description) {
      formData.append("description", values.description);
    }

    if (isImageChanged && values.categoryImage instanceof File) {
      formData.append("categoryImage", values.categoryImage);
    }

    updateCategory.mutate(formData);
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
          </DialogHeader>
          <div className="text-red-500">Failed to load category data</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
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
                          document.getElementById("edit-image-upload")?.click()
                        }
                      >
                        Add image
                      </Button>
                      <input
                        id="edit-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </div>
                  )}
                </div>
              </div>

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
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateCategory.isPending}>
                {updateCategory.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

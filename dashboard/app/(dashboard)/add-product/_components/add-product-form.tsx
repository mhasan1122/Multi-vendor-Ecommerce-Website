"use client";

import { useState, useEffect, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Trash2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { FileUploader } from "./file-uploader";
import { ColorPicker } from "./color-picker";
import Image from "next/image";

// Define Category and Subcategory types
type Category = {
  _id: string;
  categoryName: string;
};

type Subcategory = {
  _id: string;
  subCategoryName: string;
};

const productSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce
    .number()
    .positive({ message: "Price must be a positive number" }),
  category: z.string().min(1, { message: "Category is required" }),
  subcategory: z.string().optional(),
  type: z.string().min(1, { message: "Type is required" }),
  sustainability: z.string().optional(),
  sizes: z.array(z.string()),
  quantity: z.coerce
    .number()
    .int()
    .positive({ message: "Quantity must be a positive integer" }),
  isCustomizable: z.coerce.boolean().default(false),
  discountPercentage: z.coerce.number().min(0).max(100).default(0),
  status: z.string().default("draft"),
});

type ProductFormValues = z.infer<typeof productSchema>;

type Color = {
  name: string;
  hex: string;
  colorImages: File[];
  _id?: string;
};

type Media = {
  images: File[];
  videos: File[];
};

export default function ProductForm() {
  const router = useRouter();
  const [colors, setColors] = useState<Color[]>([]);
  const [media, setMedia] = useState<Media>({ images: [], videos: [] });
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [newSize, setNewSize] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      subcategory: "",
      type: "physical",
      sustainability: "",
      quantity: 0,
      isCustomizable: false,
      sizes: [],
      discountPercentage: 0,
      status: "draft",
    },
  });

  // Add this function as a useCallback to avoid dependency issues
  const fetchSubcategoriesByCategory = useCallback(
    async (categoryId: string) => {
      try {
        // Find the category name from the categories array
        const selectedCategory = categories.find(
          (cat) => cat._id === categoryId,
        );
        if (!selectedCategory) return;

        // Fetch subcategories filtered by category name
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/subcategories?categoryName=${selectedCategory.categoryName}`,
        );
        const data = await response.json();

        if (data.status) {
          setSubcategories(data.subCategories || []);
        } else {
          setSubcategories([]);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        toast.error("Failed to load subcategories");
        setSubcategories([]);
      }
    },
    [categories],
  );

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch categories
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
        );
        const categoriesData = await response.json();
        if (categoriesData.status) {
          setCategories(categoriesData.data || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // Watch for category changes
  useEffect(() => {
    const selectedCategory = form.watch("category");
    if (selectedCategory) {
      fetchSubcategoriesByCategory(selectedCategory);
      // Clear the subcategory selection when category changes
      form.setValue("subcategory", "");
    } else {
      setSubcategories([]);
    }
  }, [fetchSubcategoriesByCategory, form]);

  const watchedCategory = form.watch("category");
  useEffect(() => {
    if (watchedCategory) {
      fetchSubcategoriesByCategory(watchedCategory);
      form.setValue("subcategory", "");
    } else {
      setSubcategories([]);
    }
  }, [watchedCategory, fetchSubcategoriesByCategory, form]);

  const isCustomizable = form.watch("isCustomizable");

  const addColor = () => {
    setColors([...colors, { name: "", hex: "#000000", colorImages: [] }]);
  };

  const removeColor = (index: number) => {
    const newColors = [...colors];
    newColors.splice(index, 1);
    setColors(newColors);
  };

  const updateColor = (
    index: number,
    field: keyof Color,
    value: string | File[],
  ) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setColors(newColors);
  };

  const addSize = () => {
    if (newSize && !availableSizes.includes(newSize)) {
      const updatedSizes = [...availableSizes, newSize];
      setAvailableSizes(updatedSizes);
      form.setValue("sizes", updatedSizes);
      setNewSize("");
    }
  };

  const removeSize = (size: string) => {
    const updatedSizes = availableSizes.filter((s) => s !== size);
    setAvailableSizes(updatedSizes);
    form.setValue("sizes", updatedSizes);
  };

  const handleImageUpload = (files: File[]) => {
    setMedia({ ...media, images: [...media.images, ...files].slice(0, 3) });
  };

  const handleVideoUpload = (files: File[]) => {
    setMedia({ ...media, videos: [...media.videos, ...files].slice(0, 1) });
  };

  const handleColorImageUpload = (colorIndex: number, files: File[]) => {
    const newColors = [...colors];
    newColors[colorIndex].colorImages = [
      ...newColors[colorIndex].colorImages,
      ...files,
    ].slice(0, 3);
    setColors(newColors);
  };

  const removeColorImage = (colorIndex: number, imageIndex: number) => {
    const newColors = [...colors];
    newColors[colorIndex].colorImages.splice(imageIndex, 1);
    setColors(newColors);
  };

  const removeImage = (index: number) => {
    const newImages = [...media.images];
    newImages.splice(index, 1);
    setMedia({ ...media, images: newImages });
  };

  const removeVideo = (index: number) => {
    const newVideos = [...media.videos];
    newVideos.splice(index, 1);
    setMedia({ ...media, videos: newVideos });
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Append all basic fields
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", String(data.price));
      formData.append("category", data.category);
      formData.append("subcategory", data.subcategory || "");
      formData.append("type", data.type);
      formData.append("quantity", String(data.quantity));
      formData.append("isCustomizable", String(data.isCustomizable));
      formData.append("sizes", data.sizes.join(","));
      formData.append("discountPercentage", String(data.discountPercentage));
      formData.append("status", data.status);

      if (data.isCustomizable) {
        // Validate colors
        if (colors.length === 0) {
          toast.error(
            "Please add at least one color for customizable products",
          );
          setIsSubmitting(false);
          return;
        }

        // Append colors as JSON string
        formData.append(
          "colors",
          JSON.stringify(colors.map((c) => ({ name: c.name, hex: c.hex }))),
        );

        // Append color images with indexed field names
        colors.forEach((color, colorIndex) => {
          color.colorImages.forEach((image) => {
            formData.append(`colorImages[${colorIndex}]`, image);
          });
        });
      } else {
        // Validate media for non-customizable products
        if (media.images.length === 0) {
          toast.error(
            "Please add at least one image for non-customizable products",
          );
          setIsSubmitting(false);
          return;
        }

        // Append product images
        media.images.forEach((image) => {
          formData.append("images", image);
        });

        // Append product videos (optional)
        media.videos.forEach((video) => {
          formData.append("videos", video);
        });
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/create`,
        {
          method: "POST",
          body: formData,
          // Don't set Content-Type header - let browser set it with boundary
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create product");
      }

      if (result.status) {
        toast.success("Product created successfully");
        // Reset form
        form.reset();
        setColors([]);
        setMedia({ images: [], videos: [] });
        setAvailableSizes([]);
        router.push("/product-list"); // Fixed router usage
      } else {
        throw new Error(result.message || "Failed to create product");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create product",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Product</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Dashboard</span>
            <span>›</span>
            <span>Product</span>
            <span>›</span>
            <span>Add Product</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            Save Product
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-6">
          {/* General Information */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-xl font-semibold">
                General Information
              </h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Type product name here..."
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
                          placeholder="Type product description here..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-xl font-semibold">Category</h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Category</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.categoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subcategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Subcategory</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={
                          subcategories.length === 0 || !form.watch("category")
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                !form.watch("category")
                                  ? "Select a category first"
                                  : subcategories.length === 0
                                    ? "No subcategories available"
                                    : "Select a subcategory"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subcategories.map((subcategory) => (
                            <SelectItem
                              key={subcategory._id}
                              value={subcategory._id}
                            >
                              {subcategory.subCategoryName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="physical">Physical</SelectItem>
                          <SelectItem value="digital">Digital</SelectItem>
                          <SelectItem value="service">Service</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-xl font-semibold">Status</h2>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Customization Option */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-xl font-semibold">Customization</h2>
              <FormField
                control={form.control}
                name="isCustomizable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Customizable Product
                      </FormLabel>
                      <FormDescription>
                        Enable if this product has color variants with different
                        images
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-xl font-semibold">Media</h2>

              {isCustomizable ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Colors & Images</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addColor}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Color
                    </Button>
                  </div>

                  {colors.length === 0 && (
                    <div className="rounded-lg border border-dashed p-6 text-center">
                      <p className="text-muted-foreground">
                        No colors added yet. Click &quot;Add Color&quot; to
                        start.
                      </p>
                    </div>
                  )}

                  {colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="space-y-4 rounded-lg border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Color {colorIndex + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeColor(colorIndex)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor={`color-name-${colorIndex}`}>
                            Color Name
                          </Label>
                          <Input
                            id={`color-name-${colorIndex}`}
                            value={color.name}
                            onChange={(e) =>
                              updateColor(colorIndex, "name", e.target.value)
                            }
                            placeholder="e.g., Red, Blue, Green"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`color-hex-${colorIndex}`}>
                            Color Hex Code
                          </Label>
                          <ColorPicker
                            color={color.hex}
                            onChange={(value) =>
                              updateColor(colorIndex, "hex", value)
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Color Images (up to 3)</Label>
                        <div className="mt-2">
                          <FileUploader
                            accept="image/*"
                            maxFiles={3 - color.colorImages.length}
                            onFilesSelected={(files) =>
                              handleColorImageUpload(colorIndex, files)
                            }
                            disabled={color.colorImages.length >= 3}
                          />
                        </div>

                        {color.colorImages.length > 0 && (
                          <div className="mt-2 grid grid-cols-3 gap-2">
                            {color.colorImages.map((image, imageIndex) => (
                              <div key={imageIndex} className="group relative">
                                <div className="aspect-square overflow-hidden rounded-md border bg-muted">
                                  <Image
                                    width={100}
                                    height={100}
                                    src={URL.createObjectURL(image)}
                                    alt={`Color ${color.name} image ${imageIndex + 1}`}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                  onClick={() =>
                                    removeColorImage(colorIndex, imageIndex)
                                  }
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <Label>Product Images (up to 3)</Label>
                    <div className="mt-2">
                      <FileUploader
                        accept="image/*"
                        maxFiles={3 - media.images.length}
                        onFilesSelected={handleImageUpload}
                        disabled={media.images.length >= 3}
                      />
                    </div>

                    {media.images.length > 0 && (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {media.images.map((image, index) => (
                          <div key={index} className="group relative">
                            <div className="aspect-square overflow-hidden rounded-md border bg-muted">
                              <Image
                                width={100}
                                height={100}
                                src={URL.createObjectURL(image)}
                                alt={`Product image ${index + 1}`}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Product Video (optional)</Label>
                    <div className="mt-2">
                      <FileUploader
                        accept="video/*"
                        maxFiles={1 - media.videos.length}
                        onFilesSelected={handleVideoUpload}
                        disabled={media.videos.length >= 1}
                      />
                    </div>

                    {media.videos.length > 0 && (
                      <div className="mt-2">
                        {media.videos.map((video, index) => (
                          <div key={index} className="group relative">
                            <div className="overflow-hidden rounded-md border bg-muted p-2">
                              <div className="flex items-center gap-2">
                                <video
                                  controls
                                  className="max-h-[200px] w-full"
                                >
                                  <source src={URL.createObjectURL(video)} />
                                  Your browser does not support the video tag.
                                </video>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                              onClick={() => removeVideo(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sizes */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-xl font-semibold">Sizes</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add a size (e.g., Small, Medium, Large)"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={addSize}>
                    Add
                  </Button>
                </div>

                {availableSizes.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <div
                        key={size}
                        className="flex items-center gap-1 rounded-full bg-muted px-3 py-1"
                      >
                        <span>{size}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4"
                          onClick={() => removeSize(size)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No sizes added yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-xl font-semibold">Pricing</h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Type base price here..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Percentage (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Type discount percentage..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-xl font-semibold">Inventory</h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Type product quantity here..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={form.handleSubmit(onSubmit)}
            >
              Save Product
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

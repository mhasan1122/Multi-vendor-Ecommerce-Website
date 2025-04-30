"use client";

import type React from "react";

import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Types
interface Category {
  _id: string;
  categoryName: string;
  description: string;
  categoryImage: string;
  stock: number;
  sales: number;
  createdAt: string;
  updatedAt: string;
}

interface SubCategory {
  _id: string;
  subCategoryName: string;
  category: {
    _id: string;
    categoryName: string;
    description: string;
    stock: number;
    sales: number;
    createdAt: string;
    updatedAt: string;
    categoryImage: string;
  };
  description: string;
  stock: number;
  sales: number;
  createdAt: string;
  updatedAt: string;
}

interface SubCategoryResponse {
  status: boolean;
  message: string;
  currentPage: number;
  totalPages: number;
  totalSubCategories: number;
  count: number;
  subCategories: SubCategory[];
}

interface CategoryResponse {
  status: boolean;
  message: string;
  data: Category[];
}

// Form schema
const formSchema = z.object({
  subCategoryName: z.string().min(1, "Subcategory name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function SubCategories() {
  // const router = useRouter();
  // const searchParams = useSearchParams();

  // States
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("auth_token");

  // Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subCategoryName: "",
      description: "",
      category: "",
    },
  });

  // Fetch subcategories
  const fetchSubCategories = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/subcategories?page=${page}&limit=10&sortBy=stock&order=desc&subCategoryName=${searchTerm}`,
      );
      const data: SubCategoryResponse = await response.json();

      if (data.status) {
        setSubCategories(data.subCategories);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } else {
        toast.error("Failed to fetch subcategories");
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("An error occurred while fetching subcategories");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
      );
      const data: CategoryResponse = await response.json();

      if (data.status) {
        setCategories(data.data);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("An error occurred while fetching categories");
    }
  };

  // Create subcategory
  const createSubCategory = async (values: FormValues) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/subcategories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        },
      );

      const data = await response.json();

      if (data.status) {
        toast.success("Subcategory created successfully");
        fetchSubCategories(currentPage);
        setIsFormOpen(false);
        form.reset();
      } else {
        toast.error(data.message || "Failed to create subcategory");
      }
    } catch (error) {
      console.error("Error creating subcategory:", error);
      toast.error("An error occurred while creating subcategory");
    }
  };

  // Update subcategory
  const updateSubCategory = async (values: FormValues) => {
    if (!selectedSubCategory) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/subcategories/${selectedSubCategory._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        },
      );

      const data = await response.json();

      if (data.status) {
        toast.success("Subcategory updated successfully");
        fetchSubCategories(currentPage);
        setIsFormOpen(false);
        setSelectedSubCategory(null);
        form.reset();
      } else {
        toast.error(data.message || "Failed to update subcategory");
      }
    } catch (error) {
      console.error("Error updating subcategory:", error);
      toast.error("An error occurred while updating subcategory");
    }
  };

  // Delete subcategory
  const deleteSubCategory = async () => {
    if (!selectedSubCategory) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/subcategories/${selectedSubCategory._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (data.status) {
        toast.success("Subcategory deleted successfully");
        fetchSubCategories(currentPage);
        setIsDeleteDialogOpen(false);
        setSelectedSubCategory(null);
      } else {
        toast.error(data.message || "Failed to delete subcategory");
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast.error("An error occurred while deleting subcategory");
    }
  };

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    if (selectedSubCategory) {
      updateSubCategory(values);
    } else {
      createSubCategory(values);
    }
  };

  // Handle edit button click
  const handleEdit = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    form.setValue("subCategoryName", subCategory.subCategoryName);
    form.setValue("description", subCategory.description || "");
    form.setValue("category", subCategory.category?._id);
    setIsFormOpen(true);
  };

  // Handle delete button click
  const handleDelete = (subCategory: SubCategory) => {
    setSelectedSubCategory(subCategory);
    setIsDeleteDialogOpen(true);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSubCategories(1);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setIsFormOpen(false);
    setSelectedSubCategory(null);
    form.reset();
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subcategories</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setSelectedSubCategory(null);
                form.reset();
              }}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Subcategory
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {selectedSubCategory ? "Edit Subcategory" : "Add Subcategory"}
              </DialogTitle>
              <DialogDescription>
                {selectedSubCategory
                  ? "Update the subcategory details below."
                  : "Fill in the details to create a new subcategory."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="subCategoryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subcategory Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter subcategory name"
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
                          placeholder="Enter description (optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
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
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDialogClose}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedSubCategory ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <form onSubmit={handleSearch} className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subcategory..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        {/* <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
          <span className="sr-only">Filter</span>
        </Button> */}
      </div>

      <div className="rounded-lg border">
        <div className="grid grid-cols-6 gap-4 border-b p-4 font-medium">
          <div>Subcategory</div>
          <div>Category</div>
          <div className="text-center">Sales</div>
          <div className="text-center">Stock</div>
          <div className="text-center">Added</div>
          <div className="text-center">Action</div>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">Loading subcategories...</div>
        ) : subCategories.length === 0 ? (
          <div className="p-8 text-center">No subcategories found</div>
        ) : (
          subCategories.map((subCategory) => (
            <div
              key={subCategory._id}
              className="grid grid-cols-6 items-center gap-4 border-b p-4 last:border-b-0"
            >
              <div className="flex flex-col">
                <div className="font-medium">{subCategory.subCategoryName}</div>
                <div className="text-sm text-muted-foreground">
                  {subCategory.description}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {subCategory?.category?.categoryImage && (
                  <div className="h-12 w-12 overflow-hidden rounded-md">
                    <Image
                      src={
                        subCategory.category.categoryImage || "/placeholder.svg"
                      }
                      alt={subCategory.category.categoryName}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div>{subCategory?.category?.categoryName}</div>
              </div>
              <div className="text-center">{subCategory.sales}</div>
              <div className="text-center">{subCategory.stock}</div>
              <div className="text-center">
                {formatDate(subCategory.createdAt)}
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(subCategory)}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <AlertDialog
                  open={
                    isDeleteDialogOpen &&
                    selectedSubCategory?._id === subCategory._id
                  }
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(subCategory)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Subcategory</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete the subcategory &quot;
                        {selectedSubCategory?.subCategoryName}&quot;? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteSubCategory}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) {
                    fetchSubCategories(currentPage - 1);
                  }
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    fetchSubCategories(page);
                  }}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) {
                    fetchSubCategories(currentPage + 1);
                  }
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}

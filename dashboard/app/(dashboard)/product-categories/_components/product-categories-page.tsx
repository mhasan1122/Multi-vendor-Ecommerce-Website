"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { useRouter } from "next/navigation";
import { Edit, Plus, Search, Trash, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Modal } from "@/components/modal";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EditCategoryModal } from "./edit-category-modal";

// Type definition for category from API
interface Category {
  _id: string;
  categoryName: string;
  description: string;
  categoryImage: string;
  stock: number;
  sales: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function ProductCategoriesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const token = localStorage.getItem("auth_token");

  // Fetch categories using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories`,
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });

  // Delete category mutation
  const deleteCategory = useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete category");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Category deleted",
        description: "Category has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive",
      });
    },
  });

  // Function to handle edit category
  const handleEditCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setEditModalOpen(true);
  };

  // Function to handle delete category
  const handleDeleteCategory = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setDeleteConfirmOpen(true);
  };

  // Function to confirm delete
  const confirmDelete = async () => {
    if (selectedCategoryId) {
      deleteCategory.mutate(selectedCategoryId);
      setDeleteConfirmOpen(false);
    }
  };

  // Format date from ISO string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter categories based on search query
  const filteredCategories =
    data?.data.filter(
      (category: Category) =>
        category.categoryName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        category.description.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  // Columns for the categories table
  const columns = [
    {
      accessorKey: "category",
      header: "Category",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3 py-3">
          <Image
            src={row.original.categoryImage || "/placeholder.svg"}
            alt={row.original.categoryName}
            width={75}
            height={75}
            className="rounded-md object-cover"
          />
          <div className="flex flex-col">
            <span className="font-medium">{row.original.categoryName}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.description}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "sales",
      header: "Sales",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => (
        <span>{row.original.sales.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => (
        <span>{row.original.stock.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: "added",
      header: "Added",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => <span>{formatDate(row.original.createdAt)}</span>,
    },
    {
      id: "actions",
      header: "Action",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEditCategory(row.original._id)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteCategory(row.original._id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Categories</h1>
          <Button onClick={() => router.push("/add-category")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search category..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button> */}
        </div>

        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <span>Loading categories...</span>
              </div>
            ) : isError ? (
              <div className="flex items-center justify-center p-8 text-red-500">
                <span>
                  Error loading categories: {(error as Error).message}
                </span>
              </div>
            ) : (
              <DataTable columns={columns} data={filteredCategories} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        description="Are you sure you want to delete this category? This action cannot be undone."
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteCategory.isPending}
      />

      {/* Edit Category Modal */}
      <EditCategoryModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        categoryId={selectedCategoryId}
      />
    </>
  );
}

/* eslint-disable */
"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Eye, Search, Trash } from "lucide-react";
import { Modal } from "@/components/modal";
import { useToast } from "@/hooks/use-toast";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/use-debounce";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define types directly in the component
interface OrderProduct {
  product: null | string;
  quantity: number;
  price: number;
  _id: string;
}

interface Order {
  _id: string;
  user: null | string;
  products: OrderProduct[];
  totalAmount: number;
  status: "pending" | "paid" | "cancelled" | "delivered";
  orderSlug: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  delivery?: string;
}

interface OrdersResponse {
  status: boolean;
  message: string;
  data: {
    orders: Order[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

interface OrdersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Search and pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Helper function to build query string
  const buildQueryString = (params: OrdersQueryParams): string => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : "";
  };

  // Fetch orders directly in the component
  const fetchOrders = async (
    params: OrdersQueryParams = {},
  ): Promise<OrdersResponse> => {
    const queryString = buildQueryString(params);
    console.log(queryString)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/getallorders${queryString}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    return response.json();
  };

  // Delete order directly in the component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const deleteOrder = async (orderId: string): Promise<any> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/delete/${orderId}`,
      {
        method: "DELETE",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to delete order");
    }

    return response.json();
  };

  // Fetch orders with TanStack Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", page, limit, debouncedSearchTerm],
    queryFn: () =>
      fetchOrders({
        page,
        limit,
        search: debouncedSearchTerm || undefined,
      }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      toast({
        title: "Order deleted",
        description: `Order #${selectedOrderId} has been deleted.`,
      });
      setDeleteConfirmOpen(false);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete order: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update order status mutation
  const updateOrderStatus = async ({
    orderId,
    status,
  }: {
    orderId: string;
    status: string;
  }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/update/${orderId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update order status");
    }

    return response.json();
  };

  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (data, variables) => {
      toast({
        title: "Status updated",
        description: `Order status has been updated to ${variables.status}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update status: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Function to handle view order
  const handleViewOrder = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  // Function to handle delete order
  const handleDeleteOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setDeleteConfirmOpen(true);
  };

  // Function to confirm delete
  const confirmDelete = () => {
    if (selectedOrderId) {
      deleteMutation.mutate(selectedOrderId);
    }
  };
  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  // Format orders data for the table
  const formatOrdersForTable = (orders: Order[] = []) => {
    return orders.map((order) => ({
      id: order._id,
      orderSlug: order.orderSlug,
      date: new Date(order.createdAt).toLocaleDateString(),
      customer: {
        name: "Customer", // Replace with actual customer data if available
        email: "customer@example.com", // Replace with actual customer data if available
      },
      product: {
        name: `Order ${order.orderSlug}`,
        description: `${order.products.length} product(s)`,
        image: "/placeholder.svg?height=75&width=75",
      },
      total: `${order.totalAmount.toFixed(2)}`,
      payment: "Card", // Replace with actual payment method if available
      status: order.status,
    }));
  };

  // Columns for the orders table
  const columns = [
    {
      accessorKey: "orderSlug",
      header: "Order Id",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => <span>{row.original.orderSlug}</span>,
    },
    {
      accessorKey: "product",
      header: "Product",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => (
        <div className="flex items-center gap-3 py-3">
          {/* <Image
            src={row.original.product?.image || "/placeholder.svg"}
            // alt={row.original.product.name}
            alt="xxx"
            width={75}
            height={75}
            className="rounded-md"
          /> */}
          <div className="flex flex-col">
            <span className="font-medium">{row.original.product.name}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.product.description}
            </span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      accessorKey: "customer",
      header: "Customer",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any

      cell: ({ row }: any) => (
        // console.log("product", row.original.product),
        // console.log("row data",row),
        <div className="flex flex-col">
          <span>{row.original.customer.name}</span>
          <span className="text-xs text-muted-foreground">
            {row.original.customer.email}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "total",
      header: "Total",
    },
    {
      accessorKey: "payment",
      header: "Payment",
    },
    {
      accessorKey: "status",
      header: "Status",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 p-0">
              <OrderStatusBadge status={row.original.status} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {validStatuses.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() =>
                  updateStatusMutation.mutate({
                    orderId: row.original.id,
                    status,
                  })
                }
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
    {
      id: "actions",
      header: "Action",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: any) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewOrder(row.original.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/orders/edit/${row.original.id}`)}
          >
            <Edit className="h-4 w-4" />
          </Button> */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteOrder(row.original.id)}
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
          <h1 className="text-xl font-bold">Orders</h1>
        </div>

        <div className="flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search orders..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <div className="flex h-64 items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
              </div>
            ) : isError ? (
              <div className="flex h-64 items-center justify-center">
                <p className="text-red-500">
                  Error loading orders. Please try again.
                </p>
              </div>
            ) : (
              <>
                <DataTable
                  columns={columns}
                  data={formatOrdersForTable(data?.data.orders || [])}
                />

                {data?.data.pagination && (
                  <div className="flex items-center justify-between border-t p-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {(page - 1) * limit + 1} to{" "}
                      {Math.min(page * limit, data.data.pagination.total)} of{" "}
                      {data.data.pagination.total} entries
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        Previous
                      </Button>
                      <div className="text-sm">
                        Page {page} of {data.data.pagination.totalPages}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= data.data.pagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal
        title="Confirm Deletion"
        description={`Are you sure you want to delete order #${selectedOrderId}?`}
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowLeft, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Modal } from "@/components/modal";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrderStatusBadge } from "@/components/order-status-badge";



interface OrderProductCustomization {
  frontCustomizationPreview: string;
  logoImage: string;
  // Add other customization properties if they exist
}
// Define types directly in the component
interface OrderProduct {
  customization: OrderProductCustomization;
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

interface OrderResponse {
  status: boolean;
  message: string;
  order: Order;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const orderId = params.id as string;

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);

  // API functions defined directly in the component
  const fetchOrderDetails = async (orderId: string): Promise<OrderResponse> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/getallorders/${orderId}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch order details");
    }

    return response.json();
  };
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cancelOrder = async (orderId: string): Promise<any> => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/order/${orderId}/cancel`,
      {
        method: "PUT",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to cancel order");
    }

    return response.json();
  };

  // Fetch order details with TanStack Query
  const { data, isLoading, isError } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderDetails(orderId),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      toast({
        title: "Order deleted",
        description: `Order #${orderId} has been deleted.`,
      });
      setDeleteConfirmOpen(false);
      router.push("/orders");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete order: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Cancel mutation
  const cancelMutation = useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      toast({
        title: "Order cancelled",
        description: `Order #${orderId} has been cancelled.`,
      });
      setCancelConfirmOpen(false);
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to cancel order: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Function to confirm delete
  const confirmDelete = () => {
    deleteMutation.mutate(orderId);
  };

  // Function to confirm cancel
  const confirmCancel = () => {
    cancelMutation.mutate(orderId);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-500">
          Error loading order details. Please try again.
        </p>
      </div>
    );
  }

  const order = data?.order;
  if (!order) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p>Order not found</p>
      </div>
    );
  }

  // Format order products for display
  const orderItems = order.products.map((product, index) => ({
    id: index + 1,
    name: `Product ${index + 1}`,
    qty: product.quantity,
    size: "N/A",
    price: `${product.price.toFixed(2)}`,
    image: "/placeholder.svg?height=64&width=64",
  }));

  // Create order status timeline
  const getOrderProgressSteps = (status: string) => {
    const steps = [
      "Order Placed",
      "Processing",
      "Packed",
      "Shipping",
      "Delivered",
    ];

    const statusMap: { [key: string]: number } = {
      pending: 0,
      processing: 1,
      shipped: 3,
      delivered: 4,
      cancelled: -1,
    };

    const currentStep = statusMap[status] ?? -1;

    return steps.map((step, index) => ({
      name: step,
      description: getStatusDescription(step),
      completed: index <= currentStep,
      date: index <= currentStep ? "Completed" : "Pending",
    }));
  };

  const getStatusDescription = (step: string) => {
    switch (step) {
      case "Order Placed":
        return "An order has been placed.";
      case "Processing":
        return "Seller has processed your order.";
      case "Packed":
        return "Your order has been packed.";
      case "Shipping":
        return "Your order is on the way.";
      case "Delivered":
        return "Your order has been delivered.";
      default:
        return "";
    }
  };

  const orderStatus = getOrderProgressSteps(order.status);
// console.log("order",order.products)

const frontPreview = order.products[0]?.customization.frontCustomizationPreview;
const logoImage = order.products[0]?.customization.logoImage;
console.log("frontPreview", frontPreview);
console.log("logoImage", logoImage);
  return (
    <>


<div className="flex flex-col gap-8 p-4 md:flex-row md:items-start md:justify-between bg-white rounded-2xl shadow-md">
  <h2 className="text-xl font-semibold mb-4 md:w-full">Customization Preview</h2>

  <div className="flex flex-col items-center text-center">
    <Image
      src={frontPreview}
      width={300}
      height={300}
      alt="Front Customization"
      className="w-full max-w-xs rounded-xl shadow-sm mb-4"
    />
    <a
      href={frontPreview}
      download="front-preview.png"
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
    >
       Front image Preview
    </a>
  </div>

  <div className="flex flex-col items-center text-center">
    <Image
      width={300} 
      height={300}
      src={logoImage}
      alt="Logo Image"
      className="w-full max-w-xs rounded-xl shadow-sm mb-4"
    />
    <a
      href={logoImage}
      download="logo-image.png"
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
    >
       Logo Image Preview
    </a>
  </div>
</div>



      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Order #{order.orderSlug}</h1>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Order #{order.orderSlug}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm text-muted-foreground">Added</div>
                <div className="text-sm font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm text-muted-foreground">
                  Payment Method
                </div>
                <div className="text-sm font-medium">Card</div>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <div className="text-sm text-muted-foreground">
                  Shipping Method
                </div>
                <div className="text-sm font-medium">Standard Shipping</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 gap-1">
                <div className="text-sm font-medium">Customer</div>
                <div className="text-sm text-muted-foreground">
                  customer@example.com
                </div>
              </div>
              <div className="grid grid-cols-1 gap-1">
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="text-sm font-medium">customer@example.com</div>
              </div>
              <div className="grid grid-cols-1 gap-1">
                <div className="text-sm text-muted-foreground">Phone</div>
                <div className="text-sm font-medium">Not available</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Billing</div>
                <div className="text-sm font-medium">Not available</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Shipping</div>
                <div className="text-sm font-medium">Not available</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-4"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded-md"
                    />
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        QTY: {item.qty} pcs
                        <br />
                        Size: {item.size}
                      </div>
                    </div>
                  </div>
                  <div className="font-medium">{item.price}</div>
                </div>
              ))}

              <div className="space-y-2 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {orderStatus.map((status, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      status.completed ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    {status.completed ? (
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      <span className="text-xs text-white">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{status.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {status.description}
                    </div>
                    <div className="text-sm">{status.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          {/* {order.status !== "cancelled" && (
            <Button
              variant="outline"
              onClick={() => setCancelConfirmOpen(true)}
            >
              Cancel Order
            </Button>
          )} */}
          {/* <Button
            variant="outline"
            onClick={() => router.push(`/orders/edit/${orderId}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Order
          </Button> */}
          <Button
            variant="destructive"
            onClick={() => setDeleteConfirmOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete Order
          </Button>
        </div>
      </div>

      <Modal
        title="Confirm Deletion"
        description={`Are you sure you want to delete order #${order.orderSlug}?`}
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
      />

      <Modal
        title="Confirm Cancellation"
        description={`Are you sure you want to cancel order #${order.orderSlug}?`}
        isOpen={cancelConfirmOpen}
        onClose={() => setCancelConfirmOpen(false)}
        onConfirm={confirmCancel}
        confirmText="Cancel Order"
        confirmVariant="destructive"
      />
    </>
  );
}

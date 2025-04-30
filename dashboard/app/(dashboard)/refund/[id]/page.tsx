"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, X } from "lucide-react"
import Image from "next/image"

export default function RefundDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isNotApproveModalOpen, setIsNotApproveModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  const refundId = params.id

  // Mock refund data - in a real app, you would fetch this from an API
  const refundData = {
    id: refundId,
    orderNo: "#5585",
    total: "$565 (5 Products)",
    status: "Shipping",
    date: "8 Dec, 2025",
    reason:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 234 567 890",
    },
    items: [
      {
        id: 1,
        name: "T-Shirt",
        price: "$120.00",
        quantity: 2,
        image: "/placeholder.svg?height=64&width=64",
      },
      {
        id: 2,
        name: "Hoodie",
        price: "$85.00",
        quantity: 1,
        image: "/placeholder.svg?height=64&width=64",
      },
      {
        id: 3,
        name: "Cap",
        price: "$25.00",
        quantity: 1,
        image: "/placeholder.svg?height=64&width=64",
      },
    ],
  }

  const handleApprove = () => {
    toast({
      title: "Refund Approved",
      description: `Refund for order ${refundData.orderNo} has been approved.`,
    })
    router.push("/refund")
  }

  const handleNotApprove = () => {
    setRejectionReason("")
    setIsNotApproveModalOpen(true)
  }

  const handleCancelRefund = () => {
    if (rejectionReason.trim()) {
      toast({
        title: "Refund Rejected",
        description: `Refund for order ${refundData.orderNo} has been rejected.`,
      })
      router.push("/refund")
    } else {
      setIsNotApproveModalOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Refund Details</h1>
          <div className="flex items-center text-sm text-muted-foreground">
            <span>Dashboard</span>
            <span className="mx-2">/</span>
            <span>Refund</span>
            <span className="mx-2">/</span>
            <span>Order {refundData.orderNo}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{refundData.customer.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{refundData.customer.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{refundData.customer.phone}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-medium">{refundData.orderNo}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{refundData.date}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">
                  <span className="px-3 py-1 rounded-md text-white text-xs bg-red-600">{refundData.status}</span>
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-medium">{refundData.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Refund Reason</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{refundData.reason}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {refundData.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
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
                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="font-medium">{item.price}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button className="bg-green-500 hover:bg-green-600" onClick={handleApprove}>
          Approve
        </Button>
        <Button className="bg-red-600 hover:bg-red-700" onClick={handleNotApprove}>
          Not Approve
        </Button>
      </div>

      {/* Not Approve Modal */}
      <Dialog open={isNotApproveModalOpen} onOpenChange={setIsNotApproveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Not Approve</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNotApproveModalOpen(false)}
                className="h-6 w-6 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Input the reason......."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[120px] bg-gray-300"
            />
          </div>
          <div className="flex justify-end">
            <Button className="bg-red-600 hover:bg-red-700" onClick={handleCancelRefund}>
              Cancel Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

// Sample refund data
const refundData = Array(10)
  .fill(null)
  .map((_, index) => ({
    id: index + 1,
    orderNo: "#5585",
    total: "$565 (5 Products)",
    status: "Shipping",
    date: "8 Dec, 2025",
    reason:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  }));

export default function RefundPage() {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [isNotApproveModalOpen, setIsNotApproveModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const itemsPerPage = 4;
  const totalPages = Math.ceil(refundData.length / itemsPerPage);

  const paginatedRefunds = refundData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleApprove = (orderId: number) => {
    toast({
      title: "Refund Approved",
      description: `Refund for order #${orderId} has been approved.`,
    });
  };

  const handleNotApprove = (orderId: number) => {
    setSelectedOrderId(orderId);
    setRejectionReason("");
    setIsNotApproveModalOpen(true);
  };

  const handleCancelRefund = () => {
    if (selectedOrderId && rejectionReason.trim()) {
      toast({
        title: "Refund Rejected",
        description: `Refund for order #${selectedOrderId} has been rejected.`,
      });
    }
    setIsNotApproveModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Customer</h1>
        <div className="flex items-center text-sm text-muted-foreground">
          <span>Dashboard</span>
          <span className="mx-2">/</span>
          <span>Refund</span>
          <span className="mx-2">/</span>
          <span>Refund Sheet</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-xl font-semibold">Refund Sheet</h2>
            <Button variant="outline" size="sm">
              Filters
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 py-3 text-left font-medium">Order No</th>
                  <th className="px-4 py-3 text-left font-medium">Total</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-left font-medium">Reason</th>
                  <th className="px-4 py-3 text-left font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRefunds.map((refund) => (
                  <tr key={refund.id} className="border-b">
                    <td className="px-4 py-4">{refund.orderNo}</td>
                    <td className="px-4 py-4">{refund.total}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-md bg-red-600 px-3 py-1 text-xs text-white">
                        {refund.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">{refund.date}</td>
                    <td className="max-w-md px-4 py-4">
                      <p className="line-clamp-2">{refund.reason}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        <Button
                          className="w-full bg-green-500 hover:bg-green-600"
                          onClick={() => handleApprove(refund.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          className="w-full bg-red-600 hover:bg-red-700"
                          onClick={() => handleNotApprove(refund.id)}
                        >
                          Not Approve
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, refundData.length)} from{" "}
              {refundData.length}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 &&
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={currentPage === pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <PaginationItem>
                      <PaginationLink className="pointer-events-none opacity-50">
                        ...
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        isActive={currentPage === totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Not Approve Modal */}
      <Dialog
        open={isNotApproveModalOpen}
        onOpenChange={setIsNotApproveModalOpen}
      >
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
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleCancelRefund}
            >
              Cancel Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

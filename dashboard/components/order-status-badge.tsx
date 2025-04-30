interface OrderStatusBadgeProps {
  status: string;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  let bgColor = "bg-[#0A8200]";
  let statusText = status;

  switch (status.toLowerCase()) {
    case "cancelled":
      bgColor = "bg-[#C2272D]";
      statusText = "Cancelled";
      break;
    case "pending":
      bgColor = "bg-[#FFA526]";
      statusText = "Pending";
      break;
    case "paid":
      bgColor = "bg-[#0A8200]";
      statusText = "Paid";
      break;
    case "delivered":
      bgColor = "bg-[#0A8200]";
      statusText = "Delivered";
      break;
    default:
      bgColor = "bg-gray-500";
  }

  return (
    <div
      className={`flex h-[40px] max-w-[110px] items-center justify-center rounded-md px-3 py-1 text-xs text-white ${bgColor}`}
    >
      {statusText}
    </div>
  );
}

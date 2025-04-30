/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { DataTable } from "@/components/data-table";
// import { useParams, useRouter } from "next/navigation";
// import { Calendar, Mail, MapPin, Phone, User } from "lucide-react";
// import Image from "next/image";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";

// export default function CustomerDetailsPage() {
//   const params = useParams();
//   const router = useRouter();
//   const customerId = params.id;

//   // In a real app, you would fetch this data from an API
//   const customerData = {
//     id: customerId,
//     name: "Linda Blair",
//     username: "@lindablair",
//     image:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Customer%20Details1-L57R53NssXbVkWOiJ2TtY58kPcCgYW.png",
//     userId: "ID-01121",
//     email: "lindablair@mail.com",
//     phone: "050 414 8778",
//     address: "1833 Bel Meadow Drive, Fontana, California 92335, USA",
//     lastTransaction: "12 December 2022",
//   };

//   // Sample transaction data
//   const transactionData = [
//     {
//       id: "#5585",
//       total: "$565 (5 Products)",
//       status: "Shipping",
//       date: "8 Dec, 2025",
//     },
//     {
//       id: "#54858",
//       total: "$565 (5 Products)",
//       status: "Packing",
//       date: "8 Dec, 2025",
//     },
//     {
//       id: "#59658",
//       total: "$565 (5 Products)",
//       status: "Shipping",
//       date: "8 Dec, 2025",
//     },
//     {
//       id: "#25885",
//       total: "$565 (5 Products)",
//       status: "Packing",
//       date: "8 Dec, 2025",
//     },
//     {
//       id: "#54885",
//       total: "$565 (5 Products)",
//       status: "Cancelled",
//       date: "8 Dec, 2025",
//     },
//     {
//       id: "#55545",
//       total: "$565 (5 Products)",
//       status: "Pending",
//       date: "8 Dec, 2025",
//     },
//     {
//       id: "#5552",
//       total: "$565 (5 Products)",
//       status: "Cancelled",
//       date: "8 Dec, 2025",
//     },
//   ];

//   // Columns for the transaction table
//   const columns = [
//     {
//       accessorKey: "id",
//       header: "Order No",
//     },
//     {
//       accessorKey: "total",
//       header: "Total",
//     },
//     {
//       accessorKey: "status",
//       header: "Status",
//       cell: ({ row }: any) => {
//         const status = row.original.status;
//         let bgColor = "bg-green-500";

//         if (status === "Cancelled") {
//           bgColor = "bg-red-500";
//         } else if (status === "Pending") {
//           bgColor = "bg-yellow-500";
//         } else if (status === "Shipping") {
//           bgColor = "bg-red-500";
//         } else if (status === "Packing") {
//           bgColor = "bg-black";
//         }

//         return (
//           <div className={`rounded-md px-3 py-1 text-xs text-white ${bgColor}`}>
//             {status}
//           </div>
//         );
//       },
//     },
//     {
//       accessorKey: "date",
//       header: "Date",
//     },
//     {
//       id: "actions",
//       header: "Action",
//       cell: ({ row }: any) => (
//         <Button
//           variant="link"
//           onClick={() => router.push(`/orders/${row.original.id}`)}
//         >
//           View Details
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-4">
//         <h1 className="text-xl font-bold">Customer</h1>
//       </div>
//       <div>
//         <div>
//           <Breadcrumb>
//             <BreadcrumbList>
//               <BreadcrumbItem>
//                 <BreadcrumbLink href="/dashboard" className="#272727">
//                   Dashboard
//                 </BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator />
//               <BreadcrumbItem>
//                 <BreadcrumbLink href="/customers" className="#595959">
//                   Customers
//                 </BreadcrumbLink>
//               </BreadcrumbItem>
//               <BreadcrumbSeparator />
//               <BreadcrumbLink href="/customers" className="#595959">
//                 Customer Details
//               </BreadcrumbLink>
//             </BreadcrumbList>
//           </Breadcrumb>
//         </div>
//       </div>
//       <div className="grid gap-6 md:grid-cols-3">
//         <Card className="md:col-span-1">
//           <CardContent className="p-6">
//             <div className="flex flex-col items-center text-center">
//               <div className="relative mb-4">
//                 <Image
//                   src={customerData.image || "/placeholder.svg"}
//                   alt={customerData.name}
//                   width={120}
//                   height={120}
//                   className="rounded-full"
//                 />
//               </div>
//               <h2 className="text-xl font-bold">{customerData.name}</h2>
//               <p className="text-sm text-muted-foreground">
//                 {customerData.username}
//               </p>

//               <div className="mt-6 w-full space-y-4">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
//                     <User className="h-4 w-4 text-gray-600" />
//                   </div>
//                   <div className="flex flex-col">
//                     <span className="text-sm text-muted-foreground">
//                       User ID
//                     </span>
//                     <span className="font-medium">{customerData.userId}</span>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
//                     <Mail className="h-4 w-4 text-gray-600" />
//                   </div>
//                   <div className="flex flex-col">
//                     <span className="text-sm text-muted-foreground">
//                       Billing Email
//                     </span>
//                     <span className="font-medium">{customerData.email}</span>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
//                     <Phone className="h-4 w-4 text-gray-600" />
//                   </div>
//                   <div className="flex flex-col">
//                     <span className="text-sm text-muted-foreground">
//                       Phone Number
//                     </span>
//                     <span className="font-medium">{customerData.phone}</span>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
//                     <MapPin className="h-4 w-4 text-gray-600" />
//                   </div>
//                   <div className="flex flex-col">
//                     <span className="text-sm text-muted-foreground">
//                       Delivery Address
//                     </span>
//                     <span className="font-medium">{customerData.address}</span>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
//                     <Calendar className="h-4 w-4 text-gray-600" />
//                   </div>
//                   <div className="flex flex-col">
//                     <span className="text-sm text-muted-foreground">
//                       Latest Transaction
//                     </span>
//                     <span className="font-medium">
//                       {customerData.lastTransaction}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="md:col-span-2">
//           <CardHeader>
//             <CardTitle>Transaction History</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <DataTable columns={columns} data={transactionData} />
//             <div className="mt-4 text-sm text-muted-foreground">
//               Showing 1-10 from 100
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
} from "lucide-react";

export default function CustomerDetailsPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Customer</h1>
        </div>
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard" className="#272727">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/customers" className="#595959">
                  Customers
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbLink href="/customers" className="#595959">
                Customer Details
              </BreadcrumbLink>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Customer Profile Card */}
        <Card className="md:col-span-1">
          <CardContent className="p-0">
            <div className="relative">
              <div className="h-24 rounded-t-lg bg-gradient-to-r from-blue-400 to-purple-500"></div>
              <div className="absolute left-1/2 top-12 -translate-x-1/2 transform">
                <Avatar className="h-[144px] w-[144px]">
                  <AvatarImage
                    src="https://res.cloudinary.com/dwleppd1x/image/upload/v1742957673/samples/woman-on-a-football-field.jpg"
                    alt="Linda Blair"
                  />
                  <AvatarFallback>LB</AvatarFallback>
                </Avatar>
              </div>
              <div className="pb-4 pt-24 text-center">
                <h2 className="text-xl font-semibold">Linda Blair</h2>
                <p className="text-sm font-medium text-[#545454] mt-2">@lindablair</p>
              </div>
            </div>
            <div className="space-y-4 px-4 pb-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-2">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[18px] text-[#545454] font-medium">User ID</p>
                  <p className="text-[16px] font-medium text-[#272727]">ID-011221</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-2">
                  <Mail className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[18px] text-[#545454] font-medium">Billing Email</p>
                  <p className="text-[16px] font-medium text-[#272727]">lindablair@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-2">
                  <Phone className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[18px] text-[#545454] font-medium">Phone Number</p>
                  <p className="text-[16px] font-medium text-[#272727]">050 414 8778</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-2">
                  <MapPin className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[18px] text-[#545454] font-medium">
                    Delivery Address
                  </p>
                  <p className="text-[16px] font-medium text-[#272727]">1133 Bel Meadow Drive,</p>
                  <p className="text-[16px] font-medium text-[#272727]">
                    Fontana, California 92335, USA
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-muted p-2">
                  <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[18px] text-[#545454] font-medium">
                    Latest Transaction
                  </p>
                  <p className="text-[16px] font-medium text-[#272727]">12 December 2022</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <div className="rounded-lg border border-[#B0B0B0] md:col-span-2 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between py-5">
            <h2 className="px-[20px] text-2xl font-semibold">
              Transaction History
            </h2>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#D3D3D3]">
                  <th className="px-4 py-5 text-left text-[20px] font-medium">
                    Order No
                  </th>
                  <th className="px-4 py-3 text-left text-[20px] font-medium">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-[20px] font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-[20px] font-medium">
                    Date
                  </th>
                  <th className="px-4 py-3 text-right text-[20px] font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-3 text-[16px] font-semibold text-[#555656]">#5585</td>
                  <td className="px-4 py-3 text-sm">$565 (5 Products)</td>
                  <td className="px-4 py-3">
                    <Badge className="bg-red-600 hover:bg-red-700">
                      Shipping
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">8 Dec, 2025</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="link" size="sm" className="text-sm">
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">#54858</td>
                  <td className="px-4 py-3 text-sm">$565 (5 Products)</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className="bg-black text-white hover:bg-black/90"
                    >
                      Packing
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">8 Dec, 2025</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="link" size="sm" className="text-sm">
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">#59658</td>
                  <td className="px-4 py-3 text-sm">$565 (5 Products)</td>
                  <td className="px-4 py-3">
                    <Badge className="bg-red-600 hover:bg-red-700">
                      Shipping
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">8 Dec, 2025</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="link" size="sm" className="text-sm">
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">#25885</td>
                  <td className="px-4 py-3 text-sm">$565 (5 Products)</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className="bg-black text-white hover:bg-black/90"
                    >
                      Packing
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">8 Dec, 2025</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="link" size="sm" className="text-sm">
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">#54885</td>
                  <td className="px-4 py-3 text-sm">$565 (5 Products)</td>
                  <td className="px-4 py-3">
                    <Badge className="bg-green-600 hover:bg-green-700">
                      Cancelled
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">8 Dec, 2025</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="link" size="sm" className="text-sm">
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">#55545</td>
                  <td className="px-4 py-3 text-sm">$565 (5 Products)</td>
                  <td className="px-4 py-3">
                    <Badge className="bg-orange-500 hover:bg-orange-600">
                      Pending
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">8 Dec, 2025</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="link" size="sm" className="text-sm">
                      View Details
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm">#5552</td>
                  <td className="px-4 py-3 text-sm">$565 (5 Products)</td>
                  <td className="px-4 py-3">
                    <Badge className="bg-green-600 hover:bg-green-700">
                      Cancelled
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm">8 Dec, 2025</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="link" size="sm" className="text-sm">
                      View Details
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between border-t border-[#B0B0B0] py-10 px-4">
            <p className="text-sm text-muted-foreground">
              Showing 1-10 from 100
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="default" size="sm" className="h-8 w-8 p-0">
                1
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                2
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                3
              </Button>
              <span className="text-muted-foreground">...</span>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                17
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

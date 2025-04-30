"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  orderId: string;
  orderAmount: string;
  status: "active" | "out of stock";
  created: string;
  avatar: string;
};

const data: Customer[] = [
  {
    id: "1",
    name: "Philip",
    email: "philip@example.com",
    phone: "(277) 555-0113",
    orderId: "#17187",
    orderAmount: "$723.00",
    status: "active",
    created: "Jan 24, 2020",
    avatar:
      "https://res.cloudinary.com/dwleppd1x/image/upload/v1742957673/samples/woman-on-a-football-field.jpg",
  },
  {
    id: "2",
    name: "Wade",
    email: "wade@example.com",
    phone: "(480) 555-0103",
    orderId: "#35133",
    orderAmount: "$723.00",
    status: "out of stock",
    created: "Jan 24, 2020",
    avatar:
      "https://res.cloudinary.com/dwleppd1x/image/upload/v1742957673/samples/woman-on-a-football-field.jpg",
  },
  {
    id: "3",
    name: "Francisco",
    email: "francisco@example.com",
    phone: "(270) 555-0117",
    orderId: "#24649",
    orderAmount: "$723.00",
    status: "active",
    created: "Jan 19, 2020",
    avatar:
      "https://res.cloudinary.com/dwleppd1x/image/upload/v1742957673/samples/woman-on-a-football-field.jpg",
  },
  {
    id: "4",
    name: "Dustin",
    email: "dustin@example.com",
    phone: "(207) 555-0119",
    orderId: "#35760",
    orderAmount: "$723.00",
    status: "active",
    created: "Feb 1, 2020",
    avatar:
      "https://res.cloudinary.com/dwleppd1x/image/upload/v1742957673/samples/woman-on-a-football-field.jpg",
  },
  {
    id: "5",
    name: "Robert",
    email: "robert@example.com",
    phone: "(406) 555-0120",
    orderId: "#50929",
    orderAmount: "$723.00",
    status: "out of stock",
    created: "Jan 20, 2020",
    avatar:
      "https://res.cloudinary.com/dwleppd1x/image/upload/v1742957673/samples/woman-on-a-football-field.jpg",
  },
  {
    id: "6",
    name: "Nathan",
    email: "nathan@example.com",
    phone: "(239) 555-0108",
    orderId: "#19340",
    orderAmount: "$723.00",
    status: "active",
    created: "Jan 20, 2020",
    avatar:
      "https://res.cloudinary.com/dwleppd1x/image/upload/v1742957673/samples/woman-on-a-football-field.jpg",
  },
  {
    id: "7",
    name: "Floyd",
    email: "floyd@example.com",
    phone: "(252) 555-0126",
    orderId: "#46014",
    orderAmount: "$723.00",
    status: "active",
    created: "Jan 19, 2020",
    avatar:
      "https://res.cloudinary.com/dwleppd1x/image/upload/v1742957673/samples/woman-on-a-football-field.jpg",
  },
  {
    id: "8",
    name: "Cody",
    email: "cody@example.com",
    phone: "(316) 555-0116",
    orderId: "#40922",
    orderAmount: "$723.00",
    status: "out of stock",
    created: "Feb 1, 2020",
    avatar:
      "https://res.cloudinary.com/dwleppd1x/image/upload/v1742957673/samples/woman-on-a-football-field.jpg",
  },
  {
    id: "9",
    name: "Darrell",
    email: "darrell@example.com",
    phone: "(209) 555-0104",
    orderId: "#63508",
    orderAmount: "$723.00",
    status: "active",
    created: "Jan 19, 2020",
    avatar:
      "https://res.cloudinary.com/dwleppd1x/image/upload/v1742957673/samples/woman-on-a-football-field.jpg",
  },
  {
    id: "10",
    name: "Randall",
    email: "randall@example.com",
    phone: "(704) 555-0127",
    orderId: "#56889",
    orderAmount: "$723.00",
    status: "active",
    created: "Jan 19, 2020",
    avatar:
      "https://res.cloudinary.com/dwleppd1x/image/upload/v1742957673/samples/woman-on-a-football-field.jpg",
  },
];

export function CustomersTabels() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<Customer>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Customer Name",
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <Link href={`/customers/${customer.id}`}>
            <div className="my-[32px] flex items-center gap-3">
              <Avatar className="h-[75px] w-[75px] rounded">
                <AvatarImage src={customer.avatar} alt={customer.name} />
                <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-lg font-medium">{customer.name}</span>
                <span className="text-[12px] font-normal text-[#707070]">
                  {customer.email}
                </span>
              </div>
            </div>
          </Link>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "orderId",
      header: "Orders",
    },
    {
      accessorKey: "orderAmount",
      header: "Order Amount",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={status === "active" ? "success" : "destructive"}
            className="capitalize"
          >
            {status === "active" ? "Active" : "Out of stock"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "created",
      header: "Created",
    },
    {
      id: "actions",
      header: "Action",
      cell: ({}) => {
        return (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-lg border border-[#B0B0B0]">
        <Table>
          <TableHeader className="bg-[#E6E6E6]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="px-5 py-8 text-[#000000]"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="border border-b-[#B0B0B0]"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="mx-4 text-sm text-muted-foreground">
            Showing 1-10 from 100
          </div>

          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}

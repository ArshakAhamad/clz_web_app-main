import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ClassesTable({ 
  classes, 
  isLoading, 
  error, 
  page, 
  setPage, 
  pageSize, 
  setPageSize, 
  totalItems, 
  totalPages,
  onUpdateClass 
}) {
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!classes || classes.length === 0) return <div>No classes found.</div>

  const pageSizeOptions = [5, 10, 20, 50]

  const renderPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 3
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationItem key={i}>
          <PaginationLink onClick={() => setPage(i)} isActive={page === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return pageNumbers
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Class Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Fee</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((classItem) => (
            <TableRow key={classItem.classId}>
              <TableCell>{classItem.className}</TableCell>
              <TableCell>{classItem.classDate}</TableCell>
              <TableCell>{classItem.location}</TableCell>
              <TableCell>{classItem.type}</TableCell>
              <TableCell>{classItem.classFee}</TableCell>
              <TableCell>
                <Button onClick={() => onUpdateClass(classItem)}>Update</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex items-center justify-between">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => setPage(page - 1)} disabled={page === 1} />
            </PaginationItem>
            {renderPageNumbers()}
            <PaginationItem>
              <PaginationNext onClick={() => setPage(page + 1)} disabled={page === totalPages} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <div className="flex items-center space-x-2">
          <span>Rows per page:</span>
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-[70px]">
              <SelectValue>{pageSize}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          Page {page} of {totalPages}
        </div>
      </div>
    </div>
  )
}
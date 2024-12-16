import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { StaffTable } from "@/components/Views/StaffTable"
import { StaffUpdateForm } from "@/components/Forms/StaffUpdateForm"
import { useStaff } from "@/hooks/useStaff"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

export default function Staff() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { staff, isLoading, error, refetch } = useStaff(searchTerm)

  const filteredStaff = useMemo(() => {
    return staff.filter(staffMember => 
      staffMember.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffMember.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [staff, searchTerm])

  const paginatedStaff = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    return filteredStaff.slice(startIndex, startIndex + pageSize)
  }, [filteredStaff, page, pageSize])

  const totalPages = Math.ceil(filteredStaff.length / pageSize)

  const suggestions = useMemo(() => {
    return filteredStaff
      .slice(0, 5)
      .map(staffMember => ({ userId: staffMember.userId, username: staffMember.username }))
  }, [filteredStaff])

  const handleSearch = (value) => {
    setSearchTerm(value)
    setPage(1)
  }

  const handleUpdateStaff = (updatedStaff) => {
    console.log("Updating staff:", updatedStaff)
    setSelectedStaff(null)
    refetch()
  }

  const handleSuggestionSelect = (suggestion) => {
    setSearchTerm(suggestion.username)
    setIsSearchOpen(false)
    const selectedStaffMember = staff.find(s => s.userId === suggestion.userId)
    if (selectedStaffMember) {
      setSelectedStaff(selectedStaffMember)
    }
  }

  return (
    <SidebarInset className="flex flex-col flex-1 w-full overflow-auto">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-6" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Staff</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Staff</h1>
          <Button onClick={() => navigate('/staff/create')}>Create New Staff</Button>
        </div>
        <div className="mb-4">
          <Command className="rounded-lg border shadow-md">
            <CommandInput 
              placeholder="Search staff..." 
              value={searchTerm} 
              onValueChange={handleSearch}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
            />
            {isSearchOpen && (
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  {suggestions.map((suggestion) => (
                    <CommandItem 
                      key={suggestion.userId} 
                      onSelect={() => handleSuggestionSelect(suggestion)}
                    >
                      {suggestion.username}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            )}
          </Command>
        </div>
        <StaffTable
          staff={paginatedStaff}
          isLoading={isLoading}
          error={error}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalItems={filteredStaff.length}
          totalPages={totalPages}
          onUpdateStaff={setSelectedStaff}
        />
        <Dialog open={!!selectedStaff} onOpenChange={() => setSelectedStaff(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Staff</DialogTitle>
              <DialogDescription>Update the details of the selected staff member.</DialogDescription>
            </DialogHeader>
            {selectedStaff && (
              <StaffUpdateForm
                staffData={selectedStaff}
                onUpdate={handleUpdateStaff}
                onCancel={() => setSelectedStaff(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </main>
    </SidebarInset>
  )
}
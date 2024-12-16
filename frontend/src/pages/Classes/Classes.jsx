import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ClassesTable } from "@/components/Views/ClassesTable"
import { ClassUpdateForm } from "@/components/Forms/ClassUpdateForm"
import { useClasses } from "@/hooks/useClasses"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

export default function Classes() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { classes, isLoading, error, refetch } = useClasses(searchTerm)

  const filteredClasses = useMemo(() => {
    return classes.filter(classItem => 
      classItem.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.classId.toString().includes(searchTerm)
    )
  }, [classes, searchTerm])

  const paginatedClasses = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    return filteredClasses.slice(startIndex, startIndex + pageSize)
  }, [filteredClasses, page, pageSize])

  const totalPages = Math.ceil(filteredClasses.length / pageSize)

  const suggestions = useMemo(() => {
    return filteredClasses
      .slice(0, 5)
      .map(classItem => ({ classId: classItem.classId, className: classItem.className }))
  }, [filteredClasses])

  const handleSearch = (value) => {
    setSearchTerm(value)
    setPage(1)
  }

  const handleUpdateClass = (updatedClass) => {
    console.log("Updating class:", updatedClass)
    setSelectedClass(null)
    refetch()
  }

  const handleSuggestionSelect = (suggestion) => {
    setSearchTerm(suggestion.className)
    setIsSearchOpen(false)
    const selectedClass = classes.find(c => c.classId === suggestion.classId)
    if (selectedClass) {
      setSelectedClass(selectedClass)
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
              <BreadcrumbPage>Classes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <Button onClick={() => navigate('/class/create')}>Create New Class</Button>
        </div>
        <div className="mb-4">
          <Command className="rounded-lg border shadow-md">
            <CommandInput 
              placeholder="Search classes..." 
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
                      key={suggestion.classId} 
                      onSelect={() => handleSuggestionSelect(suggestion)}
                    >
                      {suggestion.className}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            )}
          </Command>
        </div>
        <ClassesTable
          classes={paginatedClasses}
          isLoading={isLoading}
          error={error}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalItems={filteredClasses.length}
          totalPages={totalPages}
          onUpdateClass={setSelectedClass}
        />
        <Dialog open={!!selectedClass} onOpenChange={() => setSelectedClass(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Class</DialogTitle>
              <DialogDescription>Update the details of the selected class.</DialogDescription>
            </DialogHeader>
            {selectedClass && (
              <ClassUpdateForm
                classData={selectedClass}
                onUpdate={handleUpdateClass}
                onCancel={() => setSelectedClass(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </main>
    </SidebarInset>
  )
}
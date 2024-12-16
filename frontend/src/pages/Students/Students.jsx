import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { StudentTable } from "@/components/Views/StudentTable"
import { StudentUpdateForm } from "@/components/Forms/StudentUpdateForm"
import { useStudents } from "@/hooks/useStudent"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

export default function Students() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { 
    students, 
    isLoading, 
    error, 
    refetchStudents, // Updated refetch function
    updateExistingStudent 
  } = useStudents(searchTerm)

  const filteredStudents = useMemo(() => {
    return students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [students, searchTerm])

  const paginatedStudents = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    return filteredStudents.slice(startIndex, startIndex + pageSize)
  }, [filteredStudents, page, pageSize])

  const totalPages = Math.ceil(filteredStudents.length / pageSize)

  const suggestions = useMemo(() => {
    return filteredStudents
      .slice(0, 5)
      .map(student => ({ studentId: student.studentId, name: student.name }))
  }, [filteredStudents])

  const handleSearch = (value) => {
    setSearchTerm(value)
    setPage(1)
  }

  const handleUpdateStudent = async (updatedStudent) => {
    try {
      await updateExistingStudent(updatedStudent)
      setSelectedStudent(null)
      refetchStudents()  // Correct refetch function
    } catch (error) {
      console.error("Error updating student:", error)
    }
  }

  const handleSuggestionSelect = (suggestion) => {
    setSearchTerm(suggestion.name)
    setIsSearchOpen(false)
    const selectedStudent = students.find(s => s.studentId === suggestion.studentId)
    if (selectedStudent) {
      setSelectedStudent(selectedStudent)
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
              <BreadcrumbPage>Students</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <Button onClick={() => navigate('/student/create')}>Create New Student</Button>
        </div>
        <div className="mb-4">
          <Command className="rounded-lg border shadow-md">
            <CommandInput 
              placeholder="Search students..." 
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
                      key={suggestion.studentId} 
                      onSelect={() => handleSuggestionSelect(suggestion)}
                    >
                      {suggestion.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            )}
          </Command>
        </div>
        <StudentTable
          students={paginatedStudents}
          isLoading={isLoading}
          error={error}
          page={page}
          setPage={setPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          totalItems={filteredStudents.length}
          totalPages={totalPages}
          onUpdateStudent={setSelectedStudent}
        />
        <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update Student</DialogTitle>
              <DialogDescription>Update the details of the selected student.</DialogDescription>
            </DialogHeader>
            {selectedStudent && (
              <StudentUpdateForm
                studentData={selectedStudent}
                onUpdate={handleUpdateStudent}  // Correct onUpdate callback
                onCancel={() => setSelectedStudent(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </main>
    </SidebarInset>
  )
}

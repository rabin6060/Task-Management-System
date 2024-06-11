import { MouseEventHandler, useState } from "react"
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
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { deleteTasks, singleTask, updateStatus } from "@/api/task"
import { useTask } from "@/Context/TaskContext"
import {toast} from 'sonner'

import axios from "axios"
import { useActiveItems } from "@/Context/ActiveComponent"
import TaskDetail from "../DetailPage"
import { format } from "date-fns"
import {  SkeletonDemo } from "../Skeleton"
import { useRefresh } from "@/Context/RefreshPage"


const filterTags = (row:any, columnId:any, filterValue:any) => {
  const tagsArray = row.getValue(columnId); // Assuming this returns an array of strings
  if (Array.isArray(tagsArray)) {
    return tagsArray.some(tag => tag.toLowerCase().includes(filterValue.toLowerCase()));
  }
  return false;
};


type Task = {
   id?: string;
   _id:string;
   title:string;
  status: "Assigned" | "InProgress" | "Completed" ;
  priority: "low" | "medium" | "high";
  dueDate: string;
  assigner:{
    _id:string,
    username:string,
    email:string
  };
  tags:string[];
}

const priorityColor : {[key in Task["priority"]]:string} ={
  low:"text-teal-500",
  medium:"text-yellow-500",
  high:"text-red-500"
}
type priorityValue = Task["priority"]

const StatusColor : {[key in Task["status"]]:string} ={
  Assigned:"text-teal-500",
  InProgress:"text-yellow-500",
  Completed:"text-red-500"
}
type statusValue = Task["status"]




// Columns definition
const getColumns = (
  showSelectColumn: boolean,
  viewDetail: (id: string) => void,
  
  ): ColumnDef<Task>[] => {
  
  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Title
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "status",
      header: () => <div>Status</div>,
      cell: ({ row }) => {
        const StatusValue = row.getValue("status") as statusValue
    const statusColor = StatusColor[StatusValue]
    return <div className={statusColor}>{StatusValue}</div>
      }
    },
    {
      accessorKey: "priority",
      header: () => <div>Priority</div>,
      cell: ({ row }) => {
        const PriorityValue = row.getValue("priority") as priorityValue
    const PriorityColor = priorityColor[PriorityValue]
    return <div className={`${PriorityColor} capitalize`}>{PriorityValue}</div>
      }
    },
    {
      accessorKey: "assigner",
      header: () => <div className="text-right">Assigner</div>,
      cell: ({ row }) => <div className="text-right font-medium">{row.original.assigner?.username}</div>
    },
   {
  accessorKey: "tags",
  header: () => <div className="text-right">Tags</div>,
  cell: ({ row }) => {
    const tags = row.getValue("tags");

    return (
      <div className="text-right font-medium">
        {Array.isArray(tags) ? (
          tags.map((tag, index) => (
            <span key={index} className="text-teal-500 ml-1 bg-slate-100 p-2 rounded-full">{tag}</span>
          ))
        ) : (
          "No tags"
        )}
      </div>
    );
  },
  filterFn: filterTags
},
    {
      accessorKey: "dueDate",
      header: () => <div className="text-right">DueDate</div>,
      cell: ({ row }) => <div className="text-right font-medium">{format(row.getValue("dueDate"), 'MMMM d, yyyy h:mm a')}</div>
    },
    {
      id: "actions",
      header: () => <div>Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const tasks = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={()=>viewDetail(tasks._id)}>View Detail</DropdownMenuItem>
             
            </DropdownMenuContent>
            
          </DropdownMenu>
        )
      },
    },
  ];

  if (showSelectColumn) {
    columns.unshift({
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
    });
  }

  return columns;
};

interface TaskProps{
  task:Task[]
} 

export const List:React.FC<TaskProps> = ({task}) =>{
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const {setRefresh,loading} = useRefresh()
  const {activeItem,setActiveItem} = useActiveItems()
  const {setSingleTaskInfo} = useTask()
  
  const [showDetail,setShowDetail] = useState<boolean>(false)
  const [id,setId] = useState<string>('')

  const viewDetail = async(id:string) => {
    setShowDetail(true)
    setId(id)
     try {
    const res = await singleTask(id)
    if (!res) {
      toast.error("Oops. No task")
    }
    setSingleTaskInfo(res && res.data.data)
    toast.success("Task Fetched Successfully !!!")
  } catch (error:unknown) {
     if (axios.isAxiosError(error)) {
       if (error.response) {
        toast.error(error.response?.data?.message)
      }
     }
    }
  }
  
  const columns = getColumns(activeItem !== "Home",viewDetail)
  const table = useReactTable({
    data: task || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })
  const selectedRowTask = table.getRowModel().rows.filter(task=>Object.keys(rowSelection).includes(task.id))
  const selectedTask = selectedRowTask && selectedRowTask[0]?.original._id
  const res:string[] =[]
  selectedRowTask.map(task=>{
    res.push(task.original._id)
  })
  const deleteTask = async (id: string) => {
    try {
      await deleteTasks(id);
      toast.success("Deleted !!!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response?.data?.message);
        }
      }
    }
  };

  const handleBulkDelete = async (res: string[]) => {
    try {
      await Promise.all(res.map((id) => deleteTask(id)));
      toast.success("All selected tasks deleted successfully!");
      setRefresh(true)
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(error.response?.data?.message);
        }
      }
    }
  };
  
  const handleClick: MouseEventHandler<HTMLDivElement> =async (event) => {
    const item = (event.currentTarget as HTMLDivElement).innerText;
    
    try {
     const response =  await updateStatus(selectedTask,item)
     if (!response) {
      toast.error("update failed!!")
     }
     toast.success("Status Updated Successfully!!!")
     setRefresh(true)
     setActiveItem(item)
    } catch (error:unknown) {
     if (axios.isAxiosError(error)) {
       if (error.response) {
        toast.error(error.response.data.message)
      }
     }
    }
  };
  const getItemClasses = (item: string) =>
    ` cursor-pointer py-2 px-4 ${
      activeItem === item ? 'bg-teal-500' : ''
    }`;
  

  
  return (
    <section className="h-[80vh]">
      {
        loading ? <SkeletonDemo/>
        :
      <div className="h-full w-full relative">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter tags..."
            value={(table.getColumn("tags")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("tags")?.setFilterValue(event.target.value)
            }
            className="max-w-sm ml-4"
          />
          <Button onClick={()=>setRefresh(true)} type="button" className="ml-2 bg-teal-500 hover:bg-purple-500">Refresh</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
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
          
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2 flex">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
        
           {(activeItem !== "TaskCreated" && Object.values(rowSelection).some((value) => value === true)) ?  (
          <div
            className={`w-[320px] bg-slate-100 shadow-md rounded-full flex items-center justify-center overflow-hidden absolute -bottom-14 left-[50%] -translate-x-[50%] opacity-100 transition-all duration-200 ease-linear`}
          >
            <div
              className={`${getItemClasses('Assigned')} cursor-pointer border-r-2 border-teal-500`}
              onClick={handleClick}
            >
              Assigned
            </div>
            <div
              className={`${getItemClasses('InProgress')} cursor-pointer border-r-2 border-teal-500`}
              onClick={handleClick}
            >
              InProgress
            </div>
            <div className={getItemClasses('Completed')} onClick={handleClick}>
              Completed
            </div>
          </div>
        ):
          <Button type="button" onClick={()=>handleBulkDelete(res && res)}  className={`text-lg shadow-md rounded-full bg-teal-500  items-center justify-center overflow-hidden absolute -bottom-14 left-[50%] -translate-x-[50%] opacity-100 transition-all duration-200 ease-linear ${(res.length>0)? 'flex':'hidden'}`}>
            Delete
          </Button>
        }
          
          {
            showDetail && 
            <TaskDetail id={id} setShowDetail={setShowDetail}/>
          }
      </div>
      }
      
    </section>
    
  )
}

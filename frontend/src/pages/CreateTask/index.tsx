import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import axios from 'axios';

import { useUser } from '@/Context/UserContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Select as ShadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createTask } from '@/api/task';
import Select from 'react-select'
import { toast } from 'sonner';
import { useActiveItems } from '@/Context/ActiveComponent';
import { useRefresh } from '@/Context/RefreshPage';

interface Error {
  message: string;
  status: string;
}

export interface multiSelect {
  label:string | "",
  value:string | ""
}

// Define Zod schema for form validation
const taskSchema = z.object({
  title: z.string().trim().min(1, { message: 'Title is required' }),
  desc: z.string().trim().min(1, { message: 'Description is required' }),
  tags: z.array(z.string()).min(1, { message: 'At least one tag is required' }),
  assignee: z.array(z.string()).min(1, { message: 'At least one assignee is required' }),
  dueDate: z.string().min(1, { message: 'Due date is required' }),
  priority: z.enum(['low', 'medium', 'high'], { required_error: 'Priority is required' }),
  status: z.enum(['Assigned'], { required_error: 'Status is required' }),
  assigner: z.string().nullable(),
});

type FormValues = z.infer<typeof taskSchema>;



const Task = () => {
 const {setShow} = useActiveItems()
  
  const form = useForm<FormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      desc: '',
      tags: [''],
      assignee: [''],
      dueDate: '',
      priority: 'low',
      status: 'Assigned',
      assigner: '',
    },
  });
  const { control, handleSubmit } = form;
  
 const [selectedOption, setSelectedOption] = useState<multiSelect[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user,users } = useUser();
  const {setRefresh} = useRefresh()
  const {setActiveItem} = useActiveItems()
   const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState<string>('');

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTag(event.target.value);
  };

  const handleAddTag = () => {
    if (currentTag.trim() !== '') {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag(''); // Clear the input field after adding a tag
    }
  };
  const removeTag = (tag:string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(tag => tag !== tag));
    }
  }
  

  
  
  const allAssigneeMatra = users?.data.filter(use=>use?._id!==user?.data?._id)
  const assigneesInfo:string[] = []
  const ReDefineAssignee = (assignees:any) => {
    return assignees?.map((assignee:any)=>assigneesInfo.push(assignee.value))
 }
  ReDefineAssignee(selectedOption)
  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      setLoading(true);
      if (values.dueDate) {
        values.dueDate = format(new Date(values.dueDate), 'yyyy-MM-dd');
      }
      values.assigner = user && user.data._id;
      values.assignee = assigneesInfo
      values.tags = tags
      const response = await createTask(values);
      if (!response) {
        toast.error("task creation failed")
      }
      setError(null);
      setShow(false);
      setLoading(false);
      setRefresh(true)
      setActiveItem("TaskCreated")
      toast.success("task created successFully!!")
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setLoading(false);
          setError(error.response.data);
          toast.error("error aayo haii!!!")
        }
      }
    }
  };
  
  return (
    <section className=" z-50 overflow-y-auto">
      <div className="w-full mx-auto h-full flex items-center justify-center py-20">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className=" w-full h-full space-y-2 sm:max-w-[90%]">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-5">
                  <FormLabel className="text-teal-500 text-lg">Title</FormLabel>
                  <FormControl>
                    <Input placeholder="title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="desc"
              render={({ field }) => (
                <FormItem className="space-y-5">
                  <FormLabel className="text-teal-500 text-lg">Desc</FormLabel>
                  <FormControl>
                    <Input placeholder="desc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem className="space-y-5">
              <FormLabel className="text-teal-500 text-lg flex">Tags</FormLabel>
              <Input type="text" placeholder='enter the tag' value={currentTag} onChange={handleTagChange} />
              <Button type="button" className='bg-teal-500 hover:bg-purple-500' onClick={handleAddTag}>Add Tag</Button>
              {
                tags.length > 0 ?
                <div>
                  {
                    tags.map(tag=>(
                      <div className='bg-slate-100 shadow-md inline px-2 py-1 rounded-full cursor-pointer mr-2' onClick={()=>removeTag(tag)}>{tag} <span className='text-red-500'>x</span></div>
                    ))
                  }
                </div>
                :
                <div>
                  no tag
                </div>
              }
              <FormMessage />
            </FormItem>
            <FormField
              control={control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-500 text-lg">Priority</FormLabel>
                  <ShadSelect onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the priority order." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="text-teal-500 text-sm">
                      <SelectItem value="low" className="cursor-pointer">Low</SelectItem>
                      <SelectItem value="medium" className="cursor-pointer">Medium</SelectItem>
                      <SelectItem value="high" className="cursor-pointer">High</SelectItem>
                    </SelectContent>
                  </ShadSelect>
                  <FormDescription className="text-teal-500 text-sm">Choose the priority level.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-teal-500 text-lg">Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-[240px] pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? format(new Date(field.value), 'PPP') : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={new Date(field.value)}
                        onSelect={(date) => field.onChange(date ? date.toISOString() : '')}
                        disabled={(date) => date >= new Date("2025-01-01") || date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription className="text-teal-500 text-sm">Choose the due date.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-500 text-lg">Status</FormLabel>
                  <ShadSelect onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the status." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Assigned" className="text-teal-500 text-sm">Assigned</SelectItem>
                    </SelectContent>
                  </ShadSelect>
                  <FormDescription className="text-teal-500 text-sm">Select the task status.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="assignee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-teal-500 text-lg">Assignee</FormLabel>
                  <Select
                    isMulti
                    options={allAssigneeMatra?.map((assignee) => ({ value: assignee._id, label: assignee.username }))}
                    value={selectedOption}
                    onChange={(selected) => {
                      setSelectedOption(selected as multiSelect[]);
                      field.onChange(selected.map(option => option?.value));
                    }}
                    className="text-teal-500"
                  />
                  <FormDescription className="text-teal-500 text-sm">Select the assignees.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

          
            
            <div className="w-full flex items-center justify-center">
              
              <Button type="submit" className="w-full bg-teal-500 hover:bg-purple-500">
                {!(loading) ? 'Create Task' : 'Processing...'}
              </Button>
            </div>
            <div>{error?.message}</div>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default Task;

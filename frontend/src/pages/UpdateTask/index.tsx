import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
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
import { updateTask } from '@/api/task';
import Select from 'react-select'
import { toast } from 'sonner';
import { useActiveItems } from '@/Context/ActiveComponent';
import { useTask } from '@/Context/TaskContext';
import { useRefresh } from '@/Context/RefreshPage';

interface Error {
  message: string;
  status: string;
}

// Define Zod schema for form validation
const taskSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  desc: z.string().min(1, { message: 'Description is required' }),
  tags: z.array(z.string()).min(1, { message: 'At least one tag is required' }),
  assignee: z.array(z.string()).min(1, { message: 'At least one assignee is required' }),
  dueDate: z.string().min(1, { message: 'Due date is required' }),
  priority: z.enum(['low', 'medium', 'high'], { required_error: 'Priority is required' }),
  status: z.enum(['Assigned','InProgress','Completed'], { required_error: 'Status is required' }),
  assigner: z.string().nullable(),
});

type FormValues = z.infer<typeof taskSchema>;



const Updated = () => {
 const {singleTaskInfo} = useTask()
  const {setShowUpdate} = useActiveItems()
  const form =useForm<FormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title:singleTaskInfo?.title || ''  ,
      desc: singleTaskInfo?.desc || '',
      tags: singleTaskInfo?.tags || [''],
      assignee: singleTaskInfo?.assignee || [''],
      dueDate: singleTaskInfo?.dueDate || '',
      priority: singleTaskInfo?.priority || 'low',
      status: singleTaskInfo?.status,
      assigner: '',
    },
  });
  
  const { control, register, handleSubmit } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tags',
  });
 const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user,users } = useUser();
  const {setRefresh} = useRefresh()
  
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
      const response = await updateTask(singleTaskInfo?._id,values);
      if (response) {
        setError(null);
        setShowUpdate(false);
        setRefresh(true)
      }
      setLoading(false);
      toast.success("updated successFully!!")
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setLoading(false);
          setError(error.response.data);
          toast.error(error.response?.data?.message)
        }
      }
    }
  };
 console.log(singleTaskInfo)
  
  return (
    <section className=" z-50 overflow-y-auto">
      <div className="w-full mx-auto h-full flex items-center justify-center py-20">
      {singleTaskInfo &&  <Form {...form}>
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
              <FormLabel className="text-teal-500 text-lg">Tags</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <FormControl>
                    <Input
                      {...register(`tags.${index}` as const)}
                      defaultValue={'tags'} 
                      placeholder="tags"
                    />
                  </FormControl>
                  <Button type="button" onClick={() => remove(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" className='bg-teal-500 hover:bg-purple-500' onClick={() => append('')}>Add Tag</Button>
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
                        disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
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
                      setSelectedOption(selected);
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
                {!(loading) ? 'Update Task' : 'Processing...'}
              </Button>
            </div>
          </form>
        </Form>}
      </div>
    </section>
  );
};

export default Updated;

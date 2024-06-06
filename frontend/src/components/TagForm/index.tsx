import { Form, useForm } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUser } from "@/Context/UserContext";
import { addTag } from "@/api/tag";
import axios from "axios";

const form = useForm({
    defaultValues: {
      tag: ''
    },
  });
  

const TagForm = () => {
    const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const {user ,task} = useUser()
  async function onSubmit(values: any) {
    console.log(values)
    try {
      setLoading(true);
      values.taskId = task && task.data._id;
      values.userId = user && user.data._id;
      const response = await addTag(values);
      if (response) {
        setError(null);
      }
      setLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setLoading(false);
          setError(error.response.data);
        }
      }
    }
  }
  return (
      <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full sm:max-w-[60%]">
              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem className="space-y-5">
                    <FormLabel>Add a Tag</FormLabel>
                    <FormControl>
                      <Input placeholder="tag" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="w-full flex items-center justify-center">
                <Button type="submit" className="w-full bg-purple-500">
                  {!loading ? 'Add Tag' : 'Adding...'}
                </Button>
              </div>
              <div>{error?.message}</div>
            </form>
          </Form>
  )
}

export default TagForm
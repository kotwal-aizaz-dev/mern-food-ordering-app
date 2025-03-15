import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import LoadingButton from "../../LoadingButton";
import { Button } from "../../ui/button";
import { User } from "types";
import { useEffect } from "react";

// Define the form schema using zod
const formSchema = z.object({
  email: z.string().optional(),
  name: z.string().min(1, "name is required"),
  addressLine1: z.string().min(1, "address Line 1 is required"),
  city: z.string().min(1, "city is required"),
  country: z.string().min(1, "country is required"),
});

// Define the form data type based on the schema
type UserFormData = z.infer<typeof formSchema>;

// Define the prop types for the component
type Props = {
  onSave: (userProfileData: UserFormData) => void;
  isLoading: boolean;
  currentUser: User;
};

// Component
const UserProfileForm = ({ onSave, isLoading, currentUser }: Props) => {
  // initialize the react hook form with zod resolver and default values
  const form = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: currentUser,
  });

  // effect to reload the form if the user has changed
  useEffect(() => {
    form.reset(currentUser);
  }, [currentUser, form]);

  // React hook form JSX
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSave)}
        className="space-y-4 bg-gray-50 rounded-lg md:p-10"
      >
        {/* Form heading  */}
        <div className="">
          <h2 className="text-2xl font-bold">User Profile Form</h2>
          <FormDescription>
            View and change your profile information here
          </FormDescription>
        </div>
        {/* Form fields  */}
        {/* email field*/}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} disabled className="bg-white " />
              </FormControl>
            </FormItem>
          )}
        />
        {/* name field*/}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white " />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col md:flex-row gap-4">
          {/* addres line 1 field */}
          <FormField
            control={form.control}
            name="addressLine1"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Address Line 1</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white " />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* city field*/}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white " />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* country field*/}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white " />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* if the form is loading show the loading button else show the submit button */}
        {isLoading ? (
          <LoadingButton />
        ) : (
          <Button type="submit" className="bg-orange-500 cursor-pointer">
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
};

export default UserProfileForm;

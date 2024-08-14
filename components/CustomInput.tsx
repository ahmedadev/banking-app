
import {FormField, FormLabel, FormControl, FormMessage} from "./ui/form";
import {Input} from "./ui/input";
import {z} from "zod";
import {Control} from "react-hook-form";
import { AuthFormSchema } from '@/lib/utils';


const CustomInput = ({
  control,
  name,
  label,
  placeholder,
  type = "text"}:{
  control: Control<z.infer<typeof formSchema>>;
  name: keyof z.infer<typeof formSchema>;
  label: string;
  placeholder: string;
    type?: "password" | "text" | "date";
  className?:string
  }) => {
    const formSchema = AuthFormSchema(type);
  return (
    
    <FormField
      control={control}
      name={name}
        render={({field}) => (
        <div className="form-item w-full">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex flex-col w-full">
            <FormControl>
              <Input
                placeholder={placeholder}
                className={"input-class"}
                {...field}
                type={type}
                id={name}
              />
            </FormControl>
            <FormMessage className="form-message mt-2"></FormMessage>
          </div>
        </div>
      )}
    />
  );
};
export default CustomInput;

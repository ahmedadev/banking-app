"use client";

import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import {Form} from "@/components/ui/form";
import {AuthFormSchema} from "@/lib/utils";
import {Loader2} from "lucide-react";
import CustomInput from "@/components/CustomInput";
import {SignIn, SignUp} from "@/lib/actions/user.actions";
import {defaultUser} from "@/store/global";
import {useRouter} from "next/navigation";

const AuthForm = ({type}: {type: string}) => {
  const formSchema = AuthFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      birthOfDate: "",
      ssn: "",
      email: "",
      password: "",
    },
  });
  const [IsLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(defaultUser);
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (type === "sign-up") {
        const newUser = await SignUp(data);
        setUser(newUser);
      }
      if (type === "sign-in") {
        const response = await SignIn({
          email: data.email,
          password: data.password,
        });
        if (response) {
          router.push("/");
        }
      }
      
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-6 md:gap-8">
        <Link href="/" className="flex items-center cursor-pointer gap-1">
          <Image
            src={"/icons/logo.svg"}
            alt={"Horizon Logo"}
            width={34}
            height={34}
          />
          <h1 className="text-26 font-bold font-ibm-plex-serif text-black-1">
            Horizon
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
            {user !== defaultUser
              ? "Link Account"
              : type === "sign-in"
              ? "Sign In"
              : "Sign Up"}
            <p className="text-16 font-normal text-gray-600">
              {user !== defaultUser
                ? "Link your account to get started"
                : "Please enter your details"}
            </p>
          </h1>
        </div>
      </header>
      {user !== defaultUser ? (
        <div className="flex flex-col gap-4"></div>
      ) : (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {type === "sign-up" && (
                <>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name={"firstName"}
                      label={"First Name"}
                      placeholder={"Enter your first name"}
                      type={"text"}
                    />
                    <CustomInput
                      control={form.control}
                      name={"lastName"}
                      label={"Last Name"}
                      placeholder={"Enter your last name"}
                      type={"text"}
                    />
                  </div>
                  <CustomInput
                    control={form.control}
                    name={"address"}
                    label={"Address1"}
                    placeholder={"Enter your specific address"}
                    type={"text"}
                  />
                  <CustomInput
                    control={form.control}
                    name={"city"}
                    label={"City"}
                    placeholder={"Enter your city"}
                    type={"text"}
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name={"state"}
                      label={"State"}
                      placeholder={"Example: NY"}
                      type={"text"}
                    />
                    <CustomInput
                      control={form.control}
                      name={"postalCode"}
                      label={"Postal Code"}
                      placeholder={"Example: 1101"}
                      type={"text"}
                    />
                  </div>
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name={"birthOfDate"}
                      label={"Birth of Date"}
                      placeholder={"YYYY-MM-DD"}
                      type={"date"}
                    />
                    <CustomInput
                      control={form.control}
                      name={"ssn"}
                      label={"SSN"}
                      placeholder={"Example: 1234"}
                      type={"text"}
                    />
                  </div>
                </>
              )}
              <CustomInput
                control={form.control}
                name={"email"}
                label={"Email"}
                placeholder={"Enter your Email"}
                type={"text"}
              />
              <CustomInput
                control={form.control}
                name={"password"}
                label={"Password"}
                placeholder={"Enter your Password"}
                type={"password"}
              />
              <div className="flex flex-col gap-4">
                <Button type="submit" className="form-btn" disabled={IsLoading}>
                  {IsLoading ? (
                    <>
                      <Loader2 size={24} className="animate-spin" /> &nbsp;
                      Loading...
                    </>
                  ) : type === "sign-in" ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <footer className="flex justify-center gap-1">
            <p className="text-14 text-gray-600 font-normal">
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
            </p>
            <Link
              href={type === "sign-in" ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {type === "sign-in" ? "Sign Up" : "Sign In"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

export default AuthForm;

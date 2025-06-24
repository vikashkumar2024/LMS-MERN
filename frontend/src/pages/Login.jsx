import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authapi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginInput, setloginInput] = useState({ email: "", password: "" });
  const [signupInput, setsignupInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [
    registerUser,
    { data: registerData, error: registerError, isLoading: registerIsLoading, isSuccess: registerIsSuccess }
  ] = useRegisterUserMutation();

  const [
    loginUser,
    { data: loginData, error: loginError, isLoading: loginIsLoading, isSuccess: loginIsSuccess }
  ] = useLoginUserMutation();

  const navigate = useNavigate();

  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setsignupInput({ ...signupInput, [name]: value });
    } else {
      setloginInput({ ...loginInput, [name]: value });
    }
  };

  const handleRegistration = async (type) => {
    const inputData = type === "signup" ? signupInput : loginInput;
    const action = type === "signup" ? registerUser : loginUser;

    try {
      const response = await action(inputData).unwrap();
      console.log("Success:", response);
    } catch (err) {
      console.error("Error:", err);
      alert(err?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
  if (registerIsSuccess && registerData) {
    toast.success(registerData.message || "Signup successful.");
    setsignupInput({ name: "", email: "", password: "" });
  }

  if (registerError) {
    const message =
      registerError?.data?.message || registerError?.error || "Signup failed";
    toast.error(message);
  }

  if (loginIsSuccess && loginData) {
    toast.success(loginData.message || "Login successful.");
    setloginInput({ email: "", password: "" });
    navigate("/");
  }

  if (loginError) {
    const message =
      loginError?.data?.message || loginError?.error || "Login failed";
    toast.error(message);
  }
}, [
  loginIsSuccess,
  registerIsSuccess,
  loginError,
  registerError,
  loginData,
  registerData,
  navigate, // always include navigate in dependencies
]);


  return (
    <div className="flex items-center w-full justify-center mt-16">
      <Tabs className="w-[400px]" defaultValue="Login">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">signup</TabsTrigger>
          <TabsTrigger value="Login">login</TabsTrigger>
        </TabsList>

        {/* Signup Tab */}
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Make changes to your account here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="signup-name">Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  onChange={(e) => changeInputHandler(e, "signup")}
                  name="name"
                  value={signupInput.name}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  onChange={(e) => changeInputHandler(e, "signup")}
                  name="email"
                  value={signupInput.email}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  onChange={(e) => changeInputHandler(e, "signup")}
                  name="password"
                  value={signupInput.password}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={registerIsLoading} onClick={() => handleRegistration("signup")}>
                {registerIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    please wait
                  </>
                ) : (
                  "signup"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Login Tab */}
        <TabsContent value="Login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Change your password here. After saving, you'll be logged out.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  onChange={(e) => changeInputHandler(e, "login")}
                  name="email"
                  value={loginInput.email}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  onChange={(e) => changeInputHandler(e, "login")}
                  name="password"
                  value={loginInput.password}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={loginIsLoading} onClick={() => handleRegistration("login")}>
                {loginIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    please wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;

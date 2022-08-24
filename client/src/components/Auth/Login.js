import React, { useState } from "react";
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const navigate = useNavigate();
  const handleLogin = async () => {
    if (!email || !password) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "content-type": "application/json",
        },
      };
      setLoading(true);
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      toast({
        title: "Registered successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("user", JSON.stringify(data));
      setLoading(false);
      navigate('/chat');
    
    } catch (error) {
      console.log(error);
      toast({
        title: "Registered failed",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      return;

    }
  };

  return (
    <VStack spacing="10px">
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        onClick={handleLogin}
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        isLoading={loading}
      >
        Login
      </Button>
      <Button variant="solid" colorScheme="red" width="100%"
      onClick={()=>{
        setEmail("demo@example.com");
        setPassword("123");
      }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
}

export default Login;

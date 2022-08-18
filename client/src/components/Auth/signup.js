import React from "react";
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import FileBase64 from "react-file-base64";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const handleClick = () => setShow(!show);

  const handleLogin = async() => {
    console.log(name, email, password, confirmPassword);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Password and confirmPassword do not match",
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
      setLoading(true)
      const {data} = await axios.post("/api/user",{name,password,email,pic}, config)
      toast({
        title: "Registered successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("user", JSON.stringify(data));
      setLoading(false)
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
      return;

    }
  };

  return (
    <VStack spacing="10px">
      <FormControl id="name" isRequired>
        <FormLabel>First Name</FormLabel>
        <Input
          value={name}
          type="text"
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
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
      <FormControl id="confirm_password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={confirmPassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Confirm password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>profile</FormLabel>
        <FileBase64
          type="file"
          multiple={false}
          onDone={({ base64 }) => setPic(base64)}
        />
      </FormControl>
      <Button
        onClick={handleLogin}
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
         isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
}

export default Signup;

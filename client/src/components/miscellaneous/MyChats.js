import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSender, getSenderFull, NongetSenderFull } from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";
import GroupChatModal from "./GroupChatModal";
import { io } from "socket.io-client";

function MyChats() {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  
  const socket = io.connect("http://localhost:5000");

  const toast = useToast();

  // Fetch chats from API
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user")));
    fetchChats();
  }, []);

  useEffect(() => {
    // Listen for 'userOnline' event
    socket.on("userOnline", (userId) => {
      setOnlineUsers((prevUsers) => [...prevUsers, userId]);
    });

    // Listen for 'userOffline' event
    socket.on("userOffline", (userId) => {
      setOnlineUsers((prevUsers) => prevUsers.filter((id) => id !== userId));
    });

    // Cleanup on component unmount
    return () => {
      socket.off("userOnline");
      socket.off("userOffline");
    };
  }, []);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => {
              const sender = getSenderFull(loggedUser, chat.users);


              const isOnline = onlineUsers.includes(sender._id); // Check if sender is online

              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                  </Text>
                  
                  {!chat.isGroupChat && (
                    <Text color={isOnline ? "green" : "gray"} fontSize="xs">
                      {isOnline ? "Online" : "Offline"}
                    </Text>
                  )}

                  {chat.latestMessage && (
                    <Text fontSize="xs">
                      <b>{chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
              );
            })}
          </Stack>
        ) : (
          <span>No chats available</span>
        )}
      </Box>
    </Box>
  );
}

export default MyChats;

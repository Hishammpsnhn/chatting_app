import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGoupChatModal";
import ScrollableChat from "./ScrollableChat";
import "./style.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");
function SingleChat({ fetchAgain, setFetchAgain }) {
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const { user, selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();

  var selectedChatCompare;

  useEffect(() => {
    socket.emit("setup", user);
    socket.on("connected", (message) => setSocketConnected(true));
  }, []);

  useEffect(() => {
    fetchMessage();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const fetchMessage = async () => {
    if (!selectedChat) return;
    setLoading(true);
    console.log(selectedChat);
    try {
      const config = {
        headers: {
          "content-TypeError": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessage(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Failed to fetch message",
        description: " Failed to fetch message",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      console.log(selectedChat, newMessage);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage(" ");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        socket.emit("new Message", data);
        setMessage([...message, data]);
      } catch (error) {
        toast({
          title: "Failed to send message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    socket.on("message received", (newMessageRecived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecived.chat._id
      ) {
        //give notification
      } else {
        console.log(newMessageRecived);
        setMessage([...message, newMessageRecived]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // typin indicator
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "20px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat()}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat?.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessage}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={message} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage}>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="work sans">
            Click on a user to start chattting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;

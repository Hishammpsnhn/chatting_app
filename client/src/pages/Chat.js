import React, { useEffect, useState } from 'react'
import {Box} from "@chakra-ui/react"
import { ChatState } from '../Context/ChatProvider'
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/miscellaneous/MyChats';
import Chatbox from '../components/miscellaneous/Chatbox';


function Chat() {
const [fetchAgain,setFetchAgain] = useState(false)

const {user} = ChatState(); 
return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
        )}
      </Box>
    </div>
  )
}

export default Chat
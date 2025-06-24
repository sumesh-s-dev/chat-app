import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { setCurrentChatId, fetchMessages } from './store/chatSlice';
import NewChatModal from './NewChatModal';

const ChatSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { chats, currentChatId } = useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSelect = (chatId: string) => {
    dispatch(setCurrentChatId(chatId));
    dispatch(fetchMessages(chatId) as any);
  };

  const handleNewChat = (chatId?: string) => {
    setModalOpen(false);
    if (chatId) {
      handleSelect(chatId);
    }
  };

  return (
    <aside className="chat-sidebar">
      <h3>Chats</h3>
      <button className="new-chat-btn" onClick={() => setModalOpen(true)}>+ New Chat</button>
      <ul>
        {chats.map((chat: any) => (
          <li
            key={chat._id}
            className={chat._id === currentChatId ? 'active' : ''}
            onClick={() => handleSelect(chat._id)}
          >
            {chat.isGroup
              ? chat.name || 'Group Chat'
              : chat.users.filter((u: any) => u._id !== user.id)[0]?.username || 'Direct Chat'}
          </li>
        ))}
      </ul>
      <NewChatModal open={modalOpen} onClose={handleNewChat} />
    </aside>
  );
};

export default ChatSidebar; 
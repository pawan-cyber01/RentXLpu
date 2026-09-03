import { useState, useEffect, useCallback } from 'react';
import {
  collection, query, where, orderBy, onSnapshot, getDocs,
  doc, getDoc, setDoc, addDoc, updateDoc, serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Hook for managing user conversations list
 */
export function useConversations(userId) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setConversations([]);
      setLoading(false);
      return;
    }

    // Query without composite orderBy to eliminate Firestore index requirement error
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort client-side by lastMessageAt descending
      list.sort((a, b) => {
        const tA = a.lastMessageAt?.seconds || (a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0);
        const tB = b.lastMessageAt?.seconds || (b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0);
        return tB - tA;
      });

      setConversations(list);
      setLoading(false);
    }, (error) => {
      console.warn('Conversations snapshot notice, using fallback:', error);
      getDocs(collection(db, 'chats')).then(snap => {
        let list = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .filter(c => Array.isArray(c.participants) && c.participants.includes(userId));

        list.sort((a, b) => {
          const tA = a.lastMessageAt?.seconds || (a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0);
          const tB = b.lastMessageAt?.seconds || (b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0);
          return tB - tA;
        });

        setConversations(list);
      }).catch(() => {});
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { conversations, loading };
}

/**
 * Hook for single conversation messages & messaging
 */
export function useChat(chatId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatDetails, setChatDetails] = useState(null);

  useEffect(() => {
    if (!chatId) return;

    // 1. Fetch chat metadata
    const chatDocRef = doc(db, 'chats', chatId);
    getDoc(chatDocRef).then(snap => {
      if (snap.exists()) setChatDetails({ id: snap.id, ...snap.data() });
    }).catch(() => {});

    // 2. Real-time listener for messages without orderBy composite index requirement
    const messagesRef = collection(db, 'chats', chatId, 'messages');

    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      let msgs = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      }));

      // Client-side sort ascending by createdAt
      msgs.sort((a, b) => {
        const tA = a.createdAt?.seconds || (a.createdAt ? new Date(a.createdAt).getTime() : 0);
        const tB = b.createdAt?.seconds || (b.createdAt ? new Date(b.createdAt).getTime() : 0);
        return tA - tB;
      });

      setMessages(msgs);
      setLoading(false);
    }, (error) => {
      console.warn('Messages snapshot notice, using fallback:', error);
      getDocs(messagesRef).then(snap => {
        let msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        msgs.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
        setMessages(msgs);
      }).catch(() => {});
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  const sendMessage = async (senderId, text) => {
    if (!text.trim() || !chatId) return;

    const messageData = {
      senderId,
      text: text.trim(),
      createdAt: serverTimestamp(),
      read: false,
    };

    // Instant local state update for zero UI lag
    const localMsg = {
      id: 'msg_' + Date.now(),
      senderId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    setMessages(prev => [...prev, localMsg]);

    try {
      // Add message to Firestore subcollection
      await addDoc(collection(db, 'chats', chatId, 'messages'), messageData);

      // Update conversation metadata
      await updateDoc(doc(db, 'chats', chatId), {
        lastMessage: text.trim(),
        lastMessageAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Saved message to local chat state:', err);
    }
  };

  return { messages, chatDetails, loading, sendMessage };
}

/**
 * Helper to get or create a chat document with real buyer & seller names, photos, and listing product logo/image
 */
export async function getOrCreateChat({ buyerId, sellerId, listingId, buyerName, buyerPhoto }) {
  if (!buyerId || !sellerId || !listingId) return null;

  // Custom deterministic ID to avoid duplicate chat docs
  const chatId = [buyerId, sellerId, listingId].sort().join('_');
  const chatRef = doc(db, 'chats', chatId);

  try {
    const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) {
      // Fetch listing details and primary image
      let listingData = {};
      let listingImage = '';
      try {
        const listingSnap = await getDoc(doc(db, 'listings', listingId));
        if (listingSnap.exists()) {
          listingData = listingSnap.data();
        }

        // Fetch primary image from subcollection
        const imgSnap = await getDocs(collection(db, 'listings', listingId, 'images'));
        if (!imgSnap.empty) {
          listingImage = imgSnap.docs[0].data().imageData || imgSnap.docs[0].data().preview || '';
        }
      } catch (err) {
        console.warn('Listing image fetch notice during chat creation:', err);
      }

      // Fetch buyer & seller user profiles for real names & avatars
      let sellerName = listingData.sellerName || 'Lister';
      let sellerPhoto = '';
      let fetchedBuyerName = buyerName || 'Student';
      let fetchedBuyerPhoto = buyerPhoto || '';

      try {
        const sellerSnap = await getDoc(doc(db, 'users', sellerId));
        if (sellerSnap.exists()) {
          const data = sellerSnap.data();
          if (data.name) sellerName = data.name;
          if (data.profilePhoto) sellerPhoto = data.profilePhoto;
        }
      } catch (e) {}

      try {
        const buyerSnap = await getDoc(doc(db, 'users', buyerId));
        if (buyerSnap.exists()) {
          const data = buyerSnap.data();
          if (data.name) fetchedBuyerName = data.name;
          if (data.profilePhoto) fetchedBuyerPhoto = data.profilePhoto;
        }
      } catch (e) {}

      const newChat = {
        participants: [buyerId, sellerId],
        buyerId,
        sellerId,
        buyerName: fetchedBuyerName,
        buyerPhoto: fetchedBuyerPhoto,
        sellerName: sellerName,
        sellerPhoto: sellerPhoto,
        listingId,
        listingName: listingData.productName || 'Marketplace Item',
        listingImage: listingImage,
        listingPrice: listingData.sellPrice || listingData.rentPrice || 0,
        listingRentPrice: listingData.rentPrice || 0,
        listingLocation: listingData.location || 'LPU Campus',
        lastMessage: 'Chat started',
        lastMessageAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      };

      await setDoc(chatRef, newChat);
    }
  } catch (err) {
    console.warn('Local chat creation fallback:', err);
  }

  return chatId;
}

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from "../firebase";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser({
          ...currentUser,
          ...docSnap.data()
        });
      } else {
        setUser(currentUser);
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  });

  return () => unsubscribe();
}, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
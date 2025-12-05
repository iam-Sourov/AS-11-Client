import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase.config';



const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
        const [loading, setLoading] = useState(false);

    const signUp = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const LogIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const LogOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    const updateUser = (updatedData) => {
        return updateProfile(auth.currentUser, updatedData);
    };

    const GoogleLogin = () => {
        return signInWithPopup(auth, googleProvider);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false); // 
        });
        return () => unsubscribe();
    }, []);

    const AuthInfo = {
        user,
        setUser,
        loading,
        setLoading,
        signUp,
        LogIn,
        LogOut,
        GoogleLogin,
        updateUser,
    };

    return (
        <AuthContext.Provider value={AuthInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

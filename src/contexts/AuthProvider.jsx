import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase.config';
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signUp = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const LogIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const LogOut = () => {
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
            if (currentUser) {
                // Get token if needed
                // const token = await currentUser.getIdToken();
                // localStorage.setItem('access-token', token);
            } else {
                // localStorage.removeItem('access-token');
            }
            setLoading(false);
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
import { createContext, useState, useEffect, ReactNode } from 'react'
import { auth, firebase } from '../services/firebase'

type User = {

    id: string;
    name: string;
    avatar: string;
  
  }
  
  type AuthContextType = {
  
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
  
  }

export const AuthContext = createContext( {} as AuthContextType )

type AuthContextProviderProps = {

    children: ReactNode;

}
export const AuthContextProvider = ( props: AuthContextProviderProps ) => {

    useEffect( () => {

        const unsubscribe = auth.onAuthStateChanged( user => {
    
          if ( user ) {
    
            const { displayName, photoURL, uid } = user
    
            if ( !displayName || !photoURL ) {
    
              throw new Error('Missing information from Google account.')
    
            }
    
            setUser({
    
              id: uid,
              name: displayName,
              avatar: photoURL
    
            })
    
          }
    
        })
    
        return () => { unsubscribe() }
    
      }, [] )
      
      const [ user, setUser ] = useState<User>()
    
      // Authentication
      const signInWithGoogle = async () => {
    
        const provider = new firebase.auth.GoogleAuthProvider()
    
        const result = await auth.signInWithPopup( provider )
            
          if ( result.user ) {
    
            const { displayName, photoURL, uid } = result.user
    
            if ( !displayName || !photoURL ) {
    
              throw new Error('Missing information from Google account.')
    
            }
    
            setUser({
    
              id: uid,
              name: displayName,
              avatar: photoURL
    
            })
    
          }
        
      }

    return (

        <AuthContext.Provider value = {{ user, signInWithGoogle }}>

            { props.children }

        </AuthContext.Provider>

    )

}
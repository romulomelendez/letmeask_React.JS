import { useHistory } from 'react-router-dom'
import { FormEvent, useState } from 'react'

import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'

import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { database } from '../services/firebase'

import '../styles/auth.scss'


export const Home = () => {

    const [ roomCode, setRoomCode ] = useState('')
    
    // Initializing the work with Route
    const history = useHistory()
    const { user, signInWithGoogle } = useAuth()

    const handleCreateRoom = async () => {

        if ( !user ) {

            await signInWithGoogle()

        }

        history.push('/rooms/new')  // Route

    }

    const handleJoinRoom = async ( event: FormEvent ) => {

        event.preventDefault()

        if ( roomCode.trim() === '' ) {

            return

        }

        const roomRef = await database.ref(`/rooms/${ roomCode }`).get()
        
        if ( !roomRef.exists() ) {

            alert('Room does not exists!')
            return

        }

        if ( roomRef.val().endedAt ) {
            
            window.alert('Room already closed')
            return

        }

        history.push(`/rooms/${ roomCode }`)

    }


    return (

        <div id = "page-auth">

            <aside>

                <img src = { illustrationImg } alt = "Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo-real</p>

            </aside>

            <main>

                <div className = "main-content">

                    <img src = { logoImg } alt = "letmeask" />
                    <button className = "create-room" onClick = { handleCreateRoom }>

                        <img src = { googleIconImg } alt = "Logo do Google" />
                        Crie sua sala com o Google
                        
                    </button>

                    {/* Essa Div é uma linha de separação */}
                    <div className = "separator">Ou entre em uma sala</div>

                    <form onSubmit = { handleJoinRoom }>

                        <input
                        
                            type = "text"
                            placeholder = "Digite o código da sala"
                            onChange = { event => setRoomCode( event.target.value ) }
                            value = { roomCode }
                        
                        />

                        <Button type = "submit">Entrar na sala</Button>

                    </form>

                </div>

            </main>

        </div>

    )
    
}

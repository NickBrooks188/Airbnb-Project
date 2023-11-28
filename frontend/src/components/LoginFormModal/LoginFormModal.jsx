import { useState } from 'react'
import * as sessionActions from '../../store/session'
import { useDispatch } from 'react-redux'
import { useModal } from '../../context/Modal'
import './LoginForm.css'


function LoginFormModal() {
    const dispatch = useDispatch()
    const [credential, setCredential] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})
    const { closeModal } = useModal()

    const loginDemoUser = async () => {
        setErrors({})
        const data = await dispatch(sessionActions.login({ credential: 'demouser', password: 'password' }))
        if (data?.message) {
            setErrors(data)
        } else {
            closeModal()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        const data = await dispatch(sessionActions.login({ credential, password }))
        if (data?.message) {
            setErrors(data)
        } else {
            closeModal()
        }
    }

    return (
        <>
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={credential}
                    onChange={(e) => setCredential(e.target.value)}
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {errors.message && <span>The provided credentials were invalid</span>}
                <button type="submit" disabled={(credential.length < 4 || password.length < 6)}>Log In</button>
            </form>
            <div className='demoUser' onClick={loginDemoUser}>Log in as demo user</div>
        </>
    )
}

export default LoginFormModal
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



    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        const data = await dispatch(sessionActions.login({ credential, password }))
        console.log(data)
        if (data.message) {
            console.log(data)
            if (data?.message) setErrors(data)
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
            <div className='demo-user'>Demo user</div>
        </>
    )
}

export default LoginFormModal
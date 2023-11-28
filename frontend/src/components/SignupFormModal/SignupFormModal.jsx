import { useState } from 'react'
import { useDispatch } from 'react-redux'
import * as sessionActions from '../../store/session'
import { useModal } from '../../context/Modal'
import './SignupForm.css'

const SignupFormModal = () => {
    const dispatch = useDispatch()
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [errors, setErrors] = useState({})
    const { closeModal } = useModal()


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password === confirmPassword) {
            setErrors({})
            const data = await dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password
                })
            )
            if (data.errors) {
                setErrors(data.errors)
            } else {
                closeModal()
            }
        } else {
            setErrors({
                confirmPassword: "Confirm Password field must be the same as the Password field"
            })
        }
    }

    return (
        <>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit} className='signupForm'>
                <label>
                    Email
                    {errors.email && <span>{errors.email}</span>}
                    <input
                        type="text"
                        value={email}
                        placeholder='Email'
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Username
                    {errors.username && <span>{errors.username}</span>}
                    <input
                        type="text"
                        value={username}
                        placeholder='Username'
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                <label>
                    First Name
                    {errors.firstName && <span>{errors.firstName}</span>}
                    <input
                        type="text"
                        value={firstName}
                        placeholder='First Name'
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Last Name
                    {errors.lastName && <span>{errors.lastName}</span>}
                    <input
                        type="text"
                        value={lastName}
                        placeholder='Last Name'
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password
                    {errors.password && <span>{errors.password}</span>}
                    <input
                        type="password"
                        value={password}
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Confirm Password
                    {errors.confirmPassword && <span>{errors.confirmPassword}</span>}
                    <input
                        type="password"
                        value={confirmPassword}
                        placeholder='Confirm Password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit" disabled={password.length < 6 || username.length < 4 || confirmPassword.length < 6 || firstName.length < 1 || lastName.length < 1 || email.length < 1}>Sign Up</button>
            </form>
        </>
    )
}

export default SignupFormModal
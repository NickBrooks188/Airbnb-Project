import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import * as sessionActions from '../../store/session'

const ProfileButton = ({ user }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [showMenu, setShowMenu] = useState(false)
    const ulRef = useRef()

    const toggleMenu = (e) => {
        e.stopPropagation()
        setShowMenu(!showMenu)
    }

    useEffect(() => {
        if (!showMenu) return

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false)
            }
        }

        document.addEventListener('click', closeMenu)

        return () => document.removeEventListener("click", closeMenu)
    }, [showMenu])



    const logout = (e) => {
        e.preventDefault()
        dispatch(sessionActions.logout())
        navigate('/')
    }

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden")


    return (
        <>
            <button onClick={toggleMenu} className='profileButton'>
                <i className="fa-regular fa-user"></i>
            </button>
            <ul className={ulClassName} ref={ulRef}>
                <li className='profile-text'>Hello, {user.firstName}</li>
                <li className='profile-text extra-margin'>{user.email}</li>
                <li>
                    <Link to='/spots/current'>Manage Spots</Link>
                </li>
                <li>
                    <button onClick={logout}>Log Out</button>
                </li>
            </ul>
        </>
    )
}


export default ProfileButton
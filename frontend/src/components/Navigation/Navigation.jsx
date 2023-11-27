import { NavLink, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ProfileButton from './ProfileButton'
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import LoginFormModal from '../LoginFormModal/LoginFormModal'
import SignupFormModal from '../SignupFormModal/SignupFormModal'
import './Navigation.css'

function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user)

    const createNewSpot = (
        <Link to='/spots/new' className='newSpotLink' >Create a New Spot</Link>
    )
    let sessionLinks
    if (sessionUser) {
        sessionLinks = (
            <li>
                <ProfileButton user={sessionUser} />
            </li>
        )
    } else {
        sessionLinks = (
            <>
                <li>
                    <OpenModalButton
                        buttonText="Log In"
                        modalComponent={<LoginFormModal />}
                    />
                </li>
                <li className='signUp'>
                    <OpenModalButton
                        buttonText="Sign Up"
                        modalComponent={<SignupFormModal />}
                    />
                </li>
            </>
        )
    }

    return (
        <nav>
            <NavLink to="/" className='logo'><img src='https://i.postimg.cc/948WmvJ5/Spots-Logo.png' /></NavLink>
            <ul>
                {sessionUser && createNewSpot}
                {isLoaded && sessionLinks}
            </ul>

        </nav>
    )
}

export default Navigation
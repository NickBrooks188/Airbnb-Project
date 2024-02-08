import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getAllSpots } from '../../store/spots'
import SpotTile from '../SpotTile/SpotTile'
import { Link } from 'react-router-dom'
import './Home.css'


const Home = () => {
    const dispatch = useDispatch()
    const spots = useSelector((state) => state.spots)

    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch]);

    const spotsArr = Object.values(spots)

    if (!spotsArr.length) return null
    return (
        <>
            <h2>Spots</h2>
            <div className='spotTileWrapper'>
                {spotsArr.map((spot) => (<SpotTile spot={spot} key={spot.id} />)
                )}

            </div>
            <div className='footer'>
                Created by Nick Brooks • <Link to='https://github.com/NickBrooks188'><i className="fa-brands fa-github"></i></Link> <Link to='https://www.linkedin.com/in/nick-brooks-531661153/'><i className="fa-brands fa-linkedin"></i></Link>
            </div>
        </>

    )
}

export default Home
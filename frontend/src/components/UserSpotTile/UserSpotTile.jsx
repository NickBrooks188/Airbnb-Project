import { Link } from 'react-router-dom'
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import ConfirmSpotDeleteModal from './ConfirmSpotDeleteModal'
import './UserSpotTile.css'

const UserSpotTile = ({ spot }) => {
    return (
        <div className="userSpotTile">
            <div className='userTileContent'>
                <div className='spotTileImgWrapper'>
                    <img src={`${spot.previewImage}`} alt={spot.name} />
                </div>
                <div className='locationRatings'>
                    <p>{`${spot.city}, ${spot.state}`}</p>
                    <span>{`★ ${(spot.avgRating == "Not available") ? 'New' : spot.avgRating.toFixed(2)}`}</span>

                </div>
                <span>{`$${spot.price.toFixed(2)} night`}</span>
                <Link to={`/spots/${spot.id}/edit`}>
                    <button className='update'>Update</button>
                </Link>
                <OpenModalButton
                    buttonText="Delete"
                    className="delete"
                    modalComponent={<ConfirmSpotDeleteModal spotId={spot.id} />}
                />
            </div>
        </div>
    )
}

export default UserSpotTile
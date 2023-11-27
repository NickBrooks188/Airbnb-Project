import { Link } from 'react-router-dom'
import OpenModalButton from '../OpenModalButton/OpenModalButton'
import ConfirmSpotDeleteModal from '../ConfirmDeleteModal/ConfirmSpotDeleteModal'
import './UserSpotTile.css'

const UserSpotTile = ({ spot }) => {
    return (
        <div className="userSpotTile">
            <Link to={`/spots/${spot.id}`}>
                <div className='userTileContent'>
                    <div className='spotTileImgWrapper'>
                        <img src={`${spot.previewImage}`} alt={spot.name} />
                    </div>
                    <div className='locationRatings'>
                        <p>{`${spot.city}, ${spot.state}`}</p>
                        <span>{`★ ${(spot.avgRating == "Not available") ? 'New' : spot.avgRating.toFixed(2)}`}</span>

                    </div>
                    <span><b>${spot.price.toFixed(2)}</b> night</span>
                </div>
            </Link>
            <Link to={`/spots/${spot.id}/edit`}>
                <button className='update'>Update</button>
            </Link>
            <OpenModalButton
                buttonText="Delete"
                modalComponent={<ConfirmSpotDeleteModal spotId={spot.id} />}
            />
        </div>
    )
}

export default UserSpotTile
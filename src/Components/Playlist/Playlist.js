import React from 'react'
import TrackList from '../../Components/TrackList/TrackList.js'
import './Playlist.css'

class Playlist extends React.Component {
    constructor(props){
        super(props)
        this.handleNameChange = this.handleNameChange.bind(this)
    }
    handleNameChange(e){
        this.props.onNameChange(e.target.value)
    }
    render(){
        return (
            <div className="Playlist">
                {/* <form onSubmit={this.props.onSave}> */}
                    <input id="playlistnameinput" onChange={this.handleNameChange} placeholder="Enter Playlist Name" value={this.props.playlistName}/>
                    <TrackList onRemove={this.props.onRemove} isRemoval={true} tracks={this.props.playlistTracks}/>
                    <button className="Playlist-save" type='submit' onClick={this.props.onSave}>SAVE TO SPOTIFY</button>
                {/* </form> */}
            
        </div>
        )
    }
}

export default Playlist
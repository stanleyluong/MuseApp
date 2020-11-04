import './App.css'
import SearchBar from '../../Components/SearchBar/SearchBar.js'
import SearchResults from '../../Components/SearchResults/SearchResults.js'
import Playlist from '../../Components/Playlist/Playlist.js'
import React from 'react'
import Spotify from '../../util/Spotify.js'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      searchResults: [],
      playlistTracks: [],
      playlistName: "New Playlist"
    }
    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
  }
  addTrack(track){
    if(this.state.playlistTracks.find(savedTrack=>
      savedTrack.id === track.id)){
      return
    } else {
      let playlist = this.state.playlistTracks
      playlist.push(track)
      this.setState({
        playlistTracks: playlist
      })
    }
  }
  removeTrack(track){
    let newPlaylist = this.state.playlistTracks.filter(savedTrack=> savedTrack.id!==track.id)
    this.setState({
      playlistTracks: newPlaylist
    })
  }
  updatePlaylistName(name){
    this.setState({
      playlistName: name
    })
  }
  savePlaylist(){
    let uris = this.state.playlistTracks.map(track=> track.uri)
    console.log(uris)
    Spotify.savePlaylist(this.state.playlistName,uris)
    .then(()=>{
      alert(`Your playlist ${this.state.playlistName} has been saved to Spotify!`)
      console.log(this.state,'before set state')
      this.setState({
        playlistName: "New Playlist",
        playlistTracks: []
      },()=>{
        console.log(this.state,'during')
      })
      console.log(this.state,'after set state')
    })
  }
  search(term,e){
    e.preventDefault()
    Spotify.search(term).then(results=>{
      this.setState({
        searchResults: results
      })
    })
  }
  render(){
    return (
      <div>
        <h1>Muse<span className="highlight"></span>App</h1>
        <div className="App">
          <SearchBar 
            onSearch={this.search}/>
        <div className="App-playlist">
        <SearchResults 
            onAdd={this.addTrack} 
            searchResults={this.state.searchResults}/>
          <Playlist 
            onSave={this.savePlaylist} 
            onNameChange={this.updatePlaylistName} 
            onRemove={this.removeTrack} 
            playlistName={this.state.playlistName} 
            playlistTracks={this.state.playlistTracks}/>
        </div>
        </div>
      </div>
    );
  }

  componentDidMount(){
    Spotify.getAccessToken()
  }
}

export default App;

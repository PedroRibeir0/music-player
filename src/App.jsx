import { useEffect, useRef, useState } from 'react'
import './App.css'
import {BsFillPauseFill, BsFillPlayFill} from 'react-icons/bs'
import {AiFillBackward, AiFillForward} from 'react-icons/ai'
import {ImVolumeMute2, ImVolumeLow, ImVolumeMedium, ImVolumeHigh} from 'react-icons/im'
import { songs } from './songs'


function App() {

  const [currentSong, setCurrentSong] = useState(songs[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(50)
  const audioElement = useRef()
  const [progress, setProgress] = useState([0, '0:00']);
  function playPause(){
    setIsPlaying(!isPlaying)
  }

  function restart(){
    audioElement.current.currentTime = 0
  }

  function backward(){
    if (songs.indexOf(currentSong) > 0){
      setCurrentSong(songs[songs.indexOf(currentSong)-1])
    }else setCurrentSong(songs[2])

    setIsPlaying(false)
    setProgress(0)
  }

  function forward(){
    if (songs.indexOf(currentSong) <= 1){
    setCurrentSong(songs[songs.indexOf(currentSong)+1])
    }else setCurrentSong(songs[0])

    setIsPlaying(false)
    setProgress(0)
  }

  function playBar(){
    const duration = audioElement.current.duration
    const ct = audioElement.current.currentTime
    setProgress([(ct/duration) *100, time()])
  }


  function time(){
    let minutes = Math.trunc(audioElement.current.currentTime/60)
    let seconds = Math.trunc(audioElement.current.currentTime)
    return `${(minutes)}:${seconds-60*(Math.trunc(seconds/60)) < 10 ? `0${seconds-60*(Math.trunc(seconds/60))}` : seconds-60*(Math.trunc(seconds/60))}`
  }

  function changeRange(e){
    let width = e.currentTarget.clientWidth 
    let offset  = e.nativeEvent.offsetX
    let total = (offset * 100) / width
    audioElement.current.currentTime = Math.trunc(total/100 * audioElement.current.duration)
  }

  useEffect(()=>{
    if (isPlaying) audioElement.current.play()
    else audioElement.current.pause()
  }, [isPlaying])

  useEffect(()=>{
    audioElement.current.volume = volume/100
  }, [volume])

  return (
    <div className="app">
      <audio ref={audioElement} src={currentSong.src} onTimeUpdate={playBar}></audio>
      <img className='album-img' src="src/assets/album.png" alt=""/>
      <h2>{currentSong.name}</h2>
      <h4>{currentSong.artist}</h4>
      <div className="play-buttons">
        <AiFillBackward onDoubleClick={backward} onClick={restart} className='buttons'/>
        {isPlaying ? <BsFillPauseFill className='buttons' onClick={playPause}/> : <BsFillPlayFill className='buttons' onClick={playPause}/>}
        <AiFillForward onClick={forward} className='buttons'/>
      </div>
      <div id='timeline' onClick={changeRange}>
        <div id="range" style={{width: `${Math.trunc(progress[0])}%`}}></div>
      </div>
      <div className="time">
        <span>{progress[1]}</span>
        <span>{currentSong.duration}</span>
      </div>
      <div className="volume">
        {volume >= 66 ? <ImVolumeHigh className='volume-icon'/> : volume >= 33 ? <ImVolumeMedium className='volume-icon'/> : volume >0 ? <ImVolumeLow className='volume-icon'/> : <ImVolumeMute2 className='volume-icon'/>}
        
        <input 
        min={0}
        max={100}
        value={volume}
        onChange={e => setVolume(e.target.value)}
        type="range" 
        id="volume-input" />
      </div>
    </div>
  )
}

export default App

import React, { Component } from 'react';

import './App.css';


class Button extends React.Component {
  state = {
    hover: false
  }
  toggleHover =  () => {
    this.setState({hover: !this.state.hover})
  }
  render(){
    const buttonStyle = {
      backgroundColor: '#3d75b2',
      fontSize: '1.2rem',
      color: 'white',
      padding: '4px 16px',
      margin: '0 16px',
      border: 'solid 2px black',
      borderRadius: '6px',
      transition: 'all 0.3s ease 0s'
    }
    const hoverStyle = {
      backgroundColor: '#8AACD0',
      fontSize: '1.2rem',
      color: 'white',
      padding: '4px 16px',
      margin: '0 16px',
      border: 'solid 2px grey',
      borderRadius: '6px',
      cursor: 'pointer',
      letterSpacing: '1px',
      transition: 'all 0.3s ease 0s'
    }
    var nowStyle;
      if (this.state.hover) {
        nowStyle = hoverStyle
      } else {
        nowStyle = buttonStyle
    }
    return <button
      onMouseEnter={this.toggleHover}
      onMouseLeave={this.toggleHover}
      onClick={this.props.onClick}
      style={nowStyle}>{this.props.children}</button>

  }


}




class Door extends React.Component {
  state = {
    hover: false
  }
  toggleHover = () => {
    this.setState({hover: !this.state.hover})
  }

  render(){
    const doorStyleOpen = {
      backgroundColor: '#d7b1b1',
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'all 0.5s',
      transform: 'rotate3d(0, 1, 0, 60deg)',
      transformOrigin: '100% 0%'
    }
    const doorStyleClosed = {
      backgroundColor: '#ccc',
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      transition: 'all 0.5s'
    }
    const doorStyleClosedHover = {
      backgroundColor: '#B06364',
      height: '100%',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'all 0.5s',
      transform: 'rotate3d(0, 1, 0, 30deg)',
      transformOrigin: '100% 0%'
    }
    const doorknobStyle = {
      width: '1vmax',
      height: '1vmax',
      borderRadius: '50%',
      backgroundColor: 'black',
      marginLeft: '1vmax'
    }
    var nowStyle;
      if (this.state.hover) {
        nowStyle = doorStyleClosedHover
      } else {
        nowStyle = doorStyleClosed
    }
    return (

      <div
      style={{ border: 'solid 1px black', width: '10vmax', height: '22vmax',perspective: '1000px' }}
      onClick={this.props.onClick}
      onMouseEnter={this.toggleHover}
      onMouseLeave={this.toggleHover}>

        {this.props.isOpen
          ? (
            <div style={doorStyleOpen}>
              {this.props.isWinner
                ? <h2 style={{ color: "green",    paddingLeft: '13px' }}>CAR!</h2>
                : <h2 style={{ color: "red",    paddingLeft: '13px' }}>GOAT</h2>
              }
            </div>
          )
          : (
            <div style={nowStyle}>
              <div style={doorknobStyle} />
            </div>
          )
        }
      </div>
    )

  }

}

const WAITING_FOR_FIRST_GUESS = 'WAITING_FOR_FIRST_GUESS'
const WAITING_FOR_MONTY = 'WAITING_FOR_MONTY'
const WAITING_FOR_SECOND_GUESS = 'WAITING_FOR_SECOND_GUESS'
const GAME_WON = 'GAME_WON'
const GAME_LOST = 'GAME_LOST'

class MontyHall extends React.Component {
  state = {
    gameState: WAITING_FOR_FIRST_GUESS,
    firstGuess: null,
    secondGuess: null,
    doors: this.shufflePrize([{}, {}, {}]),
    wins: 0,
    losses: 0,
  }
  shufflePrize(doors) {
    doors = doors.map(door => ({ ...door, isWinner: false }))
    doors[Math.floor(Math.random() * doors.length)].isWinner = true
    return doors
  }
  onDoorClick = clickIdx => this.setState(({ gameState, doors, wins, losses }) => {
    switch(gameState) {
      case WAITING_FOR_FIRST_GUESS: return {
        gameState: WAITING_FOR_MONTY,
        firstGuess: clickIdx,
      }
      case WAITING_FOR_SECOND_GUESS: {
        doors = doors.map((door, idx) => idx === clickIdx ? { ...door, isOpen: true } : door)
        return doors[clickIdx].isWinner
          ? {
            gameState: GAME_WON,
            wins: wins + 1,
            secondGuess: clickIdx,
            doors,
          }
          : {
            gameState: GAME_LOST,
            losses: losses + 1,
            secondGuess: clickIdx,
            doors,
          }
      }
      default: return
    }
  })
  openDoor = () => this.setState(({ firstGuess, doors }) => {
    const idxToOpen = doors.findIndex(({ isWinner }, idx) => !isWinner && idx !== firstGuess)
    return {
      gameState: WAITING_FOR_SECOND_GUESS,
      doors: doors.map((door, idx) => idx === idxToOpen ? { ...door, isOpen: true } : door),
    }
  })
  playAgain = () => this.setState({
    gameState: WAITING_FOR_FIRST_GUESS,
    firstGuess: null,
    secondGuess: null,
    doors: this.shufflePrize([{}, {}, {}]),
  })
  render() {
    const { gameState, firstGuess, secondGuess, wins, losses } = this.state
    return (
      <div>
        <div>
          {{
            WAITING_FOR_FIRST_GUESS: (
              <h3>Behind one of these doors is a car!  Pick a door....</h3>
            ),
            WAITING_FOR_MONTY: (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <h3>To help you, I'm going to open one of the doors you DIDN'T pick...</h3>
                <Button onClick={this.openDoor}>Okay!</Button>
              </div>
            ),
            WAITING_FOR_SECOND_GUESS: (
              <h3>There you go!  Change your guess, or stick with your first...click on your
              final guess and good luck....</h3>
            ),
            GAME_WON: (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>Congratulations, enjoy your car, sport!</h3>
                <Button onClick={this.playAgain}>Play Again</Button>
              </div>
            ),
            GAME_LOST: (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <h3>No car insurance to worry about AND you get goat cheese - a winner in my book!</h3>
                <Button onClick={this.playAgain}>Play Again</Button>
              </div>
            ),
          }[gameState]}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '3vh 3vw' }}>
          {this.state.doors.map((door, idx) => (
            <div key={idx}>
              <Door {...door} onClick={() => this.onDoorClick(idx)} />
              <div style={{ textAlign: 'center' }}>
                {idx === firstGuess && <h4>First Guess!</h4>}
                {idx === secondGuess && <h4>Second Guess!</h4>}
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2>Cars: {wins} </h2>
          <h2>Goats: {losses} </h2>
        </div>
      </div>
    )
  }
}


export default MontyHall;

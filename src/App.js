import React from 'react';
import './App.css';

class App extends React.Component {
    render() {
        return (
            <div className="scroll-container">
                <div className="scroll-snap" style={{background: "red"}}>
                    This is the first div.
                </div>
                <div className="scroll-snap" style={{background: "green"}}>
                    This is the second div.
                </div>
                <div className="scroll-snap" style={{background: "blue"}}>
                    This is the third div.
                </div>
            </div>
        );
    }
}

export default App;


import './App.css'
// import Boards from './pages/Boards'
import Navbar from './components/Navbar'
import Board from './pages/Board'
import { abstract } from 'devstract';

function App() {
  

  return (
    <div className="flex h-screen flex-col">
    <Navbar />
      <div className="min-h-0 flex-1" style={{
            backgroundImage: `url("${abstract({
                width: 1920,
                height: 1080,
                seed: "12345",
                style: "waves",
                palette: "sunset",
            })}")`,
        }}>
        <Board /> 
      </div>
    </div>
  )
}

export default App

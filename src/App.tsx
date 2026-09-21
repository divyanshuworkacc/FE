
import './App.css'
import Navbar from './components/Navbar'
import { abstract } from 'devstract';

import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Boards from "./pages/Boards";
import Board from "./pages/Board";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
    return (
        <Routes>
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/boards"
                element={
                    <ProtectedRoute>
                        <div className="flex h-screen flex-col">
                            <Navbar />
                            <Boards />
                        </div>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/boards/:boardId"
                element={
                    <ProtectedRoute>
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
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
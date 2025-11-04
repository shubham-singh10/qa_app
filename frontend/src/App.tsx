import { Route, Routes } from "react-router-dom"
import Header from "./components/header"
import QuestionFeed from "./pages/qa/questionFeed"
import Login from "./pages/auth/login"
import Register from "./pages/auth/register"
import AskQuestion from "./pages/qa/askQuestion"
import QuestionDetail from "./pages/qa/questionDetail"
import ManagerDashboard from "./pages/managerDashboard"

function App() {

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<QuestionFeed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ask" element={<AskQuestion />} />
          <Route path="/questions/:id" element={<QuestionDetail />} />
          <Route path="/manager" element={<ManagerDashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

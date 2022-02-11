import { Welcome, Footer, Transactions } from './components';

const App = () => {
  return (
    <div className="min-h-screen">
      <Welcome />
      <Transactions />
      <Footer />
    </div>
  )
}

export default App;